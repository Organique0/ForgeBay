<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\TransformIdeas;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IdeaController extends Controller
{
	use TransformIdeas;
	public function index(Request $request)
	{
		//so like this is a game of ping pong
		//called cursor pagination
		//you send next data with next_cursor in it.
		//then you send the next_cursor as a cursor in the query
		//and you get data for that cursor
		//you repeat by sending the next_cursor to the client
		$query = $request->input('query', '');
		$cursor = $request->input('cursor');
		$orderBy = $request->input('orderBy', 'latest_created');
		$tags = $request->input('tags');
		$perPage = 10;

		$builder = Idea::where('active', true)
				->whereHas('tasks', function($query) {
			$query->where('status', 'to_do');
				});
		if ($query) {
			// Get IDs that match the search query
			$ids = Idea::search($query)->where('active', true)->get()->pluck('id');
			$builder->whereIn('id', $ids);
		}

		// Then apply tag filtering if tags are provided
		if ($tags) {
			$tagIds = explode(',', $tags);
			$builder->whereHas('tags', function ($q) use ($tagIds) {
				$q->whereIn('tags.id', $tagIds);
			});
		}

		switch ($orderBy) {
			case 'oldest_created':
				$builder->orderBy('created_at', 'asc');
				break;
			case 'latest_updated':
				$builder->orderBy('updated_at', 'desc');
				break;
			case 'oldest_updated':
				$builder->orderBy('updated_at', 'asc');
				break;
			case 'lowest_value':
				$builder->leftJoin('tasks', 'ideas.id', '=', 'tasks.idea_id')
					->select('ideas.*', DB::raw('COALESCE(SUM(tasks.value), 0) as total_value'))
					->groupBy('ideas.id')
					->orderBy('total_value');
				break;
			case 'highest_value':
				$builder->leftJoin('tasks', 'ideas.id', '=', 'tasks.idea_id')
					->select('ideas.*', DB::raw('COALESCE(SUM(tasks.value), 0) as total_value'))
					->groupBy('ideas.id')
					->orderByDesc('total_value');
				break;
			case 'most_applications':
				$builder->withCount('applications')->orderBy('applications_count', 'desc');
				break;
			case 'least_applications':
				$builder->withCount('applications')->orderBy('applications_count', 'asc');
				break;
			case 'most_tasks':
				$builder->withCount('tasks')->orderBy('tasks_count', 'desc');
				break;
			case 'least_tasks':
				$builder->withCount('tasks')->orderBy('tasks_count', 'asc');
				break;
			default:
				$builder->orderBy('created_at', 'desc')->orderBy('id', 'desc');
				break;
		}
		Log::info($builder->get());
		$ideas = $builder->cursorPaginate($perPage, ['*'], 'cursor', $cursor);


		//some stuff to transform ideas to be in the same format
		//independent of if there is a query or not.
		//and I already accept this data on the front so it has to be in this format.
		//and I get to pick how and what gets send.
		$ideas->through(fn($idea) => $idea->toSearchableArray());

		//send next cursor as an encoded string.
		//so that it looks better in the url.
		$nextCursor = $ideas->nextCursor() ? $ideas->nextCursor()->encode() : null;
		$prevCursor = $ideas->previousCursor() ? $ideas->previousCursor()->encode() : null;


		$allTags = Tag::select('id', 'name')->get();

		return Inertia::render('Ideas/Index', [
				'ideas' => [
						'data' => $ideas->items(),
						'next_cursor' => $nextCursor,
						'prev_cursor' => $prevCursor,
						'onLastPage' => !$ideas->hasMorePages(),
						'tags' => $allTags,
				],
				'filters' => ['query' => $query],
				'orderBy' => $orderBy,
		]);
	}

	public function show(string $id): \Inertia\Response
	{

		$idea = Idea::with(['tasks' => function ($query) {
			$query->withCount('applications');
		}, 'user', 'tags'])
			->findOrFail($id);

		$tagIds = $idea->tags->pluck('id');

		$recommendations = Idea::where('id', '!=', $idea->id)
			->where('active', true)
			->whereHas('tags', fn($q) => $q->whereIn('tags.id', $tagIds))
			->with([
				'tags',
				'tasks' => fn($q) => $q->withCount('applications'),
				'user'
			])
			->take(8)
			->get();

		$recommendations = $this->TransformIdeas($recommendations);


		if (!$idea) {
			abort(404);
		}

		return Inertia::render('IdeaPage', [
			'idea' => $idea,
			'recommendations' => $recommendations,
		]);
	}

	public function create(Request $request)
	{
		$tags = Tag::select('id', 'name')->get();
		return Inertia::render('Ideas/create', [
			'allTags' => $tags,
		]);
	}

	public function update(Request $request, string $id)
	{
		// Make sure the idea belongs to the currently authenticated user
		$idea = Idea::where('user_id', auth()->id())->findOrFail($id);

		// Validate the incoming request
		$validated = $request->validate([
			'title'           => 'required|string|max:255',
			'description'     => 'required|string',
			'status'          => 'required|boolean',
			'expirationDate'  => 'required|date_format:Y-m-d H:i:s',
		]);

		// Update fields
		$idea->title       = $validated['title'];
		$idea->description = $validated['description'];
		$idea->active      = $validated['status'];
		$idea->expires     = $validated['expirationDate'];
		$idea->save();

		return response()->json([
			'message' => 'Idea updated successfully!',
			'idea'    => $idea,
		]);
	}


	public function new(Request $request)
	{
		$validated = $request->validate([
			'title' => 'required|string|max:255',
			'description' => 'required|string',
			'tags' => 'array',
			'tags.*' => 'exists:tags,id',
		]);


		$idea = new Idea();
		$idea->title = $validated['title'];
		$idea->description = $validated['description'];
		$idea->user_id = auth()->id();
		$idea->active = true;
		$idea->expires = now()->addMonths(3);
		$idea->save();

		if (isset($validated['tags']) && !empty($validated['tags'])) {
			$idea->tags()->attach($validated['tags']);
		}

		return response()->json(['redirect' => route('tasks.index', $idea->id)]);
	}

	public function myIdeas(Request $request)
	{
		$ideas = Idea::where('user_id', auth()->id())
			->with([
				'tags',
				'tasks' => function ($query) {
					$query->withCount('applications');
				}
			])
			->latest()
			->get();

		return Inertia::render('Ideas/mine', [
			'ideas' => $ideas,
		]);
	}
}

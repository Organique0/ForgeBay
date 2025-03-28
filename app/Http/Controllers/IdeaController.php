<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\TransformIdeas;
use Illuminate\Support\Facades\DB;

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
			})
			->with([
				'user:id,name',
				'tags' => function($query) {
					$query->select('tags.id', 'tags.name')->pluck('name');
				}
			])
			->withSum('tasks as total_value', 'value')
			->withCount('tasks')
			->withCount(['tasks as applications_count' => function($query) {
				$query->withCount('applications')->selectRaw('sum(applications_count)');
			}]);


			// Get IDs that match the search query
			if($query) {
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
		$ideas = $builder->cursorPaginate($perPage, ['*'], 'cursor', $cursor);


		//some stuff to transform ideas to be in the same format
		//independent of if there is a query or not.
		//and I already accept this data on the front so it has to be in this format.
		//and I get to pick how and what gets send.
		//$ideas->through(fn($idea) => $idea->toSearchableArray());

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
				'user:id,name',
				'tags' => function ($query) {
					$query->select('tags.id', 'tags.name')->pluck('name');
				}
			])
			->withSum('tasks as total_value', 'value')
			->withCount('tasks')
			->withCount(['tasks as applications_count' => function ($query) {
				$query->withCount('applications')->selectRaw('sum(applications_count)');
			}])
			->take(8)
			->get();

		//$recommendations = $this->TransformIdeas($recommendations);


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

		// Transform tags array to just IDs
		if ($request->has('tags')) {
				$request->merge(['tags' => collect($request->tags)->pluck('id')->toArray()]);
		}

		// Validate the incoming request
		$validated = $request->validate([
				'title'           => 'required|string|max:255',
				'description'     => 'required|string',
				'status'          => 'required|boolean',
				'expirationDate'  => 'required|date_format:Y-m-d H:i:s',
				'tags'            => 'nullable|array',
				'tags.*'          => 'exists:tags,id',
		]);

		// Update fields
		$idea->title       = $validated['title'];
		$idea->description = $validated['description'];
		$idea->active      = $validated['status'];
		$idea->expires     = $validated['expirationDate'];
		$idea->save();


		if (isset($validated['tags']) && !empty($validated['tags'])) {
			$idea->tags()->sync($validated['tags']); // Use sync to update tags
		}


		return response()->json([
			'message' => 'Idea updated successfully!',
			'idea'    => $idea,
		]);
	}


	public function new(Request $request)
	{
		if ($request->has('tags')) {
			$request->merge(['tags' => collect($request->tags)->pluck('id')->toArray()]);
		}
		$validated = $request->validate([
			'title'           => 'required|string|max:255',
			'description'     => 'required|string',
			'expirationDate'  => 'required|date_format:Y-m-d H:i:s',
			'tags'            => 'nullable|array',
			'tags.*'          => 'exists:tags,id',
		]);


		$idea = new Idea();
		$idea->title = $validated['title'];
		$idea->description = $validated['description'];
		$idea->user_id = auth()->id();
		$idea->active = true;
		$idea->expires = $validated['expirationDate'];
		$idea->save();

		if (isset($validated['tags']) && !empty($validated['tags'])) {
			$idea->tags()->sync($validated['tags']);
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

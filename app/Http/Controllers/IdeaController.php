<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use App\Traits\TransformIdeas;

class IdeaController extends Controller
{
	use TransformIdeas;
	public function index(Request $request)
	{
		// $currentPage = $request->input('page', 1);
		// $perPage = 20;

		// $cacheKey = "ideas_page_{$currentPage}";
		// if ($cached = Cache::tags(['ideas_pages'])->get($cacheKey)) {
		// 	return Inertia::render('Ideas/Index', [
		// 		'ideas' => $cached
		// 	]);
		// }

		// $ideaIds = Cache::tags(['ideas'])->get('all_idea_ids', []);
		// $offset = ($currentPage - 1) * $perPage;
		// $pageIds = array_slice($ideaIds, $offset, $perPage);

		// $ideasData = Cache::tags(['ideas'])->many(
		// 	array_map(fn($id) => "idea_data_{$id}", $pageIds)
		// );

		// $paginatedIdeas = new LengthAwarePaginator(
		// 	array_values($ideasData),
		// 	count($ideaIds),
		// 	$perPage,
		// 	$currentPage,
		// 	['path' => $request->url(), 'query' => $request->query()]
		// );

		// Cache::tags(['ideas_pages'])->put($cacheKey, $paginatedIdeas, 3600);


		//so like this is a game of ping pong
		//called cursor pagination
		//you send next data with next_cursor in it.
		//then you send the next_cursor as a cursor in the query
		//and you get data for that cursor
		//you repeat by sending the next_cursor to the client
		$query = $request->input('query', '');
		$cursor = $request->input('cursor');
		$perPage = 10;

		// Build the query
		if (!$query) {
			$builder = Idea::orderByDesc('created_at')->orderBy('id');
		} else {
			$ids = Idea::search($query)->get()->pluck('id');
			$builder = Idea::whereIn('id', $ids)->latest();
		}

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
		return Inertia::render('Ideas/Index', [
				'ideas' => [
						'data' => $ideas->items(),
						'next_cursor' => $nextCursor,
						'prev_cursor' => $prevCursor,
						'onLastPage' => !$ideas->hasMorePages()
				],
				'filters' => ['query' => $query],
		]);
	}

	public function show(string $id): \Inertia\Response
	{

		// $cacheKey = 'idea_data_' . $id;
		// $idea = Cache::tags(['ideas'])->get($cacheKey);

		// if (!$idea) {
		// 	$idea = Idea::with(['user', 'tags', 'applications.users'])
		// 		->find($id);

		// 	if (!$idea) {
		// 		abort(404);
		// 	}

		// 	Cache::tags(['ideas'])->put($cacheKey, $idea->toArray(), 3600);
		// }

		// $ideaTaskIdsKey = 'idea_task_ids_' . $id;
		// $taskIds = Cache::tags(['ideas', 'tasks'])->get($ideaTaskIdsKey, []);

		// $tasks = collect($taskIds)->map(function ($taskId) {
		// 	$taskCacheKey = 'task_data_' . $taskId;
		// 	return Cache::tags(['tasks'])->get($taskCacheKey);
		// })->filter();

		// $idea['tasks'] = $tasks;

		// $idea = Idea::with(['tasks' => function ($query) {
		// 	$query->withCount('applications');
		// }])
		// 	->findOrFail($id)
		// 	->setHidden(['user_id']);

		$idea = Cache::tags(['ideas', "idea.{$id}"])
			->remember("idea.{$id}", 3600, function () use ($id) {
				return Idea::with(['tasks' => function ($query) {
					$query->withCount('applications');
				}, 'user', 'tags'])
					->findOrFail($id);
			});

		$recommendations = Cache::tags(['recommendations', "idea.{$idea->id}"])
			->remember("recommendations.{$idea->id}", 3600, function () use ($idea) {
				$tagIds = $idea->tags->pluck('id');

				$items = Idea::where('id', '!=', $idea->id)
					->where('active', true)
					->whereHas('tags', fn($q) => $q->whereIn('tags.id', $tagIds))
					->with([
						'tags',
						'tasks' => fn($q) => $q->withCount('applications'),
						'user'
					])
					->take(8)
					->get();

				return $this->transformIdeas($items);
			});


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

		// Clear any cache related to ideas
		//Cache::tags(['ideas', 'landing_page', 'latest_ideas'])->flush();

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

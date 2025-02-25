<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Traits\CacheableIdeas;

class IdeaController extends Controller
{
	use CacheableIdeas;
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

		return Inertia::render('Ideas/Index', []);
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

		$idea = Idea::with(['tasks' => function ($query) {
			$query->withCount('applications');
		}])
			->findOrFail($id)
			->setHidden(['user_id']);

		if (!$idea) {
			abort(404);
		}

		return Inertia::render('IdeaPage', [
			'idea' => $idea,
		]);
	}
}

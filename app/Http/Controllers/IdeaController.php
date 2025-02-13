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
		$ideaIds = Cache::tags(['ideas'])->get('all_idea_ids');
		$cachedIdeas = $this->getCachedIdeas($ideaIds);
		$perPage = 20;
		$currentPage = $request->input('page', 1);
		$currentPageItems = $cachedIdeas->slice(($currentPage - 1) * $perPage, $perPage)->values();

		$paginatedIdeas = new LengthAwarePaginator(
			$currentPageItems,
			$cachedIdeas->count(),
			$perPage,
			$currentPage,
			['path' => $request->url(), 'query' => $request->query()]
		);

		return Inertia::render('Ideas/Index', [
			'ideas' => $paginatedIdeas,
		]);
	}

	public function show(string $id): \Inertia\Response
	{
		$cacheKey = 'idea_data_' . $id;
		$idea = Cache::tags(['ideas'])->get($cacheKey);

		if (!$idea) {
			$idea = Idea::with(['user', 'tags', 'applications.users'])
				->find($id);

			if (!$idea) {
				abort(404);
			}

			Cache::tags(['ideas'])->put($cacheKey, $idea->toArray(), 3600);
		}

		// Fetch task IDs from cache
		$ideaTaskIdsKey = 'idea_task_ids_' . $id;
		$taskIds = Cache::tags(['ideas', 'tasks'])->get($ideaTaskIdsKey, []);

		// Fetch tasks from cache using task IDs
		$tasks = collect($taskIds)->map(function ($taskId) {
			$taskCacheKey = 'task_data_' . $taskId;
			return Cache::tags(['tasks'])->get($taskCacheKey);
		})->filter();

		$idea['tasks'] = $tasks;

		return Inertia::render('Idea', [
			'idea' => $idea,
		]);
	}
}

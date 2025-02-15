<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait CacheableIdeas
{
	public function getCachedIdeas($ideaIds, $take = null)
	{
		$ideas = collect($ideaIds)->take($take)->map(function ($ideaId) {
			$idea = Cache::tags(['ideas'])->get('idea_data_' . $ideaId);
			if ($idea) {
				$ideaTaskIdsKey = 'idea_task_ids_' . $ideaId;
				$taskIds = Cache::tags(['ideas', 'tasks'])->get($ideaTaskIdsKey, []);

				$tasks = collect($taskIds)->map(function ($taskId) {
					$taskCacheKey = 'task_data_' . $taskId;
					return Cache::tags(['tasks'])->get($taskCacheKey);
				})->filter()->toArray();

				$idea['tasks'] = $tasks;
			}
			return $idea;
		})->filter();
		return $ideas;
	}
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;

class TaskController extends Controller
{
	public function getCachedTaskStatuses(string $ideaId)
	{
		$ideaTaskIdsKey = 'idea_task_ids_' . $ideaId;
		$taskIds = Cache::tags(['ideas', 'tasks'])->get($ideaTaskIdsKey, []);
		$taskStatuses = [];

		foreach ($taskIds as $taskId) {
			$taskCacheKey = 'task_data_' . $taskId;
			if ($task = Cache::tags(['tasks'])->get($taskCacheKey)) {
				$taskStatuses[] = [
					'id' => $taskId,
					'status' => $task['status']
				];
			}
		}

		return response()->json($taskStatuses);
	}
}

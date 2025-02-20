<?php

namespace App\Http\Controllers;

use App\ApplicationStatus;
use App\Events\ApplicationStatusUpdated;
use App\Events\TaskStatusUpdated;
use App\Models\Application;
use App\Models\Idea;
use App\Models\Task;
use App\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ApplicationController extends Controller
{
	public function new(Request $request)
	{
		$validatedData = $request->validate([
			'application' => 'required|string',
			'include_profile' => 'required|boolean',
			'userId' => 'required|integer',
			'taskId' => 'required|integer',
			'ideaId' => 'required|integer',
			'applicationStatus' => 'required|string|in:' . implode(',', array_map(fn($case) => $case->value, ApplicationStatus::cases())),
			'taskStatus' => 'required|string|in:' . implode(',', array_map(fn($case) => $case->value, TaskStatus::cases()))
		]);

		$application = Application::create([
			'description' => $validatedData['application'],
			'include_profile' => $validatedData['include_profile'],
			'user_id' => $validatedData['userId'],
			'task_id' => $validatedData['taskId'],
			'status' => $validatedData['applicationStatus'],
		]);

		// Update task status in DB
		Task::where('id', $validatedData['taskId'])->update(['status' => $validatedData['taskStatus']]);

		// Update cache for task data if used
		$taskCacheKey = 'task_data_' . $validatedData['taskId'];
		$cachedData = Cache::tags(['tasks'])->get($taskCacheKey, []);
		$cachedData['status'] = $validatedData['taskStatus'];
		Cache::tags(['tasks'])->put($taskCacheKey, $cachedData);

		// Update cached idea (if it exists) so it reflects the new task status
		$ideaCacheKey = 'idea_data_' . $validatedData['ideaId'];
		if (Cache::tags(['ideas'])->has($ideaCacheKey)) {
			$cachedIdea = Cache::tags(['ideas'])->get($ideaCacheKey);
			if (isset($cachedIdea['tasks']) && is_array($cachedIdea['tasks'])) {
				$cachedIdea['tasks'] = array_map(function ($task) use ($validatedData) {
					if ($task['id'] == $validatedData['taskId']) {
						$task['status'] = $validatedData['taskStatus'];
					}
					return $task;
				}, $cachedIdea['tasks']);
			}
			// Update the cached idea with a new expiration time if needed
			Cache::tags(['ideas'])->put($ideaCacheKey, $cachedIdea, 3600);
		}

		ApplicationStatusUpdated::dispatch($validatedData['taskId'], $validatedData['applicationStatus'], $validatedData['ideaId']);
		TaskStatusUpdated::dispatch($validatedData['taskId'], $validatedData['taskStatus'], $validatedData['ideaId']);
	}
}

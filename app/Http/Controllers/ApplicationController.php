<?php

namespace App\Http\Controllers;

use App\ApplicationStatus;
use App\Events\ApplicationStatusUpdated;
use App\Events\TaskStatusUpdated;
use App\Models\Application;
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

		$newStatus = $validatedData['taskStatus'];
		$id = 'task_data_' . $validatedData['taskId'];
		#$cachedStatus = Cache::tags(['tasks'])->get($id);
		$cachedData = Cache::tags(['tasks'])->get($id, []);
		$cachedData['status'] = $newStatus;
		Cache::tags(['tasks'])->put($id, $cachedData);

		Task::where('id', $validatedData['taskId'])->update(['status' => $validatedData['taskStatus']]);
		//ApplicationStatusUpdated::dispatch($validatedData['taskId'], $validatedData['applicationStatus'], $validatedData['ideaId']);
		//TaskStatusUpdated::dispatch($validatedData['taskId'], $validatedData['taskStatus'], $validatedData['ideaId']);

		// return redirect()->route('ideas.show', ['id' => $validatedData['ideaId']])
		// 	->with('success', 'Application created successfully');
	}
}

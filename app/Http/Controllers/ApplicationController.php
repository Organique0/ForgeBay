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


		// Update task status
		$task = Task::find($validatedData['taskId']);
		$task->update(['status' => $validatedData['taskStatus']]);

		// Load the idea with relationships
		//$idea = Idea::with(['tasks', 'tags', 'user'])->find($validatedData['ideaId']);

		ApplicationStatusUpdated::dispatch($validatedData['taskId'], $validatedData['applicationStatus'], $validatedData['ideaId']);
		TaskStatusUpdated::dispatch($validatedData['taskId'], $validatedData['taskStatus'], $validatedData['ideaId']);
	}
}

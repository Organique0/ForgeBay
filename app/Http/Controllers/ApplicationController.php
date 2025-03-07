<?php

namespace App\Http\Controllers;

use App\ApplicationStatus;
use App\Events\ApplicationStatusUpdated;
use App\Events\TaskStatusUpdated;
use App\Models\Application;
use App\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

		Application::create([
			'description' => $validatedData['application'],
			'include_profile' => $validatedData['include_profile'],
			'user_id' => $validatedData['userId'],
			'task_id' => $validatedData['taskId'],
			'status' => $validatedData['applicationStatus'],
		]);

		ApplicationStatusUpdated::dispatch($validatedData['taskId'], $validatedData['applicationStatus'], $validatedData['ideaId']);
		TaskStatusUpdated::dispatch($validatedData['taskId'], $validatedData['taskStatus'], $validatedData['ideaId']);
	}

	public function show(Request $request)
	{
		$applications = Application::where('user_id', auth()->id())
			->with(['task', 'task.idea'])
			->get();

		return Inertia::render('UserApplications', [
			'applications' => $applications
		]);
	}

	public function search(Request $request)
	{
		$query = $request->input('query', '');

		$applications = Application::search($query)
			->where('user_id', auth()->id())
			->get();

		return $applications;
	}
}

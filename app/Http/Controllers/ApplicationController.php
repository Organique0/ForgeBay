<?php

namespace App\Http\Controllers;

use App\ApplicationStatus;
use App\Events\ApplicationStatusUpdated;
use App\Events\TaskStatusUpdated;
use App\Models\Application;
use App\Models\Message;
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

		$applications->each(function($application) {
			if ($application->status === ApplicationStatus::Approved) {
				$application->messages = Message::where('user_id', auth()->id())
					->where('application_id', $application->id)
					->get();
			}
		});

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


	public function approve(Request $request) {
		$applicationId = $request->input('applicationId');
		$application = Application::where('id', $applicationId);
		$application->update(['status' => ApplicationStatus::Approved]);

	}

	public function decline(Request $request) {
		$applicationId = $request->input('applicationId');
		$application = Application::where('id', $applicationId);
		$application->update(['status' => ApplicationStatus::Approved]);
	}
}

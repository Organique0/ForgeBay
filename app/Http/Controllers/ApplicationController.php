<?php

namespace App\Http\Controllers;

use App\ApplicationStatus;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
	public function new(Request $request)
	{
		$validatedData = $request->validate([
			'application' => 'required|string',
			'include_profile' => 'required|boolean',
			'userId' => 'required|integer',
			'taskId' => 'required|integer',
			'status' => 'required|string|in:' . implode(',', array_column(ApplicationStatus::cases(), 'name'))
		]);

		$application = Application::create([
			'description' => $validatedData['application'],
			'include_profile' => $validatedData['include_profile'],
			'user_id' => $validatedData['userId'],
			'task_id' => $validatedData['taskId'],
			'status' => ApplicationStatus::Review
		]);

		return response()->json($application, 201);
	}
}

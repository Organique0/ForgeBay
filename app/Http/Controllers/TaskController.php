<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
	// Existing index method to show task creation page
	public function index($ideaId)
	{
		$idea = Idea::findOrFail($ideaId);
		$existingTasks = $idea->tasks()->get();
		return Inertia::render('Tasks/create', [
			'idea'           => $idea,
			'existingTasks'  => $existingTasks,
		]);
	}

	/**
	 * Create a new task for the specified idea.
	 */
	public function create(Request $request, $ideaId)
	{
		$idea = Idea::findOrFail($ideaId);

		// Validate your request input (adjust fields as needed)
		$validated = $request->validate([
			'name'        => 'required|string|min:2',
			'description' => 'nullable|string',
			'value' => 'required|numeric',
		]);

		$validated['status'] = TaskStatus::IN_PROGRESS;

		// Create the task through the relationship
		$task = $idea->tasks()->create($validated);

		// Return a JSON response or Inertia redirect
		return response()->json([
			'message' => 'Task created successfully.',
			'task'    => $task,
		]);
	}

	/**
	 * Delete a task for the specified idea.
	 */
	public function delete($ideaId, $taskId)
	{
		$idea = Idea::findOrFail($ideaId);

		// Find the task through the idea relationship to ensure it belongs to the idea.
		$task = $idea->tasks()->findOrFail($taskId);

		$task->delete();

		// Return a JSON response or Inertia redirect as needed.
		return response()->json([
			'message' => 'Task deleted successfully.',
		]);
	}
}

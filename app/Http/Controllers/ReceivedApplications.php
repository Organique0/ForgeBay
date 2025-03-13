<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceivedApplications extends Controller
{
   public function index(Request $request)
	 {
		$applications = Application::whereHas('task', function ($q) {
				// Only get applications where the task was created by the logged in user
				$q->where('user_id', auth()->id());
		})->with(['task.idea.user:id,bio,current_team_id,email,name'])
			->get();

		return Inertia::render('ReceivedApplications', [
			'applications' => $applications
		]);
	 }
}

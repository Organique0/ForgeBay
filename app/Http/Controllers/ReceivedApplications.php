<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReceivedApplications extends Controller
{
	public function index(Request $request)
	{
			$status = $request->input('status', 'sent');

			$applicationsQuery = Application::whereHas('task', function ($q) {
				$q->where('user_id', auth()->id());
			});

			if ($status) {
				$applicationsQuery->where('status', $status);
			}

			$applications = $applicationsQuery
				->with(['task.idea.user:id,bio,current_team_id,email,name'])
				->paginate(6);

			return Inertia::render('ReceivedApplications', [
				'applications' => $applications,
				'filters' => [
					'status' => $status,
				],
			'team' => auth()->user()->currentTeam,
			]);
	}
}

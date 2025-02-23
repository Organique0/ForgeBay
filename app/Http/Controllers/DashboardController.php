<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
	public function index(Request $request)
	{
		$userApplications = Application::with(['task.idea'])
			->where('user_id', auth()->id())
			->get();

		return Inertia::render('Dashboard', [
			'userApplications' => $userApplications
		]);
	}
}

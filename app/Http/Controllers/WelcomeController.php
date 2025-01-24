<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
	/**
	 * Handle the incoming request.
	 *
	 * @return \Inertia\Response
	 */
	public function __invoke()
	{
		$ideas = Idea::with('user','tags')
			->with('tasks', function($query) {
				$query->orderByRaw("CASE status
					WHEN 'to_do' THEN 3
					WHEN 'in_progress' THEN 2
					WHEN 'done' THEN 1
					ELSE 4
				END");
			})
			->latest()
			->get();

		return Inertia::render('Welcome', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
			'laravelVersion' => Application::VERSION,
			'phpVersion' => PHP_VERSION,
			'ideas' => $ideas,
		]);
	}
}

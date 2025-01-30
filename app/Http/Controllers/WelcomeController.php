<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache; // Add Cache facade

class WelcomeController extends Controller
{
	/**
	 * Handle the incoming request.
	 *
	 * @return \Inertia\Response
	 */
	public function __invoke()
	{
		$ideas = Cache::tags(['ideas'])->get('all_ideas');

		if (is_null($ideas)) {
			$ideas = Idea::with(['user', 'tags', 'applications.users'])
				->with(['tasks' => function ($query) {
					$query->orderByRaw("CASE status
						WHEN 'to_do' THEN 3
						WHEN 'in_progress' THEN 2
						WHEN 'done' THEN 1
						ELSE 4
					END");
				}])
				->orderBy('created_at', 'desc')
				->get();

			Cache::tags(['ideas'])->put('all_ideas', $ideas, 3600);
		}

		return Inertia::render('Welcome', [
			'canLogin' => Route::has('login'),
			'canRegister' => Route::has('register'),
			'laravelVersion' => Application::VERSION,
			'phpVersion' => PHP_VERSION,
			'ideas' => $ideas,
		]);
	}
}

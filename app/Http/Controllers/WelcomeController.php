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
		$ideas = Idea::with('user')
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

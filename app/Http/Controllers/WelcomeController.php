<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Traits\CacheableIdeas;

class WelcomeController extends Controller
{
	use CacheableIdeas;
	/**
	 * Handle the incoming request.
	 *
	 * @return \Inertia\Response
	 */
	public function __invoke()
	{


		$ideas = Idea::with('user')
			->orderBy('created_at', 'desc')
			->limit(20)
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

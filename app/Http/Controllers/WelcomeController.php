<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
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
		$ideaIds = Cache::tags(['ideas'])->get('all_idea_ids');
		$ideas = collect();

		if ($ideaIds) {
			$ideas = $this->getCachedIdeas($ideaIds, 10);
		}

		if ($ideas->isEmpty()) {
			$ideas = Idea::with(['user', 'tags'])
				->orderBy('created_at', 'desc')
				->limit(20)
				->get()
				->each(function ($idea) {
					Cache::tags(['ideas'])->put('idea_data_' . $idea->id, $idea->toArray(), 3600);
				});
			$ideaIds = $ideas->pluck('id')->toArray();
			Cache::tags(['ideas'])->put('all_idea_ids', $ideaIds, 3600);
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

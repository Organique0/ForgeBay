<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
	public function index(): Response
	{
		$latestIdeas = Cache::tags(['landing_page', 'latest_ideas'])
			->remember('latest_ideas', 600, function () {
				return Idea::with(['tags:id,name', 'user'])
					->where('active', true)
					->orderBy('created_at', 'desc')
					->withCount('applications')
					->take(6)
					->get();
			});

		return Inertia::render('LandingPage', [
			'latestIdeas' => $latestIdeas,
		]);
	}
}

<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Traits\TransformIdeas;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
	use TransformIdeas;
	public function index(): Response
	{
		$latestIdeas = Cache::tags(['landing_page', 'latest_ideas'])
			->remember('latest_ideas', 600, function () {
				$ideas = Idea::with(['user', 'tags'])
					->where('active', true)
					->orderBy('created_at', 'desc')
					->withCount('applications')
					->take(6)
					->get();

				// Transform the collection
				return $this->transformIdeas($ideas);
			});

		return Inertia::render('LandingPage', [
			'latestIdeas' => $latestIdeas,
		]);
	}
}

<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use App\Traits\TransformIdeas;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
	use TransformIdeas;
	public function index(): Response
	{
				$ideas = Idea::with(['user', 'tags'])
					->where('active', true)
					->orderBy('created_at', 'desc')
					->with([
						'user:id,name',
						'tags' => function ($query) {
							$query->select('tags.id', 'tags.name')->pluck('name');
						}
					])
					->withSum('tasks as total_value', 'value')
					->withCount('tasks')
					->withCount(['tasks as applications_count' => function ($query) {
						$query->withCount('applications')->selectRaw('sum(applications_count)');
					}])
					->take(6)
					->get();

			;

		return Inertia::render('LandingPage', [
			'latestIdeas' => $ideas,
		]);
	}
}

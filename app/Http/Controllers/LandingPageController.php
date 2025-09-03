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
		$ideas = Idea::ideasList(6)->get();

		return Inertia::render('LandingPage', [
			'latestIdeas' => $ideas,
		]);
	}
}

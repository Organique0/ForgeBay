<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class IdeaController extends Controller
{
	private function getCachedIdeas()
	{
		return Cache::tags(['ideas'])->remember('all_ideas', 3600, function () {
			return Idea::with(['user', 'tags', 'applications.users'])
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
		});
	}

	public function index()
	{
		return Inertia::render('Ideas/Index', [
			'ideas' => $this->getCachedIdeas(),
		]);
	}

	public function show(string $id): \Inertia\Response
	{
		$idea = $this->getCachedIdeas()->where('id', $id)->first();

		if (!$idea) {
			abort(404);
		}

		return Inertia::render('Idea', [
			'idea' => $idea,
		]);
	}
}

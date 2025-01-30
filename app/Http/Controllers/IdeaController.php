<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IdeaController extends Controller
{
	public function show(string $id): \Inertia\Response
	{
		$idea = Idea::with(['user', 'tags', 'applications.users'])
			->with(['tasks' => function ($query) {
				$query->orderByRaw("CASE status
					WHEN 'to_do' THEN 3
					WHEN 'in_progress' THEN 2
					WHEN 'done' THEN 1
					ELSE 4
				END");
			}])
			->where('id', $id)
			->firstOrFail();

		return Inertia::render('Idea', [
			'idea' => $idea,
		]);
	}
}

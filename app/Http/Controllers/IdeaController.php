<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;

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

	public function index(Request $request)
	{
		$cachedIdeas = $this->getCachedIdeas();
		$perPage = 20;
		$currentPage = $request->input('page', 1);
		$currentPageItems = $cachedIdeas->slice(($currentPage - 1) * $perPage, $perPage)->values();

		$paginatedIdeas = new LengthAwarePaginator(
			$currentPageItems,
			$cachedIdeas->count(),
			$perPage,
			$currentPage,
			['path' => $request->url(), 'query' => $request->query()]
		);

		return Inertia::render('Ideas/Index', [
			'ideas' => $paginatedIdeas,
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

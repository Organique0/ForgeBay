<?php

namespace App\Http\Controllers;

use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Traits\CacheableIdeas;

class IdeaController extends Controller
{
	use CacheableIdeas;
	public function index(Request $request)
	{
		// $currentPage = $request->input('page', 1);
		// $perPage = 20;

		// $cacheKey = "ideas_page_{$currentPage}";
		// if ($cached = Cache::tags(['ideas_pages'])->get($cacheKey)) {
		// 	return Inertia::render('Ideas/Index', [
		// 		'ideas' => $cached
		// 	]);
		// }

		// $ideaIds = Cache::tags(['ideas'])->get('all_idea_ids', []);
		// $offset = ($currentPage - 1) * $perPage;
		// $pageIds = array_slice($ideaIds, $offset, $perPage);

		// $ideasData = Cache::tags(['ideas'])->many(
		// 	array_map(fn($id) => "idea_data_{$id}", $pageIds)
		// );

		// $paginatedIdeas = new LengthAwarePaginator(
		// 	array_values($ideasData),
		// 	count($ideaIds),
		// 	$perPage,
		// 	$currentPage,
		// 	['path' => $request->url(), 'query' => $request->query()]
		// );

		// Cache::tags(['ideas_pages'])->put($cacheKey, $paginatedIdeas, 3600);

		return Inertia::render('Ideas/Index', []);
	}

	public function show(string $id): \Inertia\Response
	{

		$idea = Idea::with(['user', 'tags', 'applications.users', 'tasks'])
			->find($id);

		if (!$idea) {
			abort(404);
		}

		return Inertia::render('Idea', [
			'idea' => $idea,
		]);
	}
}

<?php
// filepath: /home/lukag/Documents/WEB_DEVELOPMENT/LaravelProjects/ForgeBay/app/Http/Controllers/StreamsController.php
namespace App\Http\Controllers;

use App\Models\Idea;
use App\Traits\CacheableIdeas;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\StreamedResponse as HttpFoundationStreamedResponse;

class StreamsController extends Controller
{
	use CacheableIdeas;
	public function applicationStream(Request $request): HttpFoundationStreamedResponse
	{
		$ideaId = $request->query('idea');
		$page = $request->query('page');

		session_write_close(); // release session lock immediately

		return response()->stream(function () use ($ideaId, $page) {
			if ($ideaId) {
				// For single idea view, only send task statuses
				$ideaTaskIdsKey = 'idea_task_ids_' . $ideaId;
				$taskIds = Cache::tags(['ideas', 'tasks'])->get($ideaTaskIdsKey, []);
				$taskStatuses = [];

				foreach ($taskIds as $taskId) {
					$taskCacheKey = 'task_data_' . $taskId;
					if ($task = Cache::tags(['tasks'])->get($taskCacheKey)) {
						$taskStatuses[] = [
							'id' => $taskId,
							'status' => $task['status']
						];
					}
				}

				echo "event: TaskStatusUpdates\n";
				echo "data: " . json_encode(['idea_id' => $ideaId, 'tasks' => $taskStatuses]) . "\n\n";
			} elseif ($page) {
				// For ideas list, only send task statuses for visible ideas
				$ideaIds = Cache::tags(['ideas'])->get('all_idea_ids');
				$offset = ((int)$page - 1) * 20;
				$pageIdeaIds = array_slice($ideaIds, $offset, 20);

				$updates = [];
				foreach ($pageIdeaIds as $id) {
					$taskIds = Cache::tags(['ideas', 'tasks'])->get("idea_task_ids_{$id}", []);
					$taskStatuses = [];
					foreach ($taskIds as $taskId) {
						if ($task = Cache::tags(['tasks'])->get("task_data_{$taskId}")) {
							$taskStatuses[] = [
								'id' => $taskId,
								'status' => $task['status']
							];
						}
					}
					$updates[$id] = $taskStatuses;
				}

				echo "event: IdeasUpdates\n";
				echo "data: " . json_encode(['updates' => $updates]) . "\n\n";
			}

			flush();
		}, 200, [
			'Cache-Control' => 'no-cache',
			'Content-Type' => 'text/event-stream',
			'Access-Control-Allow-Origin' => '*'
		]);
	}
}

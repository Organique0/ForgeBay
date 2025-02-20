<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use App\Models\Idea;

class PreCacheIdeas extends Command
{
	protected $signature = 'cache:ideas';
	protected $description = 'Preload all ideas into Redis';

	public function handle()
	{
		Cache::tags(['ideas'])->flush();

		$ideas = Idea::with(['user', 'tags', 'tasks', 'applications'])
			->orderBy('created_at', 'asc')
			->get();

		$ideaIds = [];

		foreach ($ideas as $idea) {
			$cacheKey = 'idea_data_' . $idea->id;

			// Cache idea data
			Cache::tags(['ideas'])->rememberForever($cacheKey, function () use ($idea) {
				$ideaData = $idea->toArray();
				return $ideaData;
			});

			$ideaIds[] = $idea->id;

			// Cache tasks for each idea
			$taskIds = [];
			foreach ($idea->tasks as $task) {
				$taskCacheKey = 'task_data_' . $task->id;
				Cache::tags(['tasks'])->rememberForever($taskCacheKey, function () use ($task) {
					return $task->toArray();
				});
				$taskIds[] = $task->id;
			}

			// Cache the list of task IDs for each idea
			$ideaTaskIdsKey = 'idea_task_ids_' . $idea->id;
			Cache::tags(['ideas', 'tasks'])->rememberForever($ideaTaskIdsKey, function () use ($taskIds) {
				return $taskIds;
			});
		}

		// Cache the list of all idea IDs
		Cache::tags(['ideas'])->rememberForever('all_idea_ids', function () use ($ideaIds) {
			return $ideaIds;
		});

		$this->info('All ideas, tasks, and task IDs have been cached separately.');
	}
}

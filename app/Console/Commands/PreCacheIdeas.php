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

		Cache::tags(['ideas'])->remember('all_ideas', 600, function () {
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

		$this->info('All ideas have been cached.');
	}
}

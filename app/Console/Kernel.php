<?php

namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Console\Scheduling\Schedule;

class Kernel extends ConsoleKernel
{
	protected $commands = [
		//\App\Console\Commands\PreCacheIdeas::class,
	];

	protected function schedule(Schedule $schedule)
	{
		//$schedule->command('cache:ideas')->everyTenMinutes();
	}
}

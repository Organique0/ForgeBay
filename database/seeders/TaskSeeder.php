<?php

namespace Database\Seeders;

use App\Models\Task;
use App\TaskStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		Task::factory()
			->count(1000)
			->create();
	}
}

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
			->count(10000)
			->create();
	}
}

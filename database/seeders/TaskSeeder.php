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

      DB::table('tasks')->insert([
			'name' => 'Task 1',
			'description' => 'Description 1',
			'value' => 40.00,
			'status' => TaskStatus::DONE,
			'idea_id' => 4,
			'user_id' => 1,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 30.00,
			'status' => TaskStatus::IN_PROGRESS,
			'idea_id' => 4,
			'user_id' => 1,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 23.00,
			'status' => TaskStatus::TO_DO,
			'idea_id' => 4,
			'created_at' => now(),
		]);

		DB::table('tasks')->insert([
			'name' => 'Task 1',
			'description' => 'Description 1',
			'value' => 33.00,
			'status' => TaskStatus::DONE,
			'idea_id' => 5,
			'user_id' => 1,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 63.00,
			'status' => TaskStatus::DONE,
			'idea_id' => 6,
			'user_id' => 1,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 43.00,
			'status' => TaskStatus::IN_PROGRESS,
			'idea_id' => 6,
			'user_id' => 1,
			'created_at' => now(),
		]);

		DB::table('tasks')->insert([
			'name' => 'Task 1',
			'description' => 'Description 1',
			'value' => 332.00,
			'status' => TaskStatus::TO_DO,
			'idea_id' => 7,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 634.00,
			'status' => TaskStatus::TO_DO,
			'idea_id' => 7,
			'created_at' => now(),
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 432.00,
			'status' => TaskStatus::TO_DO,
			'idea_id' => 7,
			'created_at' => now(),
		]);
    }
}

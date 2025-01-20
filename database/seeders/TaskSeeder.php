<?php

namespace Database\Seeders;

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
			'idea_id' => 1,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 30.00,
			'idea_id' => 1,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 23.00,
			'idea_id' => 1,
		]);

		DB::table('tasks')->insert([
			'name' => 'Task 1',
			'description' => 'Description 1',
			'value' => 33.00,
			'idea_id' => 2,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 63.00,
			'idea_id' => 2,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 43.00,
			'idea_id' => 2,
		]);

		DB::table('tasks')->insert([
			'name' => 'Task 1',
			'description' => 'Description 1',
			'value' => 332.00,
			'idea_id' => 3,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 2',
			'description' => 'Description 2',
			'value' => 634.00,
			'idea_id' => 3,
		]);
		DB::table('tasks')->insert([
			'name' => 'Task 3',
			'description' => 'Description 3',
			'value' => 432.00,
			'idea_id' => 3,
		]);
    }
}

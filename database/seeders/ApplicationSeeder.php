<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicationSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		DB::table('applications')->insert([
			'task_id' => 1,
			'user_id' => 3,
			'description' => 'Description 1',
			'status' => 0,
			'include_profile' => true
		]);
		DB::table('applications')->insert([
			'task_id' => 2,
			'user_id' => 3,
			'description' => 'Description 1',
			'status' => 0,
			'include_profile' => true
		]);
		DB::table('applications')->insert([
			'task_id' => 3,
			'user_id' => 3,
			'description' => 'Description 1',
			'status' => 1,
			'include_profile' => false
		]);
	}
}

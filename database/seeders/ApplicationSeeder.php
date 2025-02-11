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
			'status' => 'sent',
			'include_profile' => true
		]);
		DB::table('applications')->insert([
			'task_id' => 2,
			'user_id' => 3,
			'description' => 'Description 1',
			'status' => 'approved',
			'include_profile' => true
		]);
		DB::table('applications')->insert([
			'task_id' => 3,
			'user_id' => 3,
			'description' => 'Description 1',
			'status' => 'declined',
			'include_profile' => false
		]);
	}
}

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
			'task_id' => 11,
			'description' => 'Description 1',
			'status' => 1,
		]);
		DB::table('applications')->insert([
			'task_id' => 11,
			'description' => 'Description 1',
			'status' => 1,
		]);
		DB::table('applications')->insert([
			'task_id' => 11,
			'description' => 'Description 1',
			'status' => 1,
		]);
    }
}

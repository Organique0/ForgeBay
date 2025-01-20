<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IdeaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
		DB::table('ideas')->insert([
			'title' => 'Idea 1',
			'user_id' => 1,

		]);
		DB::table('ideas')->insert([
			'title' => 'Idea 2',
			'user_id' => 1,

		]);
		DB::table('ideas')->insert([
			'title' => 'Idea 3',
			'user_id' => 1,

		]);
    }
}

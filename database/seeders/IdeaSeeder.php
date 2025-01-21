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
		// Insert ideas
		$idea1 = DB::table('ideas')->insertGetId([
			'title' => 'Idea 1',
			'description' => 'Description 1',
			'user_id' => 1,
		]);

		$idea2 = DB::table('ideas')->insertGetId([
			'title' => 'Idea 2',
			'description' => 'Description 2',
			'user_id' => 1,
		]);

		$idea3 = DB::table('ideas')->insertGetId([
			'title' => 'Idea 3',
			'description' => 'Description 3',
			'user_id' => 1,
		]);

		$ideaTags = [
			$idea1 => [1, 2, 3],
			$idea2 => [2, 4, 5],
			$idea3 => [1, 5, 6],
		];

		foreach ($ideaTags as $ideaId => $tags) {
			foreach ($tags as $tagId) {
				DB::table('idea_tag')->insert([
					'idea_id' => $ideaId,
					'tag_id' => $tagId,
				]);
			}

		}
	}
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Idea;
use App\Models\Tag;

class IdeaSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$tagIds = Tag::pluck('id')->toArray();

		Idea::factory()
			->count(1000)
			->create()
			->each(function ($idea) use ($tagIds) {
				// Attach 3 random tags to each idea
				$randomTags = array_rand(array_flip($tagIds), rand(3, 10));
				$idea->tags()->attach($randomTags);
			});
	}
}

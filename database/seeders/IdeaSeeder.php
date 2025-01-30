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
		// Ensure there are enough tags
		$tagIds = Tag::pluck('id')->toArray();

		// Generate 2000 ideas
		Idea::factory()
			->count(2000)
			->create()
			->each(function ($idea) use ($tagIds) {
				// Attach 3 random tags to each idea
				$randomTags = array_rand(array_flip($tagIds), 3);
				$idea->tags()->attach($randomTags);
			});
	}
}

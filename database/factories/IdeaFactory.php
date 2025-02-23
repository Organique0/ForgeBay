<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Idea>
 */
class IdeaFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'title' => $this->faker->sentence(6, true),
			'description' => $this->faker->paragraphs(3, true),
			'user_id' => User::inRandomOrder()->first()->id,
			'expires' => $this->faker->dateTimeBetween('now', '+3 months'),
		];
	}
}

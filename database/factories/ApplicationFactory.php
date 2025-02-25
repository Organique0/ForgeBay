<?php

namespace Database\Factories;

use App\ApplicationStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'task_id' => rand(1, 999),
			'user_id' => rand(1, 499),
			'description' => $this->faker->text(),
			'status' => $this->faker->randomElement(ApplicationStatus::cases()),
			'include_profile' => $this->faker->boolean()
		];
	}
}

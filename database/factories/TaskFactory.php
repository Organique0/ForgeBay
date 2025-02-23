<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{

	protected $model = Task::class;
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'name' => $this->faker->name(),
			'description' => $this->faker->text(500),
			'value' => $this->faker->numberBetween(10, 1000),
			'status' => \App\TaskStatus::cases()[array_rand(\App\TaskStatus::cases())]->value,
			'user_id' => User::inRandomOrder()->first()->id,
			'idea_id' => $this->faker->numberBetween(1, 1000)
		];
	}
}

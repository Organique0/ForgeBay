<?php

namespace Database\Seeders;

// use App\Models\Team;
use App\Models\Team;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\RolesEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{

		echo "Initial user count: " . User::count() . "\n";

		$this->call(RoleSeeder::class);

		$users = User::factory(500)->withPersonalTeam()->create();
		echo "After bulk creation: " . User::count() . "\n";
		$users->each(function ($user) {
			$user->current_team_id = $user->ownedTeams()->first()->id;
			$user->save();
		});

		foreach ($users as $user) {
			$user->assignRole(RolesEnum::User->value);
		}

		$admin = User::factory()->withPersonalTeam()->create([
			'name' => 'admin',
			'email' => 'admin@example.com',
		])->assignRole(RolesEnum::Admin->value);
		$admin->current_team_id = $admin->ownedTeams()->first()->id;
		$admin->save();

		$superAdmin = User::factory()->withPersonalTeam()->create([
			'name' => 'superAdmin',
			'email' => 'superAdmin@example.com',
		])->assignRole(RolesEnum::SuperAdmin->value);
		$superAdmin->current_team_id = $superAdmin->ownedTeams()->first()->id;
		$superAdmin->save();

		$lukaUser = User::factory()->withPersonalTeam()->create([
			'name' => 'user',
			'email' => 'user@example.com',
			'bio' => 'hello, my name is Luka',
		])->assignRole(RolesEnum::User->value);
		$lukaUser->current_team_id = $lukaUser->ownedTeams()->first()->id;
		$lukaUser->save();

		$testUser = new User([
			'name' => config('test.user_login'),
			'email' => config('test.user_email'),
			'password' => bcrypt(config('test.user_password')),
			'bio' => 'hello, my name is Test User',
			'email_verified_at' => now(),
			'remember_token' => Str::random(10),
		]);
		$testUser->save();

		$testTeam = new Team([
			'name' => $testUser->name . '\'s Team',
			'user_id' => $testUser->id,
			'personal_team' => true,
		]);
		$testTeam->save();

		$testUser->current_team_id = $testTeam->id;
		$testUser->save();

		echo "After additional " . User::count() . "\n";

		$this->call([
			TagSeeder::class
		]);

		$tags = DB::table('tags')->pluck('id')->toArray();

		User::all()->each(function ($user) use ($tags) {
			$selectedTags = array_rand(array_flip($tags), rand(3, 10));
			foreach ($selectedTags as $tagId) {
				DB::table('tags_users')->insert([
					'user_id' => $user->id,
					'tag_id' => $tagId,
				]);
			}
		});

		echo "After tags: " . User::count() . "\n";

		$this->call([
			IdeaSeeder::class,
			TaskSeeder::class,
			ApplicationSeeder::class,
		]);

		echo "After other seeders: " . User::count() . "\n";

		// Create a personal access token for the user and display it in the console
		$token = $testUser->createToken('auth_token');
		echo 'TEST_AUTHENTICATION_BEARER_TOKEN: ' . $token->plainTextToken . PHP_EOL . PHP_EOL;

		echo "Final user count: " . User::count() . "\n";

		$testTeam = new Team([
			'name' => $testUser->name . '\'s Team',
			'user_id' => $testUser->id,
			'personal_team' => true,
		]);
		$testTeam->save();
	}
}

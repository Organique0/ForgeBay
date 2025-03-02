<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Exception;
use App\Models\User;
use App\Models\Team;
use App\RolesEnum;

class LoginController extends Controller
{
	/**
	 * Redirect the user to the Google authentication page.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function redirectToGoogle()
	{
		return Socialite::driver('google')->redirect();
	}

	/**
	 * Redirect the user to the GitHub authentication page.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function redirectToGithub()
	{
		return Socialite::driver('github')->redirect();
	}

	/**
	 * Obtain the user information from Google.
	 *
	 * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Routing\Redirector
	 */
	public function handleGoogleCallback()
	{
		try {
			$googleUser = Socialite::driver('google')->user();
			$existingUser = User::where('email', $googleUser->email)->first();

			if ($existingUser) {
				// If user exists but hasn't yet linked Google, send error.
				if (!$existingUser->google_id) {
					return redirect()->route('login')->withErrors([
						'provider' => 'It looks like you have already signed up with a different provider. Please use that provider to login.'
					]);
				}
				Auth::login($existingUser);
				return redirect('/dashboard');
			} else {
				// Otherwise, create a new user.
				$newUser = User::create([
					'name'      => $googleUser->name,
					'email'     => $googleUser->email,
					'google_id' => $googleUser->id,
					'password'  => encrypt('')
				]);
				$newUser->assignRole(RolesEnum::User->value);
				$newTeam = Team::forceCreate([
					'user_id'       => $newUser->id,
					'name'          => explode(' ', $googleUser->name, 2)[0] . "'s Team",
					'personal_team' => true,
				]);
				$newTeam->save();
				$newUser->current_team_id = $newTeam->id;
				$newUser->save();
				Auth::login($newUser);
				return redirect('/dashboard');
			}
		} catch (Exception $e) {
			dd($e->getMessage());
		}
	}

	/**
	 * Obtain the user information from GitHub.
	 *
	 * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Routing\Redirector
	 */
	public function handleGithubCallback()
	{
		try {
			$githubUser = Socialite::driver('github')->user();
			$existingUser = User::where('email', $githubUser->email)->first();

			if ($existingUser) {
				if (!$existingUser->github_id) {
					return redirect()->route('login')->withErrors([
						'provider' => 'It appears you have already signed up using a different provider. Please use that provider to login.'
					]);
				}
				Auth::login($existingUser);
				return redirect('/dashboard');
			} else {
				$newUser = User::create([
					'name'      => $githubUser->name,
					'email'     => $githubUser->email,
					'github_id' => $githubUser->id,
					'password'  => encrypt('')
				]);
				$newUser->assignRole(RolesEnum::User->value);
				$newTeam = Team::forceCreate([
					'user_id'       => $newUser->id,
					'name'          => explode(' ', $githubUser->name, 2)[0] . "'s Team",
					'personal_team' => true,
				]);
				$newTeam->save();
				$newUser->current_team_id = $newTeam->id;
				$newUser->save();
				Auth::login($newUser);
				return redirect('/dashboard');
			}
		} catch (Exception $e) {
			dd($e->getMessage());
		}
	}
}

<?php
// app/Http/Controllers/UserProfileController.php
namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\User;
use Laravel\Fortify\Features;
use Laravel\Jetstream\Http\Controllers\Inertia\UserProfileController as JetstreamUserProfileController;
use Inertia\Response;
use Illuminate\Http\Request;
use Laravel\Jetstream\Jetstream;

class UserProfileController extends JetstreamUserProfileController
{
	public function show(Request $request)
	{
		$this->validateTwoFactorAuthenticationState($request);

		return Jetstream::inertia()->render($request, 'Profile/Show', [
			'confirmsTwoFactorAuthentication' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
			'sessions' => $this->sessions($request)->all(),
			'allTags' => Tag::select('id', 'name')->whereNotIn('id', $request->user()->tags->pluck('id'))->get(),
			'skills' => User::find($request->user()->id)->tags->map(function ($tag) {
			    return ['id' => $tag->id, 'name' => $tag->name];
			})->toArray(),
		]);
	}
}

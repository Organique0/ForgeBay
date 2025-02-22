<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicUserProfile extends Controller
{
	public function show(Request $request)
	{
		$id = $request['id'];

		$user = User::with('ideas', 'tags')->find($id);

		return Inertia::render('PublicProfile', [
			'name' => $user->name,
			'email' => $user->email,
			'profile_photo_url' => $user->profile_photo_url,
			'bio' => $user->bio,
			'ideas' => $user->ideas,
			'tags' => $user->tags->pluck('name')->toArray(),
		]);
	}
}

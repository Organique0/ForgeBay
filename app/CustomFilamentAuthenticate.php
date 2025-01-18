<?php

namespace App;

use Filament\Facades\Filament;
use Filament\Http\Middleware\Authenticate;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CustomFilamentAuthenticate extends Authenticate
{
	/**
	 * @param  array<string>  $guards
	 */
	protected function authenticate($request, array $guards): void
	{
		$guard = Filament::auth();

		if (! $guard->check()) {
			$this->unauthenticated($request, $guards);

			return; /** @phpstan-ignore-line */
		}

		$this->auth->shouldUse(Filament::getAuthGuard());

		/** @var Model $user */
		$user = $guard->user();

		$panel = Filament::getCurrentPanel();

		if (!$user->hasRole('admin')) {
			Auth::guard('web')->logout();
			session()->invalidate();
			session()->regenerateToken();
			abort(403);
		}
	}

	protected function redirectTo($request): ?string
	{
		return Filament::getLoginUrl();
	}

}

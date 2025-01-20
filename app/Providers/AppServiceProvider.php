<?php

namespace App\Providers;

use App\RolesEnum;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
		Gate::before(function ($user, $ability) {
			return $user->hasRole(RolesEnum::SuperAdmin->value) ? true : null;
		});

		Gate::define('viewPulse', function ($user) {
			return $user->hasRole(RolesEnum::SuperAdmin->value) ? true : false;
		});
    }
}

<?php

namespace App\Providers;

use App\Http\Controllers\UserProfileController;
use App\RolesEnum;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Jetstream\Http\Controllers\Inertia\UserProfileController as JetstreamUserProfileController;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
			$this->app->bind(JetstreamUserProfileController::class, UserProfileController::class);
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

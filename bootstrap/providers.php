<?php

return [
	App\Providers\AppServiceProvider::class,
	App\Providers\Filament\AdminPanelProvider::class,
	App\Providers\FortifyServiceProvider::class,
	App\Providers\HorizonServiceProvider::class,
	App\Providers\JetstreamServiceProvider::class,
	Spatie\Permission\PermissionServiceProvider::class,
	Laravel\Scout\ScoutServiceProvider::class,
	Laravel\Socialite\SocialiteServiceProvider::class,
	TeamTNT\Scout\TNTSearchScoutServiceProvider::class,
];

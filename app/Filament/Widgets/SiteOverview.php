<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Auth;

class SiteOverview extends Widget
{
	protected static string $view = 'filament.widgets.site-overview';

	public static function canView(): bool
	{
		return Auth::user()->hasRole('super-admin');
	}
}

<?php

use App\Events\MessageSent;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::domain('localhost')->group(function () {
  Route::get('/', function () {
    return Inertia::render('Welcome', [
      'canLogin' => Route::has('login'),
      'canRegister' => Route::has('register'),
      'laravelVersion' => Application::VERSION,
      'phpVersion' => PHP_VERSION,
    ]);
  })->name('home');

  Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
  ])->group(function () {


    Route::get('/dashboard', function () {
      return Inertia::render('Dashboard');
    })->name('dashboard');


		Route::post('/messages', function (Request $request) {
			$request->validate([
				'message' => 'required|string',
			]);
			MessageSent::dispatch(auth()->user()->name, $request->message);
			return response()->json(
				[
					'text' => 'Message sent!',
					'user' => auth()->user()->name,
				]
			);
		})->name('messages.send');
  });
});


/*Route::domain(config('ADMIN_URL'))->group(function () {
  Route::get('/', function () {
    return Inertia::render('Dashboard');
  })->name('dashboard');
});*/

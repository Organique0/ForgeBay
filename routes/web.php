<?php

use App\Events\MessageSent;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::domain('localhost')->group(function () {
  Route::get('/', \App\Http\Controllers\WelcomeController::class)->name('home');
	Route::get('/idea/{id}', [\App\Http\Controllers\IdeaController::class, 'show'])->name('idea.show');

  Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
  ])->group(function () {


    Route::get('/dashboard', function () {
      return Inertia::render('Dashboard');
    })->name('dashboard');

		Route::post('/skills', function (Request $request) {
			$request->validate([
				'bio' => 'required|string',
				'skills' => 'required|array',
			]);

		foreach ($request->skills as $skill) {
			//how way I ever supposed to know this was a thing?
			//how did people know to do this before AI?
			auth()->user()->tags()->sync($request->skills);
		}

		});

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

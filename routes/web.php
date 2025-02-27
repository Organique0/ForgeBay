<?php

use App\Events\MessageSent;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\PublicUserProfile;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::domain('localhost')->group(function () {
	Route::get('/', [App\Http\Controllers\LandingPageController::class, 'index'])->name('home');
	Route::get('/idea/{id}', [\App\Http\Controllers\IdeaController::class, 'show'])->name('ideas.show');
	Route::get('/idea', [\App\Http\Controllers\IdeaController::class, 'index'])->name('ideas.index');
	Route::get('/user/{id}', [PublicUserProfile::class, 'show'])->name('publicProfile.show');

	Route::middleware([
		'auth:sanctum',
		config('jetstream.auth_session'),
		'verified',
	])->group(function () {


		Route::post('/ideas/new', [IdeaController::class, 'new'])->name('ideas.new');
		Route::post('/application', [\App\Http\Controllers\ApplicationController::class, 'new'])->name('application.new');
		Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
		Route::post('/skills', function (Request $request) {
			$request->validate([
				'bio' => 'required|string',
				'skills' => 'array',
			]);

			// Sync user skills with the provided tags
			auth()->user()->tags()->sync($request->skills);
		});
		Route::get('/create-idea', [IdeaController::class, 'create'])->name('ideas.create');



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

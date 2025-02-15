<?php

use App\Events\MessageSent;
use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\StreamsController;

Route::domain('localhost')->group(function () {
	Route::get('/', \App\Http\Controllers\WelcomeController::class)->name('home');
	Route::get('/idea/{id}', [\App\Http\Controllers\IdeaController::class, 'show'])->name('ideas.show');
	Route::get('/idea', [\App\Http\Controllers\IdeaController::class, 'index'])->name('ideas.index');
	Route::post('/application', [\App\Http\Controllers\ApplicationController::class, 'new'])->name('application.new');


	Route::middleware([
		'auth:sanctum',
		config('jetstream.auth_session'),
		'verified',
	])->group(function () {


		Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');



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

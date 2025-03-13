<?php

use App\Events\MessageSent;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\PublicUserProfile;
use App\Http\Controllers\ReceivedApplications;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::domain('localhost')->group(function () {
	Route::get('/', [App\Http\Controllers\LandingPageController::class, 'index'])->name('home');
	Route::get('/idea/{id}', [\App\Http\Controllers\IdeaController::class, 'show'])->name('ideas.show');
	Route::get('/idea', [\App\Http\Controllers\IdeaController::class, 'index'])->name('ideas.index');
	Route::get('/user/{id}', [PublicUserProfile::class, 'show'])->name('publicProfile.show');
	Route::get('/auth/google', [LoginController::class, 'redirectToGoogle']);
	Route::get('/auth/google/callback', [LoginController::class, 'handleGoogleCallback']);
	Route::get('/auth/github', [LoginController::class, 'redirectToGithub']);
	Route::get('/auth/github/callback', [LoginController::class, 'handleGithubCallback']);

	Route::middleware([
		'auth:sanctum',
		config('jetstream.auth_session'),
		'verified',
	])->group(function () {


		Route::post('/ideas/new', [IdeaController::class, 'new'])->name('ideas.new');
		Route::post('/application', [\App\Http\Controllers\ApplicationController::class, 'new'])->name('application.new');
		Route::get('/applications', [ApplicationController::class, 'show'])->name('applications.show');
		Route::post('/applications/decline', [ApplicationController::class, 'decline'])->name('applications.decline');
		Route::post('/applications/approve', [ApplicationController::class, 'approve'])->name('applications.approve');
		Route::post('/applications', [ApplicationController::class, 'search'])->name('applications.search');
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
		Route::put('/ideas/{id}', [IdeaController::class, 'update'])->name('ideas.update');
		Route::get('/my-ideas', [IdeaController::class, 'myIdeas'])->name('ideas.mine');

		Route::get('/{ideaId}/add-tasks', [TaskController::class, 'index'])->name('tasks.index');
		Route::post('/ideas/{ideaId}/tasks', [TaskController::class, 'create'])->name('tasks.create');
		Route::delete('/ideas/{ideaId}/tasks/{taskId}', [TaskController::class, 'delete'])->name('tasks.delete');
		Route::get('/ideas/{ideaId}/received-applications', [ReceivedApplications::class, 'index'])->name('received.index');

		Route::get('/messages/{userId}', [MessagesController::class, 'index'])->name('messages.index');
		Route::get('/messages/received', [MessagesController::class, 'received'])->name('messages.received');
		Route::post('/messages', function (Request $request) {
			$request->validate([
				'message'     => 'required|string',
				'recipientId' => 'required|string',
			]);

			MessageSent::dispatch(auth()->user()->name, $request->message, $request->recipientId);
			return response()->json([
				'text' => 'Message sent!',
				'user' => auth()->user()->name,
			]);
		})->name('messages.send');
	});
});

<?php

use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\MessageSent;
use App\Http\Controllers\TaskController;
use Inertia\Inertia;

Route::get('/user', function (Request $request) {
	return $request->user();
})->middleware('auth:sanctum');

Route::post('/messages', function (Request $request) {
	$request->validate([
		'message' => 'required|string',
	]);

	MessageSent::dispatch(auth()->user()->name, $request->message);

	return response()->json(['status' => 'Message sent!']);
})->middleware('auth:sanctum');

Route::post('/messages', function (Request $request) {
	$request->validate([
		'message' => 'required|string',
	]);

	MessageSent::dispatch(auth()->user()->name, $request->message);

	return response()->json(['status' => 'Message sent!']);
})->middleware('auth:sanctum');

Route::get('/cached-task-statuses/{ideaId}', [TaskController::class, 'getCachedTaskStatuses']);

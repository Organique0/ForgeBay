<?php

use Illuminate\Support\Facades\Broadcast;

/*Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});*/

//as long as you are logged in you can listen to the messages channel
// Broadcast::channel('messages.{recipientId}', function ($user, $recipientId) {
// 	// Allow only if the authenticated user is the intended recipient.
// 	return (int) $user->id === (int) $recipientId;
// });
Broadcast::channel('messages.{application_id}', function ($user, $application_id) {
	$application = \App\Models\Application::with('task.idea')->findOrFail($application_id);

	// Allow if user is the applicant
	if ((int) $user->id === (int) $application->user_id) {
		return true;
	}

	// Allow if user is the idea creator
	if ((int) $user->id === (int) $application->task->idea->user_id) {
		return true;
	}

	return false;
});

Broadcast::channel('chat.{application_id}', function ($user, $conversationUserId) {
	return ['id' => $user->id, 'name' => $user->name];
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
	return (int) $user->id === (int) $id;
});

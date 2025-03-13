<?php

use Illuminate\Support\Facades\Broadcast;

/*Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});*/

//as long as you are logged in you can listen to the messages channel
Broadcast::channel('messages.{recipientId}', function ($user, $recipientId) {
	// Allow only if the authenticated user is the intended recipient.
	return (int) $user->id === (int) $recipientId;
});

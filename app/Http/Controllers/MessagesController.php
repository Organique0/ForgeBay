<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class messagesController extends Controller
{
   public function index($userId) {
		return Inertia::render('MessagingPage', [
			'recipientId' => $userId
		]);
	 }

	 public function received()
	 {
		return Inertia::render('MessagingPage', [

		]);
	 }
}

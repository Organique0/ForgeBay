<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Events\MessageSent;
use App\Models\Application;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class messagesController extends Controller
{
   public function index($applicationId) {

		$messages = Message::with(['user:id,name'])->where('application_id', $applicationId)->get();
		$application = Application::with('user:id,name')->where('id', $applicationId)->first();
		return Inertia::render('MessagingPage', [
			'loadedMessages' => $messages,
			'application' => $application
		]);
	 }

	 public function received()
	 {
		$messages = Message::with(['user:id,name'])->where('user_id', auth()->id())->get();
		return Inertia::render('MessagingPage', [
			'loadedMessages' => $messages,
		]);
	 }

	public function SendMessage(Request $request) {
			$request->validate([
				'message'     => 'required|string',
				'application_id' => 'required|string',
				//'recipient_id' => 'required|string'
			]);

		$message = Message::create([
			'application_id' => $request->application_id,
			'user_id'      => auth()->id(),
			'message'        => $request->message,
			'created_at'     => now(),
			'updated_at'     => now()
		]);

		//$message->recipient_user = User::where('id', $request->recipient_id)->select('id', 'name')->first();
		$message->user = User::where('id', auth()->id())->select('id', 'name')->first();

		broadcast(new MessageSent($request->application_id, $message))->toOthers();
			return response()->json([
				'text' => 'Message sent!',
				'message' => $message
			]);
		}

}


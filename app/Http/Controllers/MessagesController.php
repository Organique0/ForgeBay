<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Events\MessageSent;
use App\Models\Application;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class messagesController extends Controller
{
public function index($applicationId) {

		$messages = Message::with(['user:id,name'])->where('application_id', $applicationId)->get();

		// Load only the user who created the idea/task for this application and the application submitter
		$application = Application::with(['task.idea.user:id,name', 'user:id,name'])->find($applicationId);

		$ideaCreator = null;
		if ($application && $application->task && $application->task->idea && $application->task->idea->user) {
			$ideaCreator = $application->task->idea->user; // already limited to id,name
		}

		$recepientUser = null;
		if ($application && $application->user) {
			$recepientUser = $application->user; // the user who submitted the application (id,name)
		}

		return Inertia::render('MessagingPage', [
			'loadedMessages' => $messages,
			'ideaCreator'    => $ideaCreator,
			'recepientUser'  => $recepientUser,
		]);
	 }

	//  public function received()
	//  {
	// 	$messages = Message::with(['user:id,name'])->where('user_id', auth()->id())->get();
	// 	return Inertia::render('MessagingPage', [
	// 		'loadedMessages' => $messages,
	// 	]);
	//  }

	public function SendMessage(Request $request) {
			$request->validate([
				'message' => 'nullable|string',
				'application_id' => 'required|string',
				'attachments' => 'nullable|array'
				//'recipient_id' => 'required|string'
			]);

		$message = Message::create([
			'application_id' => $request->application_id,
			'user_id'      => auth()->id(),
			'message'        => $request->message,
			'created_at'     => now(),
			'updated_at'     => now()
		]);

		if ($request->hasFile('attachments')) {
			$attachmentsUrls = [];
			foreach ($request->file('attachments') as $file) {
				$mimeType = $file->getMimeType();
				$filename = time() . '_' . $file->getClientOriginalName();
				$path = 'messages/' . $filename;

				if (str_starts_with($mimeType, 'image/')) {
					$image = Image::read($file)->scaleDown(500, 500);
					Storage::disk('public')->put($path, (string) $image->encode());
				} else {
					Storage::disk('public')->putFileAs('messages', $file, $filename);
				}

				$attachmentsUrls[] = asset('storage/' . $path);
			}
			$message->attachmentUrl = json_encode($attachmentsUrls);
			$message->save();
		}

		//$message->recipient_user = User::where('id', $request->recipient_id)->select('id', 'name')->first();
		
		$message->user = User::where('id', auth()->id())->select('id', 'name')->first();

		broadcast(new MessageSent($request->application_id, $message))->toOthers();

		return response()->json([
			'text' => 'Message sent!',
			'message' => $message
		]);
	}

}


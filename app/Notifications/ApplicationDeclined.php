<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ApplicationDeclined extends Notification
{
	use Queueable;
	public $applicationId;

	/**
	 * Create a new notification instance.
	 */
	public function __construct($applicationId)
	{
		$this->applicationId = $applicationId;
	}

	/**
	 * Get the notification's delivery channels.
	 *
	 * @return array<int, string>
	 */
	public function via(object $notifiable): array
	{
		return ['database', 'broadcast'];
	}

	/**
	 * Get the array representation of the notification.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(object $notifiable): array
	{
		return [
			'message' => 'Your application has been declined.',
			'action_url' => url('/applications?highlight=' . $this->applicationId),
		];
	}

	/**
	 * Get the broadcast representation of the notification.
	 *
	 * @return BroadcastMessage
	 */
	public function toBroadcast(object $notifiable): BroadcastMessage
	{
		return new BroadcastMessage([
			'message' => 'Your application has been declined.',
			'action_url' => url('/applications?highlight=' . $this->applicationId),
		]);
	}
}

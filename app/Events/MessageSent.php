<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public string $channel;

	public function __construct(
		public string $application_id,
		public string $recipient_id,
		public string $message,
	) {
		$this->channel = 'messages.' . $application_id;
	}

	public function broadcastOn(): array
	{
		return [
			new PrivateChannel($this->channel),
		];
	}
}

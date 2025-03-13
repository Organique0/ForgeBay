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

	public function __construct(
		public string $name,
		public string $message,
		public int $recipientId
	) {}

	public function broadcastOn(): array
	{
		return [
			new PrivateChannel('messages.' . $this->recipientId),
		];
	}
}

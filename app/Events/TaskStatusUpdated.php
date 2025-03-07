<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStatusUpdated implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public $taskId;
	public $status;
	public $ideaId; // Add ideaId property

	/**
	 * Create a new event instance.
	 *
	 * @param  int  $taskId
	 * @param  string  $status
	 * @param  int  $ideaId // Add ideaId parameter
	 * @return void
	 */
	public function __construct(int $taskId, string $status, int $ideaId)
	{
		$this->taskId = $taskId;
		$this->status = $status;
		$this->ideaId = $ideaId; // Assign ideaId
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return \Illuminate\Broadcasting\Channel|array
	 */
	public function broadcastOn()
	{
		return new Channel('task.updates'); // Broadcast on a global channel
	}
}

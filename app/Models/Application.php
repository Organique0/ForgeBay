<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
	/** @use HasFactory<\Database\Factories\ApplicationFactory> */
	use HasFactory;

	protected $fillable = [
		'include_profile',
		'user_id',
		'task_id',
		'description',
		'status'
	];

	public function task(): BelongsTo
	{
		return $this->belongsTo(Task::class);
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function idea()
	{
		return $this->belongsTo(Idea::class, 'task_id', 'id')
			->join('tasks', 'tasks.idea_id', '=', 'ideas.id')
			->where('tasks.id', '=', $this->task_id);
	}
}

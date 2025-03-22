<?php

namespace App\Models;

use App\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
	/** @use HasFactory<\Database\Factories\TaskFactory> */
	use HasFactory;

	protected $hidden = ['user_id'];
	protected $appends = ['has_applied'];

	public function getHasAppliedAttribute()
	{
		if ($this->status !== TaskStatus::TO_DO) {
			return null;
		}

		if (!auth()->check()) {
			return false;
		}

		return $this->applications()
			->where('user_id', auth()->id())
			->exists();
	}

	protected $fillable = [
		'name',
		'description',
		'value',
		'status'
	];

	protected $casts = [
		'status' => TaskStatus::class,
	];


	public function idea(): BelongsTo
	{
		return $this->belongsTo(Idea::class);
	}

	public function applications(): HasMany
	{
		return $this->hasMany(Application::class);
	}
}

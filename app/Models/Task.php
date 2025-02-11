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

	protected $fillable = [
		'name',
		'description',
		'value',
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

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}
}

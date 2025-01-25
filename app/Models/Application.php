<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    /** @use HasFactory<\Database\Factories\ApplicationFactory> */
    use HasFactory;

	protected $fillable = [
		'status',
	];

	public function task(): BelongsTo
	{
		return $this->belongsTo(Task::class);
	}

	public function users(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}
}

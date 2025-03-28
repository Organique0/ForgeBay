<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
	/** @use HasFactory<\Database\Factories\IdeaFactory> */
	use HasFactory;
	protected $fillable = ['name'];

	public function ideas(): BelongsToMany
	{
		return $this->belongsToMany(Idea::class, 'idea_tag');
	}

	public function users()
	{
		return $this->belongsToMany(User::class, 'tags_users');
	}
}

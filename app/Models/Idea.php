<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Laravel\Scout\Searchable;

class Idea extends Model
{
	/** @use HasFactory<\Database\Factories\IdeaFactory> */
	use HasFactory, Searchable;

	protected $fillable = [
		'title',
		'description',
		'active'
	];

	protected static function boot()
	{
		parent::boot();

		// static::updated(function ($idea) {
		// 	Cache::tags(["idea.{$idea->id}", 'ideas'])->flush();
		// });

		// static::deleted(function ($idea) {
		// 	Cache::tags(["idea.{$idea->id}", 'ideas'])->flush();
		// });

		// static::updated(function ($idea) {
		// 	$idea->searchable();
		// });

		// // When tasks are updated, update the parent idea
		// static::updated(function ($idea) {
		// 	$idea->load(['tasks', 'tags', 'user']); // Ensure relationships are loaded
		// 	$idea->searchable();
		// });
	}

	public function tasks(): HasMany
	{
		return $this->hasMany(Task::class);
	}

	public function tags(): BelongsToMany
	{
		return $this->belongsToMany(Tag::class, 'idea_tag');
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function applications(): HasManyThrough
	{
		return $this->hasManyThrough(Application::class, Task::class);
	}


	public function toSearchableArray()
	{
		$this->load(['tags', 'tasks', 'user']);

		$array = [
			'id'					=> $this->id,
			'title'       => $this->title,
			'description' => $this->description,
			'tags'        => $this->tags->pluck('name')->toArray(),
			'active'      => $this->active,
			'created_at'  => $this->created_at,
			'updated_at'  => $this->updated_at,
			'value'       => $this->tasks->sum('value'),
			'user'				=> $this->user->only(['id', 'name']),
		];

		return $array;
	}
}

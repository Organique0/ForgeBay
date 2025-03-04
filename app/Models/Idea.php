<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Laravel\Scout\Searchable;
use Meilisearch\Client;

class Idea extends Model
{
	/** @use HasFactory<\Database\Factories\IdeaFactory> */
	use HasFactory, Searchable;

	protected $fillable = [
		'title',
		'description',
		'active',
		'expires'
	];

	// public function updateSearchIndex()
	// {
	// 	$client = new Client('http://localhost:7700');
	// 	$index = $client->index('ideas');

	// 	$this->load(['tags', 'tasks', 'user']);
	// 	$document = $this->toSearchableArray();

	// 	return $index->updateDocuments([$document]);
	// }

	public static function deactivateExpiredIdeas()
	{
		return static::query()
			->where('expires', '<=', now())
			->where('active', true)
			->update(['active' => false]);
	}

	protected static function boot()
	{
		parent::boot();

		static::deleted(function ($idea) {
			$idea->searchable();
		});
		static::created(function ($idea) {
			$idea->searchable();
		});
		static::updated(function ($idea) {
			$idea->searchable();
		});

		// When tasks related to idea change
		// static::saved(function ($idea) {
		// 	$idea->tasks->each(function ($task) use ($idea) {
		// 		Cache::tags(["idea.{$idea->id}", 'ideas'])->flush();
		// 	});
		// });

		// // When tasks are updated, update the parent idea
		// static::updated(function ($idea) {
		// 	$idea->load(['tasks', 'tags', 'user']); // Ensure relationships are loaded
		// 	$idea->searchable();
		// });

		// static::updated(function ($idea) {
		// 	$idea->updateSearchIndex();
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
		$applicationsCount = DB::table('applications')
			->join('tasks', 'applications.task_id', '=', 'tasks.id')
			->where('tasks.idea_id', $this->id)
			->count();

		$array = [
			'id'					=> $this->id,
			'title'       => $this->title,
			'description' => $this->description,
			'tags'        => $this->tags->pluck('name')->toArray(),
			'active'      => $this->active,
			'created_at'  => $this->created_at,
			'updated_at'  => $this->updated_at,
			'expires'     => $this->expires,
			'value'       => $this->tasks->sum('value'),
			'user'				=> $this->user->only(['id', 'name']),
			'applications_count' => $applicationsCount,
			'task_count' => $this->tasks->count(),

		];

		return $array;
	}
}

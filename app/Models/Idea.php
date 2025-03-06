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
	use HasFactory;
	use Searchable;

	//tntsearch option
	public $asYouType = true;

	public function toSearchableArray(): array
	{
		$this->load(['tags', 'tasks', 'user', 'applications', 'tasks']);

		$tags = $this->tags->pluck('name');
		$value = $this->tasks->sum('value');

		$array = [
			'id'          => (int) $this->id,
			'title'       => (string) $this->title,
			'description' => (string) $this->description,
			'tags'        => $tags,
			'active'      => $this->active,
			'total_value'       => $value,
			'user'        => $this->user->only(['id', 'name']),
			'applications_count' => $this->tasks->count('applications'),
			'tasks_count'  => $this->tasks->count(),
			'created_at'  => $this->created_at,
			'updated_at'  => $this->updated_at,
			// Add a combined field for better searchability
			//'searchable'  => $this->title . ' ' . $this->description . ' ' . $tags,
		];

		return $array;
		//\Log::info('Data being indexed for model ' . $this->id, $array);
	}

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


		// static::deleted(function ($idea) {
		// 	$idea->searchable();
		// });
		// static::created(function ($idea) {
		// 	$idea->searchable();
		// });
		// static::updated(function ($idea) {
		// 	$idea->searchable();
		// });

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


}

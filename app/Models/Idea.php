<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Laravel\Scout\Searchable;
use Illuminate\Support\Facades\DB;

class Idea extends Model
{
	/** @use HasFactory<\Database\Factories\IdeaFactory> */
	use HasFactory;
	use Searchable;

	//tntsearch option
	public $asYouType = true;

	public function toSearchableArray(): array
	{
		//$this->load(['tags']);

		//$tags = $this->tags->pluck('name');
		//$tagsString = $tags->implode(', '); // Convert collection to string
		//$value = $this->tasks->sum('value');

		$returnArray =  [
			'id'                => (int)$this->id,
			'title'             => (string)$this->title,
			'description'       => (string)$this->description,
			//'tags'              => (string)$tagsString, // Now it's a string TNTSearch can handle
			//'active'            => (bool)$this->active,
			//'total_value'       => (int)$value,
			//'user'              => $this->user ? $this->user->name : null,
			// 'applications_count' => (int)$this->tasks->sum(function ($task) {
			// 	return $task->applications->count();
			// }),
			// 'tasks_count'       => (int)$this->tasks->count(),
			//'created_at'        => $this->created_at->toDateTimeString(),
			//'updated_at'        => $this->updated_at->toDateTimeString(),
		];

		return $returnArray;
	}

	/**
     * Scope for the landing page ideas (active, have at least one to_do task, with counts/sums).
     */
    public function scopeIdeasList($query, int $limit = 6)
    {
        return $query->where('active', true)
            ->whereHas('tasks', fn($q) => $q->where('status', 'to_do'))
            ->with('user:id,name')
            ->with(['tags' => fn($q) => $q->select('tags.id', 'tags.name')])
            ->withSum('tasks as total_value', 'value')
            ->withCount('tasks')
			->withCount('applications')
            ->take($limit);
    }

	/**
     * Scope for the idea detail page (active, have at least one to_do task, with counts/sums and eager-loaded relationships).
     */
    public function scopeIdeasPage($query)
    {
        return $query->where('active', true)
            ->with([
                // eager-load tasks and include applications count on each task
                'tasks' => function ($q) {
                    $q->withCount('applications');
                },
                // eager-load user but only id/name
                'user:id,name',
                // eager-load tags (select columns only)
                'tags' => fn($q) => $q->select('tags.id', 'tags.name'),
            ])
            ->withSum('tasks as total_value', 'value')
            ->withCount('tasks')
            ->withCount('applications');
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

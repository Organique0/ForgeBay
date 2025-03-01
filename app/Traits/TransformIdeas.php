<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Collection;

trait TransformIdeas
{
	public function transformIdea($idea): array
	{
		return [
			'id'                 => $idea->id,
			'title'              => $idea->title,
			'description'        => $idea->description,
			'tags'               => $idea->tags->pluck('name')->toArray(),
			'active'             => $idea->active,
			'created_at'         => $idea->created_at,
			'updated_at'         => $idea->updated_at,
			'expires'            => $idea->expires,
			'value'              => $idea->tasks->sum('value'),
			'user'               => $idea->user ? $idea->user->only(['id', 'name']) : null,
			'applications_count' => $idea->tasks->sum('applications_count'),
			'task_count'         => $idea->tasks->count(),
		];
	}

	/**
	 * Transform a collection of Idea models.
	 */
	public function transformIdeas(Collection $ideas): array
	{
		return $ideas->map(fn($idea) => $this->transformIdea($idea))->toArray();
	}
}

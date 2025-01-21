<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
   protected $fillable = ['name'];

	public function ideas(): BelongsToMany
	{
		return $this->belongsToMany(Idea::class, 'idea_tag');
	}
}

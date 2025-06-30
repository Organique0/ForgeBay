<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
	protected $table = 'message';
   protected $fillable = [
		'message',
		'user_id',
		'attachmentUrl',
		'application_id',
	 ];

	 public function application(): BelongsTo
	 {
			return $this->belongsTo(Application::class);
	 }

	 public function user(): BelongsTo
	 {
		return $this->belongsTo(User::class);
	 }
}

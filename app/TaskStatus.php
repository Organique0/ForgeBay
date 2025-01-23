<?php

namespace App;

enum TaskStatus: string
{
	case TO_DO = 'to_do';
	case IN_PROGRESS = 'in_progress';
	case DONE = 'done';
}


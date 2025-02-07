<?php

namespace App;

enum ApplicationStatus: string
{
	case Review = 'review';
	case Approved = 'approved';
	case Declined = 'declined';
}

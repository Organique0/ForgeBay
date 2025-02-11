<?php

namespace App;

enum ApplicationStatus: string
{
	case Sent = 'sent';
	case Approved = 'approved';
	case Declined = 'declined';
}

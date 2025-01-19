<?php

namespace App;

enum RolesEnum: string
{
    case Admin = 'admin';
    case User = 'user';
//    case Seller = 'seller';
	case SuperAdmin = 'super-admin';
}

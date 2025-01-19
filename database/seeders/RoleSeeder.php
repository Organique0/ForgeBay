<?php

namespace Database\Seeders;

use App\PermissionsEnum;
use App\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userRole = Role::create(['name' => RolesEnum::User->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
//        $sellerRole = Role::create(['name' => RolesEnum::Seller->value]);
		$superAdminRole = Role::create(['name' => RolesEnum::SuperAdmin->value]);

        //you can also make permissions here and sync them with roles
		$modifyAdmins = Permission::create(['name' => PermissionsEnum::ModifyAdmins->value]);
    }
}

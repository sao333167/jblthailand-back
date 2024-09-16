<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' =>'super', 'guard_name' => 'api-admin'])->givePermissionTo(Permission::all());
        Role::create(['name' =>'admin', 'guard_name' => 'api-admin'])->givePermissionTo('admin-list');
        Role::create(['name' =>'moderator', 'guard_name' => 'api-admin']);
        Role::create(['name' =>'user', 'guard_name' => 'api-admin']);

        

    }
}
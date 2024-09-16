<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Permissions
        $permissions = [
            'role-list',
            'role-view',
            'role-create',
            'role-edit',
            'role-delete',
            'permission-list',
            'permission-view',
            'permission-create',
            'permission-edit',
            'permission-delete',
            'admin-list',
            'admin-view',
            'admin-create',
            'admin-edit',
            'admin-delete',
            'user-list',
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',
            'report-list',
            'report-view',
            'report-create',
            'report-edit',
            'report-delete',
            'bank-list',
            'bank-view',
            'bank-create',
            'bank-edit',
            'bank-delete',
            'deposit-list',
            'deposit-view',
            'deposit-create',
            'deposit-edit',
            'deposit-delete',
            'withdraw-list',
            'withdraw-view',
            'withdraw-create',
            'withdraw-edit',
            'withdraw-delete',
            
            
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api-admin']);
        }
    }
}
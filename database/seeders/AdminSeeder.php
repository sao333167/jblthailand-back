<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $admins = [
            ['name' => 'Super', 'phone' => '015333167', 'email' => 'super@admin.com', 'role' => 'super'],
            ['name' => 'Admin', 'phone' => '015333168', 'email' => 'admin@admin.com', 'role' => 'admin'],
        ];

        foreach ($admins as $adminData) {
            $admin = \App\Models\Admin::create([
                'uuid' => (string) Str::uuid(),
                'phone' => $adminData['phone'],
                'name' => $adminData['name'],
                // 'email' => $admin['email'],
                // 'status' => 0,
                'point' => 1000,
                'password' => Hash::make('Aa445566'),
                'plain_password' => 'Aa445566',
                'referral_code' => strtoupper("ADRF" . Str::random(8)),
                'remember_token' => Str::random(10),
                // 'email_verified_at' => now(),
            ]);

            $admin ->assignRole($adminData['role']);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Support\Str;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'customer1', 'tel' => '015333170'],
            ['name' => 'customer2', 'tel' => '015333171',],
        ];

        foreach ($users as $userData) {
            $user = \App\Models\User::create([
                'uuid' => (string) Str::uuid(),
                'tel' => $userData['tel'],
                'name' => $userData['name'],
                'username' => $userData['name'],
                // 'email' => $admin['email'],
                // 'status' => 0,
                // 'point' => 1000,
                'password' => Hash::make('Aa445566'),
                'plain_password' => 'Aa445566',
                'referral_code' => strtoupper("ADRF" . Str::random(8)),
                'remember_token' => Str::random(10),
                // 'email_verified_at' => now(),
            ]);
        }
    }
}
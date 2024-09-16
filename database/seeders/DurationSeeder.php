<?php

namespace Database\Seeders;

use App\Models\Duration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Duration::truncate();

        Duration::create([
            'month' => '6',
            'percent' => '1.2'
        ]);

        Duration::create([
            'month' => '12',
            'percent' => '1.8'
        ]);

        Duration::create([
            'month' => '24',
            'percent' => '3'
        ]);

        Duration::create([
            'month' => '36',
            'percent' => '3.5'
        ]);

        // Duration::create([
        //     'month' => '60',
        //     'percent' => '5'
        // ]);
    }
}
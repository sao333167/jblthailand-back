<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statusArr = $this->getStatuses();
        foreach ($statusArr as $status) {
            Status::UpdateorCreate([
                'uuid' => (string) Str::uuid(),
                'name' => $status['name'],
                'color' => $status['color']
            ]);
        }
    }

    /**
     * getStatuses
     *
     * @return array
     */
    private function getStatuses()
    {
        return [
            [
                'name' => 'Pending',
                'color' => '#c06816'
            ],
            [
                'name' => 'Approved',
                'color' => '#21d335'
            ],
            [
                'name' => 'under review',
                'color' => '#09729f'
            ],
            [
                'name' => 'Overdue Record',
                'color' => '#d0021b'
            ],
            [
                'name' => 'freeze loan account',
                'color' => '#d0021b'
            ]
        ];
    }
}

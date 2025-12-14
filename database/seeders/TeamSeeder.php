<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            ['name' => 'Time Azul', 'color' => '#3B82F6'],
            ['name' => 'Time Branco', 'color' => '#F5F5F5'],
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}

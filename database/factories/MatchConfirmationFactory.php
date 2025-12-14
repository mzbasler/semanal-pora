<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MatchConfirmation>
 */
class MatchConfirmationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'football_match_id' => \App\Models\FootballMatch::factory(),
            'is_confirmed' => fake()->boolean(),
            'confirmed_by' => fake()->randomElement(['player', 'admin']),
        ];
    }
}

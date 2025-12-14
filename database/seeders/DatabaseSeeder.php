<?php

namespace Database\Seeders;

use App\Models\User;
use App\UserRole;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TeamSeeder::class,
        ]);

        // Criar usuários de teste
        $presidente = User::firstOrCreate(
            ['email' => 'presidente@example.com'],
            [
                'name' => 'João Presidente',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => UserRole::President,
            ]
        );

        $vicePresidente = User::firstOrCreate(
            ['email' => 'vice@example.com'],
            [
                'name' => 'Maria Vice',
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => UserRole::VicePresident,
            ]
        );

        // Criar 15 jogadores de teste
        $jogadores = [];
        for ($i = 1; $i <= 15; $i++) {
            $jogadores[] = User::firstOrCreate(
                ['email' => "jogador{$i}@example.com"],
                [
                    'name' => "Jogador {$i}",
                    'password' => 'password',
                    'email_verified_at' => now(),
                    'role' => UserRole::Player,
                ]
            );
        }

        // Criar uma partida futura com limite de 10 jogadores
        $teams = \App\Models\Team::all();
        $partidaFutura = \App\Models\FootballMatch::create([
            'scheduled_at' => now()->addDays(2),
            'team_a_id' => $teams->first()->id,
            'team_b_id' => $teams->last()->id,
            'status' => 'scheduled',
            'max_players' => 10,
        ]);

        // Confirmar 8 jogadores (ainda tem 2 vagas)
        for ($i = 0; $i < 8; $i++) {
            \App\Models\MatchConfirmation::create([
                'football_match_id' => $partidaFutura->id,
                'user_id' => $jogadores[$i]->id,
                'is_confirmed' => true,
                'confirmed_by' => 'player',
                'created_at' => now()->subMinutes(60 - $i),
            ]);
        }

        // Adicionar 3 jogadores na lista de espera
        for ($i = 10; $i < 13; $i++) {
            \App\Models\MatchConfirmation::create([
                'football_match_id' => $partidaFutura->id,
                'user_id' => $jogadores[$i]->id,
                'is_confirmed' => false,
                'confirmed_by' => 'player',
                'created_at' => now()->subMinutes(20 - ($i - 10)),
            ]);
        }

        // Criar uma partida antiga já finalizada
        $partidaFinalizada = \App\Models\FootballMatch::create([
            'scheduled_at' => now()->subDays(7),
            'played_at' => now()->subDays(7),
            'team_a_id' => $teams->first()->id,
            'team_b_id' => $teams->last()->id,
            'team_a_score' => 5,
            'team_b_score' => 3,
            'status' => 'completed',
            'max_players' => 10,
        ]);

        // Adicionar jogadores aos times da partida finalizada
        for ($i = 0; $i < 5; $i++) {
            \App\Models\MatchPlayer::create([
                'football_match_id' => $partidaFinalizada->id,
                'user_id' => $jogadores[$i]->id,
                'team_id' => $teams->first()->id,
                'goals' => fake()->numberBetween(0, 2),
                'assists' => fake()->numberBetween(0, 2),
            ]);
        }

        for ($i = 5; $i < 10; $i++) {
            \App\Models\MatchPlayer::create([
                'football_match_id' => $partidaFinalizada->id,
                'user_id' => $jogadores[$i]->id,
                'team_id' => $teams->last()->id,
                'goals' => fake()->numberBetween(0, 2),
                'assists' => fake()->numberBetween(0, 2),
            ]);
        }

        // Criar uma eleição ativa
        $eleicao = \App\Models\Election::create([
            'title' => 'Eleição para Presidente 2025',
            'description' => 'Escolha o próximo presidente do campeonato',
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(7),
            'status' => 'active',
        ]);

        // Alguns votos na eleição
        for ($i = 0; $i < 5; $i++) {
            \App\Models\Vote::create([
                'election_id' => $eleicao->id,
                'voter_id' => $jogadores[$i]->id,
                'president_candidate_id' => $jogadores[10]->id,
                'vice_president_candidate_id' => $jogadores[11]->id,
            ]);
        }
    }
}

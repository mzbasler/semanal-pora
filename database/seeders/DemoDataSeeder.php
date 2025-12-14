<?php

namespace Database\Seeders;

use App\Models\Election;
use App\Models\FootballMatch;
use App\Models\MatchConfirmation;
use App\Models\MatchPlayer;
use App\Models\Team;
use App\Models\User;
use App\Models\Vote;
use App\UserRole;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar 30 usuários (27 jogadores + 1 presidente + 1 vice + 1 teste)
        $users = [];

        // Nomes brasileiros realistas
        $nomes = [
            'Gabriel Silva', 'Lucas Santos', 'Rafael Oliveira', 'Felipe Costa', 'Bruno Alves',
            'Matheus Lima', 'Pedro Souza', 'Rodrigo Martins', 'Fernando Rocha', 'Diego Ferreira',
            'Thiago Cardoso', 'Marcelo Ribeiro', 'André Barbosa', 'Carlos Pereira', 'João Mendes',
            'Paulo Araújo', 'Ricardo Dias', 'Vinícius Nunes', 'Gustavo Freitas', 'Leandro Moreira',
            'Eduardo Gomes', 'Fábio Castro', 'Juliano Correia', 'Renato Batista', 'Danilo Teixeira',
            'Marcos Pinto', 'Alexandre Monteiro', 'Igor Rodrigues',
        ];

        foreach ($nomes as $index => $nome) {
            $email = strtolower(str_replace(' ', '.', $nome)).'@example.com';
            $users[] = User::create([
                'name' => $nome,
                'email' => $email,
                'password' => 'password',
                'email_verified_at' => now(),
                'role' => UserRole::Player,
            ]);
        }

        // Pegar times existentes
        $teamA = Team::where('name', 'Time Azul')->first();
        $teamB = Team::where('name', 'Time Branco')->first();

        // Criar 10 partidas (5 finalizadas, 3 agendadas, 2 com escalação)
        $matches = [];

        // Partidas finalizadas (com estatísticas)
        for ($i = 0; $i < 5; $i++) {
            $match = FootballMatch::create([
                'scheduled_at' => now()->subDays(20 - ($i * 3)),
                'played_at' => now()->subDays(20 - ($i * 3)),
                'team_a_id' => $teamA->id,
                'team_b_id' => $teamB->id,
                'status' => 'completed',
            ]);

            // Pegar jogadores aleatórios para esta partida (16 jogadores: 8 por time)
            $playersForMatch = collect($users)->random(min(16, count($users)));

            $teamAPlayers = $playersForMatch->take(8);
            $teamBPlayers = $playersForMatch->slice(8, 8);

            $teamAGoals = 0;
            $teamBGoals = 0;

            // Criar jogadores do Time A com estatísticas
            foreach ($teamAPlayers as $player) {
                $goals = rand(0, 3);
                $assists = rand(0, 2);
                $teamAGoals += $goals;

                MatchPlayer::create([
                    'football_match_id' => $match->id,
                    'user_id' => $player->id,
                    'team_id' => $teamA->id,
                    'goals' => $goals,
                    'assists' => $assists,
                ]);
            }

            // Criar jogadores do Time B com estatísticas
            foreach ($teamBPlayers as $player) {
                $goals = rand(0, 3);
                $assists = rand(0, 2);
                $teamBGoals += $goals;

                MatchPlayer::create([
                    'football_match_id' => $match->id,
                    'user_id' => $player->id,
                    'team_id' => $teamB->id,
                    'goals' => $goals,
                    'assists' => $assists,
                ]);
            }

            // Atualizar placar
            $match->update([
                'team_a_score' => $teamAGoals,
                'team_b_score' => $teamBGoals,
            ]);

            $matches[] = $match;
        }

        // Próxima partida (única partida agendada com escalação definida)
        $match = FootballMatch::create([
            'scheduled_at' => now()->addDays(1),
            'team_a_id' => $teamA->id,
            'team_b_id' => $teamB->id,
            'status' => 'scheduled',
        ]);

        // Confirmações (16 jogadores aprovados: 8 por time)
        $confirmedPlayers = collect($users)->random(min(16, count($users)));
        foreach ($confirmedPlayers as $player) {
            MatchConfirmation::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'is_confirmed' => true,
                'confirmed_by' => 'admin',
            ]);
        }

        // Adicionar alguns jogadores pendentes de aprovação
        $remainingUsers = collect($users)->diff($confirmedPlayers);
        $pendingPlayers = $remainingUsers->random(min(5, $remainingUsers->count()));
        foreach ($pendingPlayers as $player) {
            MatchConfirmation::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'is_confirmed' => false,
                'confirmed_by' => 'player',
            ]);
        }

        // Escalação (8 jogadores por time: 7 titulares + 1 reserva)
        $teamAPlayers = $confirmedPlayers->take(8);
        $teamBPlayers = $confirmedPlayers->slice(8, 8);

        foreach ($teamAPlayers as $player) {
            MatchPlayer::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'team_id' => $teamA->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        foreach ($teamBPlayers as $player) {
            MatchPlayer::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'team_id' => $teamB->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        $matches[] = $match;

        // Criar 2 eleições (1 finalizada, 1 ativa)

        // Eleição finalizada
        $pastElection = Election::create([
            'title' => 'Eleição 2024 - 1º Semestre',
            'description' => 'Primeira eleição do ano para escolher presidente e vice-presidente do grupo',
            'starts_at' => now()->subDays(30),
            'ends_at' => now()->subDays(23),
            'status' => 'completed',
        ]);

        // Votos na eleição passada (20 votos)
        $voters = collect($users)->random(min(20, count($users)));
        foreach ($voters as $voter) {
            $candidates = collect($users)->where('id', '!=', $voter->id)->random(2);
            Vote::create([
                'election_id' => $pastElection->id,
                'voter_id' => $voter->id,
                'president_candidate_id' => $candidates[0]->id,
                'vice_president_candidate_id' => $candidates[1]->id,
            ]);
        }

        // Eleição ativa
        $activeElection = Election::create([
            'title' => 'Eleição 2024 - 2º Semestre',
            'description' => 'Escolha os novos representantes para o segundo semestre',
            'starts_at' => now()->subDays(2),
            'ends_at' => now()->addDays(5),
            'status' => 'active',
        ]);

        // Alguns votos na eleição ativa (12 votos)
        $activeVoters = collect($users)->random(min(12, count($users)));
        foreach ($activeVoters as $voter) {
            $candidates = collect($users)->where('id', '!=', $voter->id)->random(2);
            Vote::create([
                'election_id' => $activeElection->id,
                'voter_id' => $voter->id,
                'president_candidate_id' => $candidates[0]->id,
                'vice_president_candidate_id' => $candidates[1]->id,
            ]);
        }

        // Eleição futura
        Election::create([
            'title' => 'Eleição 2025',
            'description' => 'Próxima eleição agendada para o início do ano',
            'starts_at' => now()->addDays(60),
            'ends_at' => now()->addDays(67),
            'status' => 'scheduled',
        ]);

        $this->command->info('✅ 28 usuários criados');
        $this->command->info('✅ 6 partidas criadas (5 finalizadas, 1 próxima com escalação)');
        $this->command->info('✅ 3 eleições criadas (1 finalizada, 1 ativa, 1 agendada)');
        $this->command->info('✅ Estatísticas e votos gerados');
    }
}

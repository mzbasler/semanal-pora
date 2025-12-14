<?php

namespace Database\Seeders;

use App\Models\FootballMatch;
use App\Models\MatchConfirmation;
use App\Models\MatchPlayer;
use App\Models\Team;
use App\Models\User;
use App\UserRole;
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

        // Jogadores com nomes/apelidos brasileiros realistas de pelada
        $jogadores = [
            ['name' => 'Maurício Basler', 'email' => 'basler.mauricio@gmail.com', 'password' => 'ozzy123BASLER', 'role' => UserRole::President],
            ['name' => 'Gaguinho', 'email' => 'gaguinho@semanal.com', 'password' => 'password', 'role' => UserRole::VicePresident],
            ['name' => 'Neguinho', 'email' => 'neguinho@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Gordo', 'email' => 'gordo@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Magrão', 'email' => 'magrao@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Baixinho', 'email' => 'baixinho@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Pelé', 'email' => 'pele@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Zico', 'email' => 'zico@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Vampeta', 'email' => 'vampeta@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Ronaldinho', 'email' => 'ronaldinho@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Dentinho', 'email' => 'dentinho@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Careca', 'email' => 'careca@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Bigode', 'email' => 'bigode@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Perninha', 'email' => 'perninha@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Bolinha', 'email' => 'bolinha@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Canhotinho', 'email' => 'canhotinho@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Torpedo', 'email' => 'torpedo@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Mãozinha', 'email' => 'maozinha@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Peixe', 'email' => 'peixe@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
            ['name' => 'Tanque', 'email' => 'tanque@semanal.com', 'password' => 'password', 'role' => UserRole::Player],
        ];

        $users = [];
        foreach ($jogadores as $jogador) {
            $users[] = User::create([
                'name' => $jogador['name'],
                'email' => $jogador['email'],
                'password' => $jogador['password'],
                'email_verified_at' => now(),
                'role' => $jogador['role'],
            ]);
        }

        $teamAzul = Team::where('name', 'Time Azul')->first();
        $teamBranco = Team::where('name', 'Time Branco')->first();

        // Resultados predefinidos para partidas passadas (mais realista)
        $partidasPassadas = [
            ['dias_atras' => 49, 'placar_a' => 4, 'placar_b' => 3],
            ['dias_atras' => 42, 'placar_a' => 2, 'placar_b' => 2],
            ['dias_atras' => 35, 'placar_a' => 5, 'placar_b' => 4],
            ['dias_atras' => 28, 'placar_a' => 3, 'placar_b' => 1],
            ['dias_atras' => 21, 'placar_a' => 2, 'placar_b' => 3],
            ['dias_atras' => 14, 'placar_a' => 4, 'placar_b' => 4],
            ['dias_atras' => 7, 'placar_a' => 3, 'placar_b' => 2],
        ];

        foreach ($partidasPassadas as $dados) {
            $match = FootballMatch::create([
                'scheduled_at' => now()->subDays($dados['dias_atras'])->setTime(19, 0),
                'played_at' => now()->subDays($dados['dias_atras'])->setTime(19, 0),
                'team_a_id' => $teamAzul->id,
                'team_b_id' => $teamBranco->id,
                'team_a_score' => $dados['placar_a'],
                'team_b_score' => $dados['placar_b'],
                'status' => 'completed',
                'max_players' => 14,
            ]);

            // Selecionar jogadores aleatórios para a partida
            $jogadoresPartida = collect($users)->shuffle()->take(14);
            $timeAJogadores = $jogadoresPartida->take(7);
            $timeBJogadores = $jogadoresPartida->slice(7, 7);

            // Distribuir gols do time A
            $golsRestantesA = $dados['placar_a'];
            foreach ($timeAJogadores as $index => $player) {
                $gols = 0;
                if ($golsRestantesA > 0) {
                    $gols = $index === 0 ? min(rand(1, 2), $golsRestantesA) : min(rand(0, 1), $golsRestantesA);
                    $golsRestantesA -= $gols;
                }
                MatchPlayer::create([
                    'football_match_id' => $match->id,
                    'user_id' => $player->id,
                    'team_id' => $teamAzul->id,
                    'goals' => $gols,
                    'assists' => rand(0, 1),
                ]);
            }

            // Distribuir gols do time B
            $golsRestantesB = $dados['placar_b'];
            foreach ($timeBJogadores as $index => $player) {
                $gols = 0;
                if ($golsRestantesB > 0) {
                    $gols = $index === 0 ? min(rand(1, 2), $golsRestantesB) : min(rand(0, 1), $golsRestantesB);
                    $golsRestantesB -= $gols;
                }
                MatchPlayer::create([
                    'football_match_id' => $match->id,
                    'user_id' => $player->id,
                    'team_id' => $teamBranco->id,
                    'goals' => $gols,
                    'assists' => rand(0, 1),
                ]);
            }
        }

        // Próxima partida agendada para sábado
        $proximoSabado = now()->next('Saturday')->setTime(16, 0);
        $proximaPartida = FootballMatch::create([
            'scheduled_at' => $proximoSabado,
            'team_a_id' => $teamAzul->id,
            'team_b_id' => $teamBranco->id,
            'status' => 'scheduled',
            'max_players' => 14,
        ]);

        // 12 jogadores confirmados
        $confirmados = collect($users)->shuffle()->take(12);
        foreach ($confirmados as $player) {
            MatchConfirmation::create([
                'football_match_id' => $proximaPartida->id,
                'user_id' => $player->id,
                'is_confirmed' => true,
                'confirmed_by' => 'player',
            ]);
        }

        // 3 na lista de espera
        $espera = collect($users)->diff($confirmados)->shuffle()->take(3);
        foreach ($espera as $player) {
            MatchConfirmation::create([
                'football_match_id' => $proximaPartida->id,
                'user_id' => $player->id,
                'is_confirmed' => false,
                'confirmed_by' => 'player',
            ]);
        }

        // Times já definidos para próxima partida
        $confirmadosArray = $confirmados->values();
        for ($i = 0; $i < 6; $i++) {
            MatchPlayer::create([
                'football_match_id' => $proximaPartida->id,
                'user_id' => $confirmadosArray[$i]->id,
                'team_id' => $teamAzul->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }
        for ($i = 6; $i < 12; $i++) {
            MatchPlayer::create([
                'football_match_id' => $proximaPartida->id,
                'user_id' => $confirmadosArray[$i]->id,
                'team_id' => $teamBranco->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('   SEMANAL DO PORÃ - Dados populados!');
        $this->command->info('========================================');
        $this->command->info('');
        $this->command->info('Usuário admin:');
        $this->command->info('  Email: basler.mauricio@gmail.com');
        $this->command->info('  Senha: ozzy123BASLER');
        $this->command->info('');
        $this->command->info('20 jogadores criados');
        $this->command->info('7 partidas finalizadas');
        $this->command->info('1 próxima partida agendada');
        $this->command->info('');
    }
}

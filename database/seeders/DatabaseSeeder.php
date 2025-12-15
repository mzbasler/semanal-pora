<?php

namespace Database\Seeders;

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
        // Criar times (cores definidas em Team::COLORS)
        Team::create(['name' => 'Time Azul']);
        Team::create(['name' => 'Time Branco']);

        // Jogadores do Semanal do Porã
        $jogadores = [
            // Presidente
            ['name' => 'Bruno Marcadella', 'email' => 'bruno.marcadella@pora.com.br', 'role' => UserRole::President],

            // Jogadores
            ['name' => 'Stefano Ferri', 'email' => 'stefano.ferri@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Bruno Campos', 'email' => 'bruno.campos@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Rafael Macedo', 'email' => 'rafael.macedo@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Mike Ricardo', 'email' => 'mike.ricardo@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Sacha Kilinski', 'email' => 'sacha.kilinski@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Victor Previdi', 'email' => 'victor.previdi@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Mauricio Basler', 'email' => 'mauricio.basler@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Felipe Menalda', 'email' => 'felipe.menalda@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Eduardo Menalda', 'email' => 'eduardo.menalda@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Guto Andre', 'email' => 'guto.andre@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Henrique Bisinella', 'email' => 'henrique.bisinella@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Bernardo', 'email' => 'bernardo@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Matheus Trigo', 'email' => 'matheus.trigo@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Andre Pinheiro', 'email' => 'andre.pinheiro@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Matheus Pinheiro', 'email' => 'matheus.pinheiro@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Matheus Ziegler', 'email' => 'matheus.ziegler@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Ricardo (Marca)', 'email' => 'ricardo.marca@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Mauricio Menegolla', 'email' => 'mauricio.menegolla@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Alessandro Bereta', 'email' => 'alessandro.bereta@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Guilherme Schneider', 'email' => 'guilherme.schneider@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Leo (Victor)', 'email' => 'leo.victor@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Guictor', 'email' => 'guictor@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Victor Birk', 'email' => 'victor.birk@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Victor Villarinho', 'email' => 'victor.villarinho@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Bruno Schneider', 'email' => 'bruno.schneider@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Armando (Dudu)', 'email' => 'armando.dudu@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Pedro Kunzler', 'email' => 'pedro.kunzler@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Antony (Aique)', 'email' => 'antony.aique@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Andrey (Campos)', 'email' => 'andrey.campos@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Tomaz Martins', 'email' => 'tomaz.martins@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Henrique (Aluguez)', 'email' => 'henrique.aluguez@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Alemao (Marca)', 'email' => 'alemao.marca@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Nicolas (Aluguez)', 'email' => 'nicolas.aluguez@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Luciano Degrazia', 'email' => 'luciano.degrazia@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Luciano Mastronardi', 'email' => 'luciano.mastronardi@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Rodrigo Degrazia', 'email' => 'rodrigo.degrazia@pora.com.br', 'role' => UserRole::Player],
            ['name' => 'Gustavo (Dudu)', 'email' => 'gustavo.dudu@pora.com.br', 'role' => UserRole::Player],
        ];

        foreach ($jogadores as $jogador) {
            User::create([
                'name' => $jogador['name'],
                'email' => $jogador['email'],
                'password' => 'clausura2026',
                'email_verified_at' => now(),
                'role' => $jogador['role'],
            ]);
        }

        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('   SEMANAL DO PORA - Dados populados!');
        $this->command->info('========================================');
        $this->command->info('');
        $this->command->info('Presidente:');
        $this->command->info('  Email: bruno.marcadella@pora.com.br');
        $this->command->info('  Senha: clausura2026');
        $this->command->info('');
        $this->command->info('38 jogadores criados');
        $this->command->info('2 times criados (Time Azul, Time Branco)');
        $this->command->info('');
    }
}

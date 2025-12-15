<?php

namespace App\Console\Commands;

use App\Models\User;
use App\UserRole;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreatePresident extends Command
{
    protected $signature = 'president:create';

    protected $description = 'Cria o usuario presidente do sistema';

    public function handle(): int
    {
        $existingPresident = User::where('role', UserRole::President)->first();

        if ($existingPresident) {
            $this->error('Ja existe um presidente cadastrado: ' . $existingPresident->email);
            return Command::FAILURE;
        }

        $name = $this->ask('Nome do presidente');
        $email = $this->ask('Email do presidente');
        $password = $this->secret('Senha do presidente');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return Command::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => UserRole::President,
            'email_verified_at' => now(),
        ]);

        $this->info('Presidente criado com sucesso!');
        $this->table(
            ['ID', 'Nome', 'Email'],
            [[$user->id, $user->name, $user->email]]
        );

        return Command::SUCCESS;
    }
}

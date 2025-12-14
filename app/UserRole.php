<?php

namespace App;

enum UserRole: string
{
    case Player = 'player';
    case President = 'president';
    case VicePresident = 'vice_president';

    public function label(): string
    {
        return match ($this) {
            self::Player => 'Jogador',
            self::President => 'Presidente',
            self::VicePresident => 'Vice-Presidente',
        };
    }

    public function isAdministrator(): bool
    {
        return in_array($this, [self::President, self::VicePresident]);
    }
}

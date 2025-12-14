<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    /** @use HasFactory<\Database\Factories\TeamFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'color',
    ];

    public function matchesAsTeamA(): HasMany
    {
        return $this->hasMany(FootballMatch::class, 'team_a_id');
    }

    public function matchesAsTeamB(): HasMany
    {
        return $this->hasMany(FootballMatch::class, 'team_b_id');
    }

    public function matchPlayers(): HasMany
    {
        return $this->hasMany(MatchPlayer::class);
    }
}

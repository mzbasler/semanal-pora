<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchPlayer extends Model
{
    /** @use HasFactory<\Database\Factories\MatchPlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'football_match_id',
        'user_id',
        'team_id',
        'goals',
        'assists',
    ];

    protected function casts(): array
    {
        return [
            'goals' => 'integer',
            'assists' => 'integer',
        ];
    }

    public function footballMatch(): BelongsTo
    {
        return $this->belongsTo(FootballMatch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FootballMatch extends Model
{
    /** @use HasFactory<\Database\Factories\FootballMatchFactory> */
    use HasFactory;

    protected $fillable = [
        'scheduled_at',
        'played_at',
        'team_a_id',
        'team_b_id',
        'team_a_score',
        'team_b_score',
        'status',
        'max_players',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'played_at' => 'datetime',
        ];
    }

    public function teamA(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function teamB(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(MatchConfirmation::class);
    }

    public function confirmedPlayers(): HasMany
    {
        return $this->confirmations()->where('status', 'confirmed');
    }

    public function players(): HasMany
    {
        return $this->hasMany(MatchPlayer::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isScheduled(): bool
    {
        return $this->status === 'scheduled';
    }

    public function availableSlots(): int
    {
        $confirmedCount = $this->confirmedPlayers()->count();

        return max(0, $this->max_players - $confirmedCount);
    }

    public function isFull(): bool
    {
        return $this->availableSlots() === 0;
    }

    public function waitingList(): HasMany
    {
        return $this->confirmations()
            ->where('status', 'waiting')
            ->orderBy('created_at');
    }
}

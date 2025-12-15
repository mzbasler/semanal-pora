<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchConfirmation extends Model
{
    /** @use HasFactory<\Database\Factories\MatchConfirmationFactory> */
    use HasFactory;

    protected $fillable = [
        'football_match_id',
        'user_id',
        'is_confirmed',
        'status',
        'confirmed_by',
    ];

    protected function casts(): array
    {
        return [
            'is_confirmed' => 'boolean',
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
}

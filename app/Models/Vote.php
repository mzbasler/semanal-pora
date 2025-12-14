<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    /** @use HasFactory<\Database\Factories\VoteFactory> */
    use HasFactory;

    protected $fillable = [
        'election_id',
        'voter_id',
        'president_candidate_id',
        'vice_president_candidate_id',
    ];

    public function election(): BelongsTo
    {
        return $this->belongsTo(Election::class);
    }

    public function voter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voter_id');
    }

    public function presidentCandidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'president_candidate_id');
    }

    public function vicePresidentCandidate(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vice_president_candidate_id');
    }
}

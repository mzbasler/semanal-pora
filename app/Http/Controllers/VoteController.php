<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoteController extends Controller
{
    public function create(Election $election): Response
    {
        if (! $election->isActive()) {
            abort(403, 'Esta eleição não está ativa.');
        }

        $existingVote = $election->votes()->where('voter_id', auth()->id())->exists();

        if ($existingVote) {
            abort(403, 'Você já votou nesta eleição.');
        }

        $candidates = User::query()
            ->where('id', '!=', auth()->id())
            ->get();

        return Inertia::render('votes/create', [
            'election' => $election,
            'candidates' => $candidates,
        ]);
    }

    public function store(Election $election, Request $request)
    {
        if (! $election->isActive()) {
            abort(403, 'Esta eleição não está ativa.');
        }

        $existingVote = $election->votes()->where('voter_id', auth()->id())->exists();

        if ($existingVote) {
            abort(403, 'Você já votou nesta eleição.');
        }

        $validated = $request->validate([
            'president_candidate_id' => ['required', 'exists:users,id', 'different:vice_president_candidate_id'],
            'vice_president_candidate_id' => ['required', 'exists:users,id'],
        ]);

        Vote::create([
            'election_id' => $election->id,
            'voter_id' => auth()->id(),
            'president_candidate_id' => $validated['president_candidate_id'],
            'vice_president_candidate_id' => $validated['vice_president_candidate_id'],
        ]);

        return redirect()->route('elections.show', $election)
            ->with('success', 'Voto registrado com sucesso!');
    }
}

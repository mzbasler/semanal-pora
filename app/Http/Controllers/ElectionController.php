<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ElectionController extends Controller
{
    public function index(): Response
    {
        $elections = Election::query()
            ->withCount('votes')
            ->latest('starts_at')
            ->paginate(10);

        return Inertia::render('elections/index', [
            'elections' => $elections,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Election::class);

        return Inertia::render('elections/create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Election::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date', 'after:now'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
        ]);

        $election = Election::create([
            ...$validated,
            'status' => 'scheduled',
        ]);

        return redirect()->route('elections.show', $election)
            ->with('success', 'Eleição criada com sucesso!');
    }

    public function show(Election $election): Response
    {
        $election->loadCount([
            'votes as president_votes' => fn ($q) => $q->whereNotNull('president_candidate_id'),
            'votes as vice_president_votes' => fn ($q) => $q->whereNotNull('vice_president_candidate_id'),
        ]);

        $userVote = $election->votes()
            ->where('voter_id', auth()->id())
            ->with(['presidentCandidate', 'vicePresidentCandidate'])
            ->first();

        return Inertia::render('elections/show', [
            'election' => $election,
            'userVote' => $userVote,
            'canVote' => $election->isActive() && ! $userVote,
        ]);
    }

    public function results(Election $election): Response
    {
        $this->authorize('view', $election);

        $presidentResults = $election->votes()
            ->selectRaw('president_candidate_id, COUNT(*) as vote_count')
            ->whereNotNull('president_candidate_id')
            ->groupBy('president_candidate_id')
            ->with('presidentCandidate')
            ->orderByDesc('vote_count')
            ->get();

        $vicePresidentResults = $election->votes()
            ->selectRaw('vice_president_candidate_id, COUNT(*) as vote_count')
            ->whereNotNull('vice_president_candidate_id')
            ->groupBy('vice_president_candidate_id')
            ->with('vicePresidentCandidate')
            ->orderByDesc('vote_count')
            ->get();

        return Inertia::render('elections/results', [
            'election' => $election,
            'presidentResults' => $presidentResults,
            'vicePresidentResults' => $vicePresidentResults,
        ]);
    }
}

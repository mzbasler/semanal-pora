<?php

namespace App\Http\Controllers;

use App\Models\FootballMatch;
use App\Services\MatchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(public MatchService $matchService) {}

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $nextMatch = FootballMatch::query()
            ->with(['teamA', 'teamB'])
            ->withCount([
                'confirmations as confirmed_count' => fn ($q) => $q->where('status', 'confirmed'),
            ])
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->orderBy('scheduled_at')
            ->first();

        $userConfirmation = null;
        if ($nextMatch) {
            $userConfirmation = $nextMatch->confirmations()
                ->where('user_id', $user->id)
                ->first();
        }

        $standings = $this->matchService->getPlayerStatistics();

        $lastMatch = FootballMatch::query()
            ->with(['teamA', 'teamB', 'players.user', 'players.team'])
            ->where('status', 'completed')
            ->orderBy('scheduled_at', 'desc')
            ->first();

        // Partida ao vivo (com escalação definida)
        $liveMatch = FootballMatch::query()
            ->with(['teamA', 'teamB', 'players.user', 'players.team'])
            ->where('status', 'scheduled')
            ->whereHas('players')
            ->orderBy('scheduled_at')
            ->first();

        return Inertia::render('dashboard', [
            'nextMatch' => $nextMatch,
            'userConfirmation' => $userConfirmation,
            'standings' => $standings,
            'lastMatch' => $lastMatch,
            'liveMatch' => $liveMatch,
        ]);
    }
}

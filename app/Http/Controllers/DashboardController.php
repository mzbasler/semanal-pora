<?php

namespace App\Http\Controllers;

use App\Models\FootballMatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $nextMatch = FootballMatch::query()
            ->with(['teamA', 'teamB'])
            ->withCount([
                'confirmations as confirmed_count' => fn ($q) => $q->where('is_confirmed', true),
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

        return Inertia::render('dashboard', [
            'nextMatch' => $nextMatch,
            'userConfirmation' => $userConfirmation,
        ]);
    }
}

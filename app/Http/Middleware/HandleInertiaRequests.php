<?php

namespace App\Http\Middleware;

use App\Models\FootballMatch;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'badges' => fn () => $this->getBadgeData($request),
            'pendingMatch' => fn () => $this->getPendingMatch($request),
        ];
    }

    /**
     * @return array{matches: int}
     */
    private function getBadgeData(Request $request): array
    {
        try {
            $user = $request->user();

            if (! $user) {
                return ['matches' => 0];
            }

            $pendingMatchesCount = FootballMatch::query()
                ->where('status', 'scheduled')
                ->where('scheduled_at', '>=', now())
                ->whereDoesntHave('confirmations', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->count();

            return [
                'matches' => $pendingMatchesCount,
            ];
        } catch (\Exception $e) {
            return ['matches' => 0];
        }
    }

    private function getPendingMatch(Request $request): ?array
    {
        try {
            $user = $request->user();

            if (! $user) {
                return null;
            }

            $match = FootballMatch::query()
                ->with(['teamA', 'teamB'])
                ->withCount(['confirmations as confirmed_count' => function ($query) {
                    $query->where('status', 'confirmed');
                }])
                ->where('status', 'scheduled')
                ->where('scheduled_at', '>=', now())
                ->orderBy('scheduled_at')
                ->first();

            if (! $match) {
                return null;
            }

            $userConfirmation = $match->confirmations()
                ->where('user_id', $user->id)
                ->first();

            return [
                'match' => [
                    'id' => $match->id,
                    'scheduled_at' => $match->scheduled_at,
                    'max_players' => $match->max_players,
                    'confirmed_count' => $match->confirmed_count,
                    'team_a' => $match->teamA,
                    'team_b' => $match->teamB,
                ],
                'userConfirmation' => $userConfirmation,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }
}

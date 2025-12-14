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
        ];
    }

    /**
     * @return array{matches: int}
     */
    private function getBadgeData(Request $request): array
    {
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
    }
}

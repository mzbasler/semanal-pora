<?php

namespace App\Http\Controllers;

use App\Services\MatchService;
use Inertia\Inertia;
use Inertia\Response;

class StandingsController extends Controller
{
    public function __construct(public MatchService $matchService) {}

    public function index(): Response
    {
        $standings = $this->matchService->getPlayerStatistics();

        return Inertia::render('standings/index', [
            'standings' => $standings,
        ]);
    }
}

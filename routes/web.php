<?php

use App\Services\MatchService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (MatchService $matchService) {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'standings' => $matchService->getPlayerStatistics(),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', \App\Http\Controllers\DashboardController::class)->name('dashboard');

    // Standings / Leaderboard
    Route::get('standings', [\App\Http\Controllers\StandingsController::class, 'index'])->name('standings.index');

    // Matches
    Route::get('matches', [\App\Http\Controllers\FootballMatchController::class, 'index'])->name('matches.index');
    Route::get('matches/create', [\App\Http\Controllers\FootballMatchController::class, 'create'])->name('matches.create');
    Route::post('matches', [\App\Http\Controllers\FootballMatchController::class, 'store'])->name('matches.store');
    Route::post('matches/{match}/confirm', [\App\Http\Controllers\FootballMatchController::class, 'confirm'])->name('matches.confirm');
    Route::post('matches/{match}/toggle-confirmation', [\App\Http\Controllers\FootballMatchController::class, 'togglePlayerConfirmation'])->name('matches.toggle-confirmation');
    Route::get('matches/{match}/assign-teams', [\App\Http\Controllers\FootballMatchController::class, 'assignTeamsPage'])->name('matches.assign-teams');
    Route::post('matches/{match}/assign-teams', [\App\Http\Controllers\FootballMatchController::class, 'assignTeams'])->name('matches.assign-teams.store');
    Route::post('matches/{match}/update-stats', [\App\Http\Controllers\FootballMatchController::class, 'updateStats'])->name('matches.update-stats');
    Route::delete('matches/{match}', [\App\Http\Controllers\FootballMatchController::class, 'destroy'])->name('matches.destroy');

    // Players (admin only)
    Route::middleware(['admin'])->group(function () {
        Route::get('players', [\App\Http\Controllers\PlayerController::class, 'index'])->name('players.index');
        Route::get('players/create', [\App\Http\Controllers\PlayerController::class, 'create'])->name('players.create');
        Route::post('players', [\App\Http\Controllers\PlayerController::class, 'store'])->name('players.store');
        Route::get('players/{player}/edit', [\App\Http\Controllers\PlayerController::class, 'edit'])->name('players.edit');
        Route::put('players/{player}', [\App\Http\Controllers\PlayerController::class, 'update'])->name('players.update');
        Route::delete('players/{player}', [\App\Http\Controllers\PlayerController::class, 'destroy'])->name('players.destroy');
    });
});

require __DIR__.'/settings.php';

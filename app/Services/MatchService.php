<?php

namespace App\Services;

use App\Models\FootballMatch;
use App\Models\MatchPlayer;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Collection;

class MatchService
{
    public function drawTeams(FootballMatch $match): array
    {
        $confirmedPlayers = $match->confirmations()
            ->where('status', 'confirmed')
            ->with('user')
            ->get()
            ->pluck('user');

        if ($confirmedPlayers->count() < 2) {
            throw new \Exception('Não há jogadores confirmados suficientes para sortear os times.');
        }

        $shuffled = $confirmedPlayers->shuffle();
        $half = (int) ceil($shuffled->count() / 2);

        $teamA = Team::where('name', 'Time Azul')->first();
        $teamB = Team::where('name', 'Time Branco')->first();

        $teamAPlayers = $shuffled->take($half);
        $teamBPlayers = $shuffled->slice($half);

        return [
            'team_a' => [
                'team' => $teamA,
                'players' => $teamAPlayers,
            ],
            'team_b' => [
                'team' => $teamB,
                'players' => $teamBPlayers,
            ],
        ];
    }

    public function assignPlayersToMatch(FootballMatch $match, array $teams): void
    {
        foreach ($teams['team_a']['players'] as $player) {
            MatchPlayer::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'team_id' => $teams['team_a']['team']->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        foreach ($teams['team_b']['players'] as $player) {
            MatchPlayer::create([
                'football_match_id' => $match->id,
                'user_id' => $player->id,
                'team_id' => $teams['team_b']['team']->id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        $match->update([
            'team_a_id' => $teams['team_a']['team']->id,
            'team_b_id' => $teams['team_b']['team']->id,
        ]);
    }

    public function getPlayerStatistics(): Collection
    {
        $users = User::all();

        return $users->map(function ($user) {
            $wins = 0;
            $draws = 0;
            $losses = 0;
            $goalsFor = 0;
            $goalsAgainst = 0;
            $totalGoals = 0;
            $totalAssists = 0;

            $playerMatches = MatchPlayer::where('user_id', $user->id)
                ->with(['footballMatch', 'team'])
                ->get();

            foreach ($playerMatches as $matchPlayer) {
                $match = $matchPlayer->footballMatch;

                $totalGoals += $matchPlayer->goals;
                $totalAssists += $matchPlayer->assists;

                if ($match->status !== 'completed') {
                    continue;
                }

                $playerTeamId = $matchPlayer->team_id;
                $isTeamA = $match->team_a_id === $playerTeamId;

                $teamScore = $isTeamA ? $match->team_a_score : $match->team_b_score;
                $opponentScore = $isTeamA ? $match->team_b_score : $match->team_a_score;

                $goalsFor += $teamScore;
                $goalsAgainst += $opponentScore;

                if ($teamScore > $opponentScore) {
                    $wins++;
                } elseif ($teamScore === $opponentScore) {
                    $draws++;
                } else {
                    $losses++;
                }
            }

            $totalPoints = ($wins * 3) + $draws;
            $completedMatches = $wins + $draws + $losses;
            $aproveitamento = $completedMatches > 0 ? ($totalPoints / ($completedMatches * 3)) * 100 : 0;

            return [
                'user_id' => $user->id,
                'user' => $user,
                'matches_played' => $completedMatches,
                'wins' => $wins,
                'draws' => $draws,
                'losses' => $losses,
                'goals_for' => $goalsFor,
                'goals_against' => $goalsAgainst,
                'goal_difference' => $goalsFor - $goalsAgainst,
                'total_goals' => $totalGoals,
                'total_assists' => $totalAssists,
                'points' => $totalPoints,
                'aproveitamento' => round($aproveitamento, 1),
            ];
        })->sortByDesc('points')
            ->sortByDesc('wins')
            ->sortByDesc('goal_difference')
            ->values();
    }
}

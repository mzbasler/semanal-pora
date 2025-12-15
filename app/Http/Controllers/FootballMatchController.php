<?php

namespace App\Http\Controllers;

use App\Models\FootballMatch;
use App\Models\MatchConfirmation;
use App\Models\Team;
use App\Services\MatchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FootballMatchController extends Controller
{
    public function __construct(public MatchService $matchService) {}

    public function index(): Response
    {
        // Próxima partida agendada (com ou sem escalação)
        $nextMatch = FootballMatch::query()
            ->with([
                'teamA',
                'teamB',
                'confirmations' => function ($query) {
                    $query->where('status', 'confirmed');
                },
                'confirmations.user',
                'players.user',
                'players.team',
            ])
            ->where('status', 'scheduled')
            ->orderBy('scheduled_at')
            ->first();

        // Partidas finalizadas
        $completedMatches = FootballMatch::query()
            ->with(['teamA', 'teamB'])
            ->where('status', 'completed')
            ->latest('scheduled_at')
            ->paginate(12);

        return Inertia::render('matches/index', [
            'nextMatch' => $nextMatch,
            'matches' => $completedMatches,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', FootballMatch::class);

        $teams = Team::all();

        return Inertia::render('matches/create', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', FootballMatch::class);

        $validated = $request->validate([
            'scheduled_at' => ['required', 'date', 'after:now'],
            'max_players' => ['nullable', 'integer', 'min:2', 'max:100'],
        ]);

        $teams = Team::all();

        $match = FootballMatch::create([
            'scheduled_at' => $validated['scheduled_at'],
            'max_players' => $validated['max_players'] ?? 20,
            'team_a_id' => $teams->first()->id,
            'team_b_id' => $teams->last()->id,
            'status' => 'scheduled',
        ]);

        return redirect()->route('matches.index')
            ->with('success', 'Partida criada com sucesso!');
    }

    public function confirm(FootballMatch $match, Request $request)
    {
        $confirmed = $request->boolean('confirmed');

        // Verifica se já existe confirmação
        $existing = MatchConfirmation::where('football_match_id', $match->id)
            ->where('user_id', auth()->id())
            ->first();

        if ($confirmed) {
            if ($existing && $existing->status !== 'declined') {
                return redirect()->back()->with('info', 'Você já confirmou presença nesta partida!');
            }

            // Conta jogadores confirmados
            $confirmedCount = $match->confirmedPlayers()->count();

            // Determina se o jogador entra direto ou vai para lista de espera
            $isConfirmed = $confirmedCount < $match->max_players;
            $status = $isConfirmed ? 'confirmed' : 'waiting';

            if ($existing) {
                $existing->update([
                    'is_confirmed' => $isConfirmed,
                    'status' => $status,
                    'confirmed_by' => 'player',
                ]);
            } else {
                MatchConfirmation::create([
                    'football_match_id' => $match->id,
                    'user_id' => auth()->id(),
                    'is_confirmed' => $isConfirmed,
                    'status' => $status,
                    'confirmed_by' => 'player',
                ]);
            }

            if ($isConfirmed) {
                return redirect()->back()->with('success', 'Presença confirmada!');
            } else {
                return redirect()->back()->with('info', 'Você entrou na lista de espera.');
            }
        } else {
            // Usuário disse que não vai
            if ($existing) {
                $wasConfirmed = $existing->is_confirmed;
                $existing->update([
                    'is_confirmed' => false,
                    'status' => 'declined',
                ]);

                // Se estava confirmado, promove o primeiro da lista de espera
                if ($wasConfirmed) {
                    $nextInLine = $match->waitingList()->first();
                    if ($nextInLine) {
                        $nextInLine->update([
                            'is_confirmed' => true,
                            'status' => 'confirmed',
                        ]);
                    }
                }
            } else {
                MatchConfirmation::create([
                    'football_match_id' => $match->id,
                    'user_id' => auth()->id(),
                    'is_confirmed' => false,
                    'status' => 'declined',
                    'confirmed_by' => 'player',
                ]);
            }

            return redirect()->back()->with('success', 'Tudo bem, fica pra próxima!');
        }
    }

    public function togglePlayerConfirmation(FootballMatch $match, Request $request)
    {
        $this->authorize('update', $match);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'confirmed' => ['required', 'boolean'],
        ]);

        if ($validated['confirmed']) {
            // Verifica se já existe confirmação
            $existing = MatchConfirmation::where('football_match_id', $match->id)
                ->where('user_id', $validated['user_id'])
                ->first();

            if ($existing) {
                // Se já existe mas está na lista de espera ou declinado, promove para confirmado
                if ($existing->status !== 'confirmed') {
                    $existing->update([
                        'is_confirmed' => true,
                        'status' => 'confirmed',
                        'confirmed_by' => 'admin',
                    ]);
                }
            } else {
                // Presidente pode adicionar jogador diretamente (ignora limite)
                MatchConfirmation::create([
                    'football_match_id' => $match->id,
                    'user_id' => $validated['user_id'],
                    'is_confirmed' => true,
                    'status' => 'confirmed',
                    'confirmed_by' => 'admin',
                ]);
            }
        } else {
            // Remove confirmação e move próximo da lista de espera
            $confirmation = MatchConfirmation::where('football_match_id', $match->id)
                ->where('user_id', $validated['user_id'])
                ->first();

            if ($confirmation) {
                $wasConfirmed = $confirmation->status === 'confirmed';
                $confirmation->delete();

                // Se estava confirmado, promove o primeiro da lista de espera
                if ($wasConfirmed) {
                    $nextInLine = $match->waitingList()->first();
                    if ($nextInLine) {
                        $nextInLine->update([
                            'is_confirmed' => true,
                            'status' => 'confirmed',
                        ]);
                    }
                }
            }
        }

        return redirect()->back();
    }

    public function assignTeamsPage(FootballMatch $match): Response
    {
        $this->authorize('update', $match);

        if ($match->players()->count() > 0) {
            return redirect()->route('matches.index');
        }

        // Buscar TODOS os usuários que podem jogar (jogadores, presidente, vice)
        $allPlayers = \App\Models\User::whereIn('role', ['player', 'president', 'vice_president'])->get();

        // Buscar confirmações existentes
        $confirmations = $match->confirmations()
            ->with('user')
            ->get()
            ->keyBy('user_id');

        // Jogadores confirmados (para formação de times)
        $confirmedPlayers = $match->confirmations()
            ->where('status', 'confirmed')
            ->with('user')
            ->get();

        return Inertia::render('matches/assign-teams', [
            'match' => $match->load(['teamA', 'teamB']),
            'allPlayers' => $allPlayers,
            'confirmations' => $confirmations->values(),
            'confirmedPlayers' => $confirmedPlayers,
        ]);
    }

    public function assignTeams(FootballMatch $match, Request $request)
    {
        $this->authorize('update', $match);

        if ($match->players()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Os times já foram montados para esta partida.']);
        }

        $validated = $request->validate([
            'team_a_players' => ['required', 'array', 'min:7'],
            'team_a_players.*' => ['required', 'exists:users,id'],
            'team_b_players' => ['required', 'array', 'min:7'],
            'team_b_players.*' => ['required', 'exists:users,id'],
        ]);

        // Criar registros na tabela match_players para Time A
        foreach ($validated['team_a_players'] as $userId) {
            $match->players()->create([
                'user_id' => $userId,
                'team_id' => $match->team_a_id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        // Criar registros na tabela match_players para Time B
        foreach ($validated['team_b_players'] as $userId) {
            $match->players()->create([
                'user_id' => $userId,
                'team_id' => $match->team_b_id,
                'goals' => 0,
                'assists' => 0,
            ]);
        }

        return redirect()->route('matches.index')
            ->with('success', 'Times montados com sucesso!');
    }

    public function updateStats(FootballMatch $match, Request $request)
    {
        $this->authorize('update', $match);

        $validated = $request->validate([
            'players' => ['required', 'array'],
            'players.*.id' => ['required', 'exists:match_players,id'],
            'players.*.goals' => ['required', 'integer', 'min:0'],
            'players.*.assists' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['players'] as $playerData) {
            $match->players()->where('id', $playerData['id'])->update([
                'goals' => $playerData['goals'],
                'assists' => $playerData['assists'],
            ]);
        }

        $teamAScore = $match->players()->where('team_id', $match->team_a_id)->sum('goals');
        $teamBScore = $match->players()->where('team_id', $match->team_b_id)->sum('goals');

        $match->update([
            'team_a_score' => $teamAScore,
            'team_b_score' => $teamBScore,
            'status' => 'completed',
            'played_at' => now(),
        ]);

        return redirect()->route('matches.index')
            ->with('success', 'Estatísticas atualizadas com sucesso!');
    }
}

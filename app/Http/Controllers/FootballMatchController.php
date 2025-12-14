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
                    $query->where('is_confirmed', true);
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

    public function teamFormation(): Response
    {
        $this->authorize('viewAny', FootballMatch::class);

        // Partidas agendadas que ainda não têm times formados
        $matches = FootballMatch::query()
            ->with(['teamA', 'teamB'])
            ->withCount([
                'confirmations' => function ($query) {
                    $query->where('is_confirmed', true);
                }
            ])
            ->where('status', 'scheduled')
            ->whereDoesntHave('players')
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('matches/team-formation', [
            'matches' => $matches,
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

        return redirect()->route('matches.show', $match)
            ->with('success', 'Partida criada com sucesso!');
    }

    public function show(FootballMatch $match): Response
    {
        $match->load(['teamA', 'teamB', 'confirmations.user', 'players.user', 'players.team']);

        $userConfirmation = $match->confirmations()
            ->where('user_id', auth()->id())
            ->first();

        // Jogadores confirmados (ordem de chegada)
        $confirmedPlayers = $match->confirmations()
            ->where('is_confirmed', true)
            ->with('user')
            ->orderBy('created_at')
            ->get();

        // Lista de espera (ordem de chegada)
        $waitingList = $match->waitingList()
            ->with('user')
            ->get();

        return Inertia::render('matches/show', [
            'match' => $match,
            'userConfirmation' => $userConfirmation,
            'confirmedPlayers' => $confirmedPlayers,
            'waitingList' => $waitingList,
            'availableSlots' => $match->availableSlots(),
            'isFull' => $match->isFull(),
        ]);
    }

    public function confirm(FootballMatch $match, Request $request)
    {
        $confirmed = $request->boolean('confirmed');

        if ($confirmed) {
            // Verifica se já existe confirmação
            $existing = MatchConfirmation::where('football_match_id', $match->id)
                ->where('user_id', auth()->id())
                ->first();

            if ($existing) {
                return redirect()->back()->with('info', 'Você já confirmou presença nesta partida!');
            }

            // Conta jogadores confirmados
            $confirmedCount = $match->confirmedPlayers()->count();

            // Determina se o jogador entra direto ou vai para lista de espera
            $isConfirmed = $confirmedCount < $match->max_players;

            MatchConfirmation::create([
                'football_match_id' => $match->id,
                'user_id' => auth()->id(),
                'is_confirmed' => $isConfirmed,
                'confirmed_by' => 'player',
            ]);

            if ($isConfirmed) {
                return redirect()->back()->with('success', 'Presença confirmada! Você está dentro da partida.');
            } else {
                return redirect()->back()->with('info', 'Partida lotada! Você entrou na lista de espera.');
            }
        } else {
            // Remove confirmação e move próximo da lista de espera
            $confirmation = MatchConfirmation::where('football_match_id', $match->id)
                ->where('user_id', auth()->id())
                ->first();

            if ($confirmation) {
                $wasConfirmed = $confirmation->is_confirmed;
                $confirmation->delete();

                // Se estava confirmado, promove o primeiro da lista de espera
                if ($wasConfirmed) {
                    $nextInLine = $match->waitingList()->first();
                    if ($nextInLine) {
                        $nextInLine->update(['is_confirmed' => true]);
                    }
                }
            }

            return redirect()->back()->with('success', 'Presença removida!');
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
                // Se já existe mas está na lista de espera, promove para confirmado
                if (! $existing->is_confirmed) {
                    $existing->update([
                        'is_confirmed' => true,
                        'confirmed_by' => 'admin',
                    ]);
                }
            } else {
                // Presidente pode adicionar jogador diretamente (ignora limite)
                MatchConfirmation::create([
                    'football_match_id' => $match->id,
                    'user_id' => $validated['user_id'],
                    'is_confirmed' => true,
                    'confirmed_by' => 'admin',
                ]);
            }
        } else {
            // Remove confirmação e move próximo da lista de espera
            $confirmation = MatchConfirmation::where('football_match_id', $match->id)
                ->where('user_id', $validated['user_id'])
                ->first();

            if ($confirmation) {
                $wasConfirmed = $confirmation->is_confirmed;
                $confirmation->delete();

                // Se estava confirmado, promove o primeiro da lista de espera
                if ($wasConfirmed) {
                    $nextInLine = $match->waitingList()->first();
                    if ($nextInLine) {
                        $nextInLine->update(['is_confirmed' => true]);
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
            return redirect()->route('matches.lineup', $match);
        }

        // Buscar TODOS os jogadores
        $allPlayers = \App\Models\User::where('role', 'player')->get();

        // Buscar confirmações existentes
        $confirmations = $match->confirmations()
            ->with('user')
            ->get()
            ->keyBy('user_id');

        // Jogadores confirmados (para formação de times)
        $confirmedPlayers = $match->confirmations()
            ->where('is_confirmed', true)
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
            'team_a_players' => ['required', 'array', 'min:1'],
            'team_a_players.*' => ['required', 'exists:users,id'],
            'team_b_players' => ['required', 'array', 'min:1'],
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

        return redirect()->route('matches.lineup', $match)
            ->with('success', 'Times montados com sucesso!');
    }

    public function lineup(FootballMatch $match): Response
    {
        $match->load(['teamA', 'teamB', 'players.user', 'players.team']);

        $teamAPlayers = $match->players()->where('team_id', $match->team_a_id)->with('user')->get();
        $teamBPlayers = $match->players()->where('team_id', $match->team_b_id)->with('user')->get();

        return Inertia::render('matches/lineup', [
            'match' => $match,
            'teamAPlayers' => $teamAPlayers,
            'teamBPlayers' => $teamBPlayers,
        ]);
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

        return redirect()->route('matches.show', $match)
            ->with('success', 'Estatísticas atualizadas com sucesso!');
    }
}

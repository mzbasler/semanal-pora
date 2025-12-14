<?php

use App\Models\FootballMatch;
use App\Models\MatchConfirmation;
use App\Models\Team;
use App\Models\User;

beforeEach(function () {
    $this->teamA = Team::factory()->create();
    $this->teamB = Team::factory()->create();
});

test('player can confirm presence in match', function () {
    $player = User::factory()->create(['role' => 'player']);
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 20,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    $this->actingAs($player)
        ->post(route('matches.confirm', $match), ['confirmed' => true])
        ->assertRedirect();

    $this->assertDatabaseHas('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player->id,
        'is_confirmed' => true,
        'confirmed_by' => 'player',
    ]);
});

test('player goes to waiting list when match is full', function () {
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 2,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    // Preencher as 2 vagas
    $player1 = User::factory()->create(['role' => 'player']);
    $player2 = User::factory()->create(['role' => 'player']);

    $this->actingAs($player1)
        ->post(route('matches.confirm', $match), ['confirmed' => true]);

    $this->actingAs($player2)
        ->post(route('matches.confirm', $match), ['confirmed' => true]);

    // Terceiro jogador vai para lista de espera
    $player3 = User::factory()->create(['role' => 'player']);

    $this->actingAs($player3)
        ->post(route('matches.confirm', $match), ['confirmed' => true])
        ->assertRedirect();

    $this->assertDatabaseHas('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player3->id,
        'is_confirmed' => false,
    ]);
});

test('player from waiting list is promoted when someone cancels', function () {
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 2,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    $player1 = User::factory()->create(['role' => 'player']);
    $player2 = User::factory()->create(['role' => 'player']);
    $player3 = User::factory()->create(['role' => 'player']);

    // Confirmar 2 jogadores (limite)
    $this->actingAs($player1)->post(route('matches.confirm', $match), ['confirmed' => true]);
    $this->actingAs($player2)->post(route('matches.confirm', $match), ['confirmed' => true]);

    // Terceiro vai para espera
    $this->actingAs($player3)->post(route('matches.confirm', $match), ['confirmed' => true]);

    // Player1 cancela
    $this->actingAs($player1)->post(route('matches.confirm', $match), ['confirmed' => false]);

    // Player3 deve ser promovido
    $this->assertDatabaseHas('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player3->id,
        'is_confirmed' => true,
    ]);

    // Player1 não deve estar mais na lista
    $this->assertDatabaseMissing('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player1->id,
    ]);
});

test('president can manually confirm player ignoring limit', function () {
    $president = User::factory()->create(['role' => 'president']);
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 2,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    // Preencher as 2 vagas
    $player1 = User::factory()->create(['role' => 'player']);
    $player2 = User::factory()->create(['role' => 'player']);

    $this->actingAs($player1)->post(route('matches.confirm', $match), ['confirmed' => true]);
    $this->actingAs($player2)->post(route('matches.confirm', $match), ['confirmed' => true]);

    // Presidente adiciona um terceiro jogador (deve ignorar o limite)
    $player3 = User::factory()->create(['role' => 'player']);

    $this->actingAs($president)
        ->post(route('matches.toggle-confirmation', $match), [
            'user_id' => $player3->id,
            'confirmed' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player3->id,
        'is_confirmed' => true,
        'confirmed_by' => 'admin',
    ]);

    // Deve haver 3 jogadores confirmados
    expect($match->fresh()->confirmedPlayers()->count())->toBe(3);
});

test('vice president has same permissions as president', function () {
    $vicePresident = User::factory()->create(['role' => 'vice_president']);
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 20,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    $player = User::factory()->create(['role' => 'player']);

    $this->actingAs($vicePresident)
        ->post(route('matches.toggle-confirmation', $match), [
            'user_id' => $player->id,
            'confirmed' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('match_confirmations', [
        'football_match_id' => $match->id,
        'user_id' => $player->id,
        'is_confirmed' => true,
        'confirmed_by' => 'admin',
    ]);
});

test('player cannot confirm twice for same match', function () {
    $player = User::factory()->create(['role' => 'player']);
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 20,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    // Primeira confirmação
    $this->actingAs($player)
        ->post(route('matches.confirm', $match), ['confirmed' => true]);

    // Segunda tentativa
    $this->actingAs($player)
        ->post(route('matches.confirm', $match), ['confirmed' => true])
        ->assertRedirect();

    // Deve haver apenas 1 confirmação
    expect(MatchConfirmation::where('football_match_id', $match->id)
        ->where('user_id', $player->id)
        ->count())->toBe(1);
});

test('match available slots calculates correctly', function () {
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 5,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    expect($match->availableSlots())->toBe(5);

    // Adicionar 2 jogadores confirmados
    MatchConfirmation::factory()->count(2)->create([
        'football_match_id' => $match->id,
        'is_confirmed' => true,
    ]);

    expect($match->fresh()->availableSlots())->toBe(3);

    // Adicionar 3 na lista de espera (não devem contar)
    MatchConfirmation::factory()->count(3)->create([
        'football_match_id' => $match->id,
        'is_confirmed' => false,
    ]);

    expect($match->fresh()->availableSlots())->toBe(3);
});

test('match is full when confirmed players equals max players', function () {
    $match = FootballMatch::factory()->create([
        'scheduled_at' => now()->addDay(),
        'status' => 'scheduled',
        'max_players' => 2,
        'team_a_id' => $this->teamA->id,
        'team_b_id' => $this->teamB->id,
    ]);

    expect($match->isFull())->toBeFalse();

    MatchConfirmation::factory()->count(2)->create([
        'football_match_id' => $match->id,
        'is_confirmed' => true,
    ]);

    expect($match->fresh()->isFull())->toBeTrue();
});

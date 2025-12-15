<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class PlayerController extends Controller
{
    public function index()
    {
        $players = User::where('role', UserRole::Player)
            ->orderBy('name')
            ->get();

        return Inertia::render('players/index', [
            'players' => $players,
        ]);
    }

    public function create()
    {
        return Inertia::render('players/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::Player,
            'email_verified_at' => now(),
        ]);

        return redirect()->route('players.index')
            ->with('success', 'Jogador cadastrado com sucesso!');
    }

    public function edit(User $player)
    {
        return Inertia::render('players/edit', [
            'player' => $player,
        ]);
    }

    public function update(Request $request, User $player)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $player->id],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $player->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $player->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return redirect()->route('players.index')
            ->with('success', 'Jogador atualizado com sucesso!');
    }

    public function destroy(User $player)
    {
        $player->delete();

        return redirect()->route('players.index')
            ->with('success', 'Jogador removido com sucesso!');
    }
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Team {
    id: number;
    name: string;
    color: string;
}

interface User {
    id: number;
    name: string;
}

interface MatchPlayer {
    id: number;
    user: User;
    team: Team;
    goals: number;
    assists: number;
}

interface Match {
    id: number;
    status: string;
    team_a: Team;
    team_b: Team;
    team_a_score: number | null;
    team_b_score: number | null;
}

interface Props {
    match: Match;
    teamAPlayers: MatchPlayer[];
    teamBPlayers: MatchPlayer[];
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
    { title: 'Escalação', href: '#' },
];

export default function MatchLineup({ match, teamAPlayers, teamBPlayers, auth }: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';
    const [stats, setStats] = useState<Record<number, { goals: number; assists: number }>>(
        [...teamAPlayers, ...teamBPlayers].reduce(
            (acc, player) => ({
                ...acc,
                [player.id]: { goals: player.goals, assists: player.assists },
            }),
            {},
        ),
    );

    const { post, processing } = useForm();

    const handleStatChange = (playerId: number, field: 'goals' | 'assists', value: number) => {
        setStats((prev) => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [field]: Math.max(0, value),
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const players = Object.entries(stats).map(([id, data]) => ({
            id: parseInt(id),
            ...data,
        }));

        post(`/matches/${match.id}/update-stats`, {
            data: { players },
        });
    };

    const renderPlayerCard = (player: MatchPlayer) => (
        <div key={player.id} className="rounded-lg border p-4">
            <div className="font-semibold">{player.user.name}</div>
            {isAdmin && match.status === 'scheduled' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor={`goals-${player.id}`} className="text-xs">
                            Gols
                        </Label>
                        <Input
                            id={`goals-${player.id}`}
                            type="number"
                            min="0"
                            value={stats[player.id]?.goals ?? 0}
                            onChange={(e) => handleStatChange(player.id, 'goals', parseInt(e.target.value) || 0)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor={`assists-${player.id}`} className="text-xs">
                            Assistências
                        </Label>
                        <Input
                            id={`assists-${player.id}`}
                            type="number"
                            min="0"
                            value={stats[player.id]?.assists ?? 0}
                            onChange={(e) => handleStatChange(player.id, 'assists', parseInt(e.target.value) || 0)}
                            className="mt-1"
                        />
                    </div>
                </div>
            )}
            {match.status === 'completed' && (
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                    <span>{player.goals} gols</span>
                    <span>{player.assists} assistências</span>
                </div>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Escalação" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Escalação</h1>
                    <p className="text-muted-foreground">
                        {match.status === 'completed' ? 'Resultado final' : 'Times sorteados'}
                    </p>
                </div>

                {match.status === 'completed' && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-6 text-4xl font-bold">
                                <span style={{ color: match.team_a.color }}>{match.team_a_score}</span>
                                <span className="text-muted-foreground">-</span>
                                <span style={{ color: match.team_b.color }}>{match.team_b_score}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: match.team_a.color }} className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: match.team_a.color }} />
                                {match.team_a.name}
                                <span className="ml-auto text-sm font-normal text-muted-foreground">
                                    {teamAPlayers.length} jogadores
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">{teamAPlayers.map(renderPlayerCard)}</CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle style={{ color: match.team_b.color }} className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: match.team_b.color }} />
                                {match.team_b.name}
                                <span className="ml-auto text-sm font-normal text-muted-foreground">
                                    {teamBPlayers.length} jogadores
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">{teamBPlayers.map(renderPlayerCard)}</CardContent>
                    </Card>

                    {isAdmin && match.status === 'scheduled' && (
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={processing} className="w-full" size="lg">
                                Finalizar Partida e Salvar Estatísticas
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

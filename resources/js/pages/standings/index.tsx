import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trophy, Target, Users, TrendingUp } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface PlayerStats {
    user_id: number;
    user: User;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    total_goals: number;
    total_assists: number;
    points: number;
    aproveitamento: number;
}

interface Props {
    standings: PlayerStats[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Classificação', href: '/standings' },
];

export default function StandingsIndex({ standings }: Props) {
    const getMedalColor = (position: number) => {
        if (position === 1) return 'text-yellow-500';
        if (position === 2) return 'text-gray-400';
        if (position === 3) return 'text-amber-600';
        return 'text-muted-foreground';
    };

    const topScorer = standings.length > 0 ? [...standings].sort((a, b) => b.total_goals - a.total_goals)[0] : null;
    const topAssister = standings.length > 0 ? [...standings].sort((a, b) => b.total_assists - a.total_assists)[0] : null;
    const bestPerformance =
        standings.length > 0 ? [...standings].sort((a, b) => b.aproveitamento - a.aproveitamento)[0] : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classificação" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Classificação Geral</h1>
                    <p className="text-muted-foreground">Ranking completo dos jogadores</p>
                </div>

                {standings.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Líder</CardTitle>
                                <Trophy className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{standings[0]?.user.name}</div>
                                <p className="text-xs text-muted-foreground">{standings[0]?.points} pontos</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Artilheiro</CardTitle>
                                <Target className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{topScorer?.user.name}</div>
                                <p className="text-xs text-muted-foreground">{topScorer?.total_goals} gols</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Assistências</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{topAssister?.user.name}</div>
                                <p className="text-xs text-muted-foreground">{topAssister?.total_assists} assistências</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Aproveitamento</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{bestPerformance?.user.name}</div>
                                <p className="text-xs text-muted-foreground">{bestPerformance?.aproveitamento}%</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Tabela de Classificação</CardTitle>
                        <CardDescription>Ordenado por pontos, vitórias e saldo de gols</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {standings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-3 text-left font-semibold">#</th>
                                            <th className="p-3 text-left font-semibold">Jogador</th>
                                            <th className="p-3 text-center font-semibold">Pts</th>
                                            <th className="p-3 text-center font-semibold">J</th>
                                            <th className="p-3 text-center font-semibold">V</th>
                                            <th className="p-3 text-center font-semibold">E</th>
                                            <th className="p-3 text-center font-semibold">D</th>
                                            <th className="p-3 text-center font-semibold">GP</th>
                                            <th className="p-3 text-center font-semibold">GC</th>
                                            <th className="p-3 text-center font-semibold">SG</th>
                                            <th className="p-3 text-center font-semibold">Gols</th>
                                            <th className="p-3 text-center font-semibold">Ass</th>
                                            <th className="p-3 text-center font-semibold">Aprov%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {standings.map((player, index) => {
                                            const position = index + 1;
                                            return (
                                                <tr
                                                    key={player.user_id}
                                                    className="border-b transition-colors hover:bg-muted/50 last:border-0"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            {position <= 3 ? (
                                                                <Trophy className={`h-5 w-5 ${getMedalColor(position)}`} />
                                                            ) : (
                                                                <span className="text-muted-foreground">{position}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-medium">{player.user.name}</td>
                                                    <td className="p-3 text-center">
                                                        <Badge className="bg-green-600">{player.points}</Badge>
                                                    </td>
                                                    <td className="p-3 text-center">{player.matches_played}</td>
                                                    <td className="p-3 text-center text-green-600 font-semibold">
                                                        {player.wins}
                                                    </td>
                                                    <td className="p-3 text-center text-yellow-600 font-semibold">
                                                        {player.draws}
                                                    </td>
                                                    <td className="p-3 text-center text-red-600 font-semibold">
                                                        {player.losses}
                                                    </td>
                                                    <td className="p-3 text-center">{player.goals_for}</td>
                                                    <td className="p-3 text-center">{player.goals_against}</td>
                                                    <td className="p-3 text-center">
                                                        <span
                                                            className={
                                                                player.goal_difference > 0
                                                                    ? 'text-green-600 font-semibold'
                                                                    : player.goal_difference < 0
                                                                      ? 'text-red-600 font-semibold'
                                                                      : ''
                                                            }
                                                        >
                                                            {player.goal_difference > 0 && '+'}
                                                            {player.goal_difference}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge variant="secondary">{player.total_goals}</Badge>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge variant="outline">{player.total_assists}</Badge>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge
                                                            variant={
                                                                player.aproveitamento >= 70
                                                                    ? 'default'
                                                                    : player.aproveitamento >= 50
                                                                      ? 'secondary'
                                                                      : 'outline'
                                                            }
                                                        >
                                                            {player.aproveitamento.toFixed(1)}%
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Nenhuma estatística disponível ainda
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Legenda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <span className="font-semibold">Pts:</span> Pontos
                            </div>
                            <div>
                                <span className="font-semibold">J:</span> Jogos
                            </div>
                            <div>
                                <span className="font-semibold">V:</span> Vitórias
                            </div>
                            <div>
                                <span className="font-semibold">E:</span> Empates
                            </div>
                            <div>
                                <span className="font-semibold">D:</span> Derrotas
                            </div>
                            <div>
                                <span className="font-semibold">GP:</span> Gols Pró
                            </div>
                            <div>
                                <span className="font-semibold">GC:</span> Gols Contra
                            </div>
                            <div>
                                <span className="font-semibold">SG:</span> Saldo de Gols
                            </div>
                            <div>
                                <span className="font-semibold">Gols:</span> Gols Marcados
                            </div>
                            <div>
                                <span className="font-semibold">Ass:</span> Assistências
                            </div>
                            <div>
                                <span className="font-semibold">Aprov%:</span> Aproveitamento
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trophy, Target, Users, Clock } from 'lucide-react';

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

    // Top 10 artilheiros
    const topScorers = [...standings]
        .filter(p => p.total_goals > 0)
        .sort((a, b) => b.total_goals - a.total_goals)
        .slice(0, 10);

    // Top 10 assistências
    const topAssisters = [...standings]
        .filter(p => p.total_assists > 0)
        .sort((a, b) => b.total_assists - a.total_assists)
        .slice(0, 10);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classificação" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Classificação Geral</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">Ranking completo dos jogadores</p>
                </div>

                {/* Layout: Mobile = coluna, Desktop/iPad = duas colunas */}
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                    {/* Coluna principal: Tabela (sempre primeiro) */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <Card variant="ghost">
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-base sm:text-lg">Tabela de Classificação</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">Ordenado por pontos, vitórias e saldo de gols</CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 sm:p-6">
                                {standings.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs sm:text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="p-2 text-left font-semibold sm:p-3">#</th>
                                                    <th className="p-2 text-left font-semibold sm:p-3">Jogador</th>
                                                    <th className="p-2 text-center font-semibold sm:p-3">Pts</th>
                                                    <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">J</th>
                                                    <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">V</th>
                                                    <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">E</th>
                                                    <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">D</th>
                                                    <th className="hidden p-2 text-center font-semibold md:table-cell sm:p-3">GP</th>
                                                    <th className="hidden p-2 text-center font-semibold md:table-cell sm:p-3">GC</th>
                                                    <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">SG</th>
                                                    <th className="hidden p-2 text-center font-semibold xl:table-cell sm:p-3">Gols</th>
                                                    <th className="hidden p-2 text-center font-semibold xl:table-cell sm:p-3">Ass</th>
                                                    <th className="p-2 text-center font-semibold sm:p-3">%</th>
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
                                                            <td className="p-2 sm:p-3">
                                                                <div className="flex items-center">
                                                                    {position <= 3 ? (
                                                                        <Trophy className={`h-4 w-4 ${getMedalColor(position)}`} />
                                                                    ) : (
                                                                        <span className="text-muted-foreground">{position}</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-2 font-medium sm:p-3">{player.user.name}</td>
                                                            <td className="p-2 text-center sm:p-3">
                                                                <Badge className="bg-accent text-accent-foreground text-xs">{player.points}</Badge>
                                                            </td>
                                                            <td className="hidden p-2 text-center sm:table-cell sm:p-3">{player.matches_played}</td>
                                                            <td className="hidden p-2 text-center text-green-600 font-semibold sm:table-cell sm:p-3">{player.wins}</td>
                                                            <td className="hidden p-2 text-center text-yellow-600 font-semibold sm:table-cell sm:p-3">{player.draws}</td>
                                                            <td className="hidden p-2 text-center text-red-600 font-semibold sm:table-cell sm:p-3">{player.losses}</td>
                                                            <td className="hidden p-2 text-center md:table-cell sm:p-3">{player.goals_for}</td>
                                                            <td className="hidden p-2 text-center md:table-cell sm:p-3">{player.goals_against}</td>
                                                            <td className="hidden p-2 text-center sm:table-cell sm:p-3">
                                                                <span className={player.goal_difference > 0 ? 'text-green-600 font-semibold' : player.goal_difference < 0 ? 'text-red-600 font-semibold' : ''}>
                                                                    {player.goal_difference > 0 && '+'}{player.goal_difference}
                                                                </span>
                                                            </td>
                                                            <td className="hidden p-2 text-center xl:table-cell sm:p-3">
                                                                <Badge variant="secondary" className="text-xs">{player.total_goals}</Badge>
                                                            </td>
                                                            <td className="hidden p-2 text-center xl:table-cell sm:p-3">
                                                                <Badge variant="outline" className="text-xs">{player.total_assists}</Badge>
                                                            </td>
                                                            <td className="p-2 text-center sm:p-3">
                                                                <Badge className="text-xs" variant={player.aproveitamento >= 70 ? 'default' : player.aproveitamento >= 50 ? 'secondary' : 'outline'}>
                                                                    {player.aproveitamento.toFixed(0)}%
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

                        <Card variant="ghost">
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-sm sm:text-base">Legenda</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                <div className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3 sm:gap-2 sm:text-sm md:grid-cols-6">
                                    <div><span className="font-semibold">Pts:</span> Pontos</div>
                                    <div><span className="font-semibold">J:</span> Jogos</div>
                                    <div><span className="font-semibold">V:</span> Vitórias</div>
                                    <div><span className="font-semibold">E:</span> Empates</div>
                                    <div><span className="font-semibold">D:</span> Derrotas</div>
                                    <div><span className="font-semibold">%:</span> Aprov.</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna lateral: Top 10 (empilhados) */}
                    {standings.length > 0 && (
                        <div className="lg:w-72 xl:w-80 space-y-4 shrink-0">
                            {/* Top 10 Artilheiros */}
                            <Card variant="ghost">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Target className="h-4 w-4 text-accent" />
                                        Top 10 Artilheiros
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {topScorers.length > 0 ? (
                                        <div className="space-y-2">
                                            {topScorers.map((player, index) => (
                                                <div key={player.user_id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-5 text-sm font-bold ${getMedalColor(index + 1)}`}>
                                                            {index + 1}º
                                                        </span>
                                                        <span className="text-sm truncate max-w-[140px]">{player.user.name}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs shrink-0">
                                                        {player.total_goals} gols
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Top 10 Assistências */}
                            <Card variant="ghost">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Users className="h-4 w-4 text-accent" />
                                        Top 10 Assistências
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {topAssisters.length > 0 ? (
                                        <div className="space-y-2">
                                            {topAssisters.map((player, index) => (
                                                <div key={player.user_id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-5 text-sm font-bold ${getMedalColor(index + 1)}`}>
                                                            {index + 1}º
                                                        </span>
                                                        <span className="text-sm truncate max-w-[140px]">{player.user.name}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs shrink-0">
                                                        {player.total_assists} assist.
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Top 10 Atrasos */}
                            <Card variant="ghost">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="h-4 w-4 text-accent" />
                                        Top 10 Atrasos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground text-center py-4">Em breve</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

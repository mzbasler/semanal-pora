import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Users, Trophy, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SoccerLineUp from 'react-soccer-lineup';

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
    scheduled_at: string;
    played_at: string | null;
    status: string;
    team_a_score: number | null;
    team_b_score: number | null;
    team_a: Team;
    team_b: Team;
    confirmations: Array<{ user: User }>;
    players?: MatchPlayer[];
}

interface Props {
    nextMatch: Match | null;
    matches: {
        data: Match[];
        current_page: number;
        last_page: number;
    };
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
];

export default function MatchesIndex({ nextMatch, matches, auth }: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';

    const teamAPlayers = nextMatch?.players?.filter((p) => p.team.id === nextMatch.team_a.id) || [];
    const teamBPlayers = nextMatch?.players?.filter((p) => p.team.id === nextMatch.team_b.id) || [];
    const hasPlayers = teamAPlayers.length > 0 || teamBPlayers.length > 0;

    // Função para gerar URL do avatar
    const getAvatarUrl = (name: string, teamColor: string) => {
        const bgColor = teamColor.replace('#', '');
        const textColor = teamColor === '#3B82F6' ? 'fff' : '000';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=${textColor}&size=128&bold=true`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partidas" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    {isAdmin && (
                        <Link href="/matches/create">
                            <Button>Nova Partida</Button>
                        </Link>
                    )}
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-bold">Próxima Partida</h1>
                        <p className="text-muted-foreground">Campeonato Semanal {new Date().getFullYear()}</p>
                    </div>
                    {isAdmin && <div className="w-[120px]"></div>}
                </div>

                {/* Próxima Partida em Destaque */}
                {nextMatch && (
                    <div>
                        {/* Placar */}
                        <div className="mb-1 flex items-center justify-center gap-6 py-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-12 w-12 rounded-full"
                                    style={{ backgroundColor: nextMatch.team_a.color }}
                                />
                                <span className="text-lg font-semibold">{nextMatch.team_a.name}</span>
                            </div>

                            <span className="text-2xl font-bold text-muted-foreground">vs</span>

                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold">{nextMatch.team_b.name}</span>
                                <div
                                    className="h-12 w-12 rounded-full"
                                    style={{ backgroundColor: nextMatch.team_b.color }}
                                />
                            </div>
                        </div>

                        <div className="mb-6 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {format(new Date(nextMatch.scheduled_at), "EEEE, dd 'de' MMMM · HH'h'mm", {
                                        locale: ptBR,
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Campo de Futebol com Escalação */}
                        {hasPlayers ? (
                            <div className="grid gap-6 md:grid-cols-[1fr_2fr_1fr] items-center">
                                {/* Time A */}
                                <div className="flex items-center justify-center min-h-[450px]">
                                    <div className="space-y-1.5 w-full">
                                        {teamAPlayers.map((player, index) => (
                                        <div
                                            key={player.id}
                                            className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-xs transition-colors hover:bg-accent"
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(player.user.name)}&background=${nextMatch.team_a.color.replace('#', '')}&color=fff&size=24`}
                                                alt={player.user.name}
                                                className="h-6 w-6 rounded-full"
                                            />
                                            <span className="font-medium truncate">{player.user.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Soccer Field */}
                            <div className="flex items-center justify-center min-h-[450px]">
                                <div className="w-full max-h-full">
                                    <SoccerLineUp
                                        size="responsive"
                                        color="#22c55e"
                                        pattern="lines"
                                        homeTeam={{
                                            squad: {
                                                gk: teamAPlayers.slice(0, 1).map(() => ({})),
                                                df: teamAPlayers.slice(1, 4).map(() => ({})),
                                                fw: teamAPlayers.slice(4, 7).map(() => ({})),
                                            },
                                            style: {
                                                color: '#3B82F6',
                                                borderColor: 'transparent',
                                            },
                                        }}
                                        awayTeam={{
                                            squad: {
                                                gk: teamBPlayers.slice(0, 1).map(() => ({})),
                                                df: teamBPlayers.slice(1, 4).map(() => ({})),
                                                fw: teamBPlayers.slice(4, 7).map(() => ({})),
                                            },
                                            style: {
                                                color: '#FFFFFF',
                                                borderColor: 'transparent',
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Time B */}
                            <div className="flex items-center justify-center min-h-[450px]">
                                <div className="space-y-1.5 w-full">
                                    {teamBPlayers.map((player, index) => (
                                        <div
                                            key={player.id}
                                            className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-xs transition-colors hover:bg-accent"
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(player.user.name)}&background=E5E7EB&color=000&size=24`}
                                                alt={player.user.name}
                                                className="h-6 w-6 rounded-full"
                                            />
                                            <span className="font-medium truncate">{player.user.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ) : (
                            <Card className="mx-auto max-w-2xl">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                                    <h3 className="mb-2 text-lg font-semibold">Aguardando Formação de Equipes</h3>
                                    <p className="mb-4 text-center text-sm text-muted-foreground">
                                        Os times ainda não foram montados para esta partida
                                    </p>
                                    {isAdmin && (
                                        <Link href={`/matches/${nextMatch.id}/assign-teams`}>
                                            <Button>
                                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                                                Montar Times
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Título das Partidas Finalizadas */}
                <div className="text-center mt-12">
                    <h2 className="text-3xl font-bold">Partidas Finalizadas</h2>
                    <p className="text-sm text-muted-foreground">Histórico de resultados</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {matches.data.map((match) => {
                        const isFinished = match.status === 'completed';
                        const teamAWon = isFinished && (match.team_a_score ?? 0) > (match.team_b_score ?? 0);
                        const teamBWon = isFinished && (match.team_b_score ?? 0) > (match.team_a_score ?? 0);

                        return (
                            <Link key={match.id} href={`/matches/${match.id}`}>
                                <Card className="group cursor-pointer transition-all hover:border-primary">
                                    <CardContent className="p-4">
                                        {/* Data e Status */}
                                        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {format(new Date(match.scheduled_at), "dd MMM · HH'h'mm", {
                                                        locale: ptBR,
                                                    })}
                                                </span>
                                            </div>
                                            {isFinished ? (
                                                <Badge variant="outline" className="text-xs">
                                                    FINAL
                                                </Badge>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{match.confirmations.length}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Placar - O x O */}
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Time A */}
                                            <div className="flex flex-1 items-center gap-2">
                                                <div
                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                    style={{ backgroundColor: match.team_a.color }}
                                                />
                                                {teamAWon && <Trophy className="h-4 w-4 shrink-0 text-yellow-500" />}
                                            </div>

                                            {/* Score */}
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="text-2xl font-bold tabular-nums">
                                                    {isFinished ? match.team_a_score : '-'}
                                                </span>
                                                <span className="text-sm text-muted-foreground">x</span>
                                                <span className="text-2xl font-bold tabular-nums">
                                                    {isFinished ? match.team_b_score : '-'}
                                                </span>
                                            </div>

                                            {/* Time B */}
                                            <div className="flex flex-1 items-center justify-end gap-2">
                                                {teamBWon && <Trophy className="h-4 w-4 shrink-0 text-yellow-500" />}
                                                <div
                                                    className="h-8 w-8 shrink-0 rounded-full"
                                                    style={{ backgroundColor: match.team_b.color }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {matches.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Trophy className="mb-4 h-16 w-16 text-muted-foreground" />
                            <p className="text-lg font-semibold">Nenhuma partida encontrada</p>
                            <p className="text-muted-foreground">Comece criando a primeira partida do campeonato</p>
                            {isAdmin && (
                                <Link href="/matches/create" className="mt-4">
                                    <Button>Criar primeira partida</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

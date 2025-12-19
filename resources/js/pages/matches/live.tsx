import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Users, ArrowLeftRight, Plus, Square, Redo, Icon, type LucideProps, Trash2, Radio } from 'lucide-react';
import { soccerBall } from '@lucide/lab';

const SoccerBallIcon = (props: LucideProps) => (
    <Icon iconNode={soccerBall} {...props} />
);
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { colors, getColorsForBackground } from '@/config/colors';

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
    max_players: number;
    confirmations: Array<{ user: User }>;
    players?: MatchPlayer[];
}

interface PendingMatch {
    match: {
        id: number;
        scheduled_at: string;
        max_players: number;
        confirmed_count: number;
    };
    userConfirmation: { id: number; is_confirmed: boolean; status: string } | null;
}

interface Props {
    nextMatch: Match | null;
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Ao Vivo', href: '/live' },
];

export default function LiveMatch({ nextMatch, auth }: Props) {
    const { pendingMatch } = usePage<{ pendingMatch: PendingMatch | null }>().props;
    const [isLoading, setIsLoading] = useState<'confirm' | 'decline' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';

    const teamAPlayers = nextMatch?.players?.filter((p) => p.team.id === nextMatch.team_a.id) || [];
    const teamBPlayers = nextMatch?.players?.filter((p) => p.team.id === nextMatch.team_b.id) || [];
    const hasPlayers = teamAPlayers.length > 0 || teamBPlayers.length > 0;

    // Estado local para stats (para admin editar)
    const [stats, setStats] = useState<Record<number, { goals: number; assists: number }>>(
        [...teamAPlayers, ...teamBPlayers].reduce(
            (acc, player) => ({
                ...acc,
                [player.id]: { goals: player.goals, assists: player.assists },
            }),
            {},
        ),
    );

    // Atualiza stats quando nextMatch muda (refresh)
    useEffect(() => {
        if (nextMatch?.players) {
            const allPlayers = nextMatch.players;
            setStats(
                allPlayers.reduce(
                    (acc, player) => ({
                        ...acc,
                        [player.id]: { goals: player.goals, assists: player.assists },
                    }),
                    {},
                ),
            );
        }
    }, [nextMatch]);

    // Auto-refresh a cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['nextMatch', 'pendingMatch'] });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Calcular placar baseado nos stats locais
    const teamAScore = teamAPlayers.reduce((sum, p) => sum + (stats[p.id]?.goals || 0), 0);
    const teamBScore = teamBPlayers.reduce((sum, p) => sum + (stats[p.id]?.goals || 0), 0);

    // Dados para o card de confirmação
    const hasConfirmedOrWaiting = pendingMatch?.userConfirmation?.status === 'confirmed' || pendingMatch?.userConfirmation?.status === 'waiting';
    const hasDeclined = pendingMatch?.userConfirmation?.status === 'declined';
    const showConfirmationCard = pendingMatch && !hasConfirmedOrWaiting && !hasDeclined;
    const showDeclinedCard = pendingMatch && hasDeclined;
    const pendingMatchData = pendingMatch?.match;
    const scheduledDate = pendingMatchData ? new Date(pendingMatchData.scheduled_at) : null;

    const handleConfirm = () => {
        if (!pendingMatchData) return;
        setIsLoading('confirm');
        router.post(`/matches/${pendingMatchData.id}/confirm`, { confirmed: true }, {
            preserveScroll: true,
            onFinish: () => setIsLoading(null),
        });
    };

    const handleDecline = () => {
        if (!pendingMatchData) return;
        setIsLoading('decline');
        router.post(`/matches/${pendingMatchData.id}/confirm`, { confirmed: false }, {
            preserveScroll: true,
            onFinish: () => setIsLoading(null),
        });
    };

    const handleStatChange = (playerId: number, field: 'goals' | 'assists', delta: number) => {
        const newValue = Math.max(0, (stats[playerId]?.[field] || 0) + delta);
        const newStats = {
            ...stats,
            [playerId]: {
                ...stats[playerId],
                [field]: newValue,
            },
        };
        setStats(newStats);

        // Salvar automaticamente no backend
        if (nextMatch) {
            const players = Object.entries(newStats).map(([id, data]) => ({
                id: parseInt(id),
                ...data,
            }));
            router.post(`/matches/${nextMatch.id}/update-stats`, { players, finalize: false }, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handleFinalize = () => {
        if (!nextMatch) return;
        setIsSaving(true);
        const players = Object.entries(stats).map(([id, data]) => ({
            id: parseInt(id),
            ...data,
        }));

        router.post(`/matches/${nextMatch.id}/update-stats`, { players, finalize: true }, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    const handleDelete = () => {
        if (!nextMatch) return;
        if (confirm('Tem certeza que deseja excluir esta partida? Esta ação não pode ser desfeita.')) {
            setIsDeleting(true);
            router.delete(`/matches/${nextMatch.id}`, {
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    const renderPlayerStatCard = (player: MatchPlayer) => {
        const playerStats = stats[player.id] || { goals: 0, assists: 0 };
        const teamColor = player.team.color;
        const colorSet = getColorsForBackground(teamColor);

        if (isAdmin && nextMatch?.status === 'scheduled') {
            return (
                <div key={player.id} className="rounded-xl p-3" style={{ backgroundColor: teamColor }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color: colorSet.text }}>{player.user.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Gols */}
                        <div className="flex items-center justify-between rounded-lg p-2" style={{ backgroundColor: colorSet.overlay }}>
                            <SoccerBallIcon className="h-5 w-5 shrink-0" style={{ color: colorSet.text }} />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleStatChange(player.id, 'goals', -1)}
                                    className="h-7 w-7 rounded-full flex items-center justify-center text-base font-bold active:scale-95"
                                    style={{ backgroundColor: teamColor, color: colorSet.text }}
                                >
                                    -
                                </button>
                                <span className="w-6 text-center text-lg font-bold" style={{ color: colorSet.text }}>{playerStats.goals}</span>
                                <button
                                    type="button"
                                    onClick={() => handleStatChange(player.id, 'goals', 1)}
                                    className="h-7 w-7 rounded-full flex items-center justify-center text-base font-bold active:scale-95"
                                    style={{ backgroundColor: teamColor, color: colorSet.text }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Assistências */}
                        <div className="flex items-center justify-between rounded-lg p-2" style={{ backgroundColor: colorSet.overlay }}>
                            <Redo className="h-5 w-5 shrink-0" style={{ color: colorSet.text }} />
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleStatChange(player.id, 'assists', -1)}
                                    className="h-7 w-7 rounded-full flex items-center justify-center text-base font-bold active:scale-95"
                                    style={{ backgroundColor: teamColor, color: colorSet.text }}
                                >
                                    -
                                </button>
                                <span className="w-6 text-center text-lg font-bold" style={{ color: colorSet.text }}>{playerStats.assists}</span>
                                <button
                                    type="button"
                                    onClick={() => handleStatChange(player.id, 'assists', 1)}
                                    className="h-7 w-7 rounded-full flex items-center justify-center text-base font-bold active:scale-95"
                                    style={{ backgroundColor: teamColor, color: colorSet.text }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Visualização normal (não admin ou partida finalizada)
        return (
            <div key={player.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: teamColor }}>
                <span className="text-sm font-medium" style={{ color: colorSet.text }}>{player.user.name}</span>
                <div className="flex items-center gap-3 text-sm" style={{ color: colorSet.text }}>
                    {playerStats.goals > 0 && (
                        <span className="flex items-center gap-1">
                            <SoccerBallIcon className="h-4 w-4" /> {playerStats.goals}
                        </span>
                    )}
                    {playerStats.assists > 0 && (
                        <span className="flex items-center gap-1">
                            <Redo className="h-4 w-4" /> {playerStats.assists}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ao Vivo" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Card de Confirmação - para quem ainda não confirmou */}
                {showConfirmationCard && scheduledDate && (
                    <Card
                        variant="ghost"
                        className="border transition-all duration-300 bg-card"
                        style={{
                            borderColor: colors.actions.primary,
                        }}
                    >
                        <CardContent className="p-3 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-lg"
                                style={{ backgroundColor: colors.actions.primary }}
                            >
                                <Calendar className="h-5 w-5" style={{ color: colors.actions.primaryText }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black tracking-wide capitalize">
                                    {format(scheduledDate, "EEEE", { locale: ptBR })} às {format(scheduledDate, "HH:mm")}
                                </h3>
                                <p className="text-xs font-semibold" style={{ color: colors.actions.primary }}>
                                    Aguardando confirmação
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    onClick={handleDecline}
                                    disabled={isLoading !== null}
                                    variant="outline"
                                    size="sm"
                                    className="font-bold hover:bg-red-500 hover:text-white hover:border-red-500"
                                >
                                    {isLoading === 'decline' ? (
                                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'NÃO JOGAR'
                                    )}
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={isLoading !== null}
                                    size="sm"
                                    className="font-bold hover:opacity-90"
                                    style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                                >
                                    {isLoading === 'confirm' ? (
                                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        'JOGAR'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Card para quem já confirmou - permite cancelar */}
                {hasConfirmedOrWaiting && scheduledDate && (
                    <Card
                        variant="ghost"
                        className="border transition-all duration-300 bg-card"
                        style={{
                            borderColor: colors.actions.success,
                        }}
                    >
                        <CardContent className="p-3 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-lg"
                                style={{ backgroundColor: colors.actions.success }}
                            >
                                <Calendar className="h-5 w-5" style={{ color: colors.actions.successText }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black tracking-wide capitalize">
                                    {format(scheduledDate, "EEEE", { locale: ptBR })} às {format(scheduledDate, "HH:mm")}
                                </h3>
                                <p className="text-xs font-semibold" style={{ color: colors.actions.success }}>
                                    {pendingMatch?.userConfirmation?.status === 'confirmed'
                                        ? '✓ Presença confirmada'
                                        : '⏳ Na lista de espera'
                                    }
                                </p>
                            </div>
                            <Button
                                onClick={handleDecline}
                                disabled={isLoading !== null}
                                variant="outline"
                                size="sm"
                                className="shrink-0 font-bold text-red-500 border-red-500/80 hover:bg-red-500 hover:text-white hover:border-red-500"
                            >
                                {isLoading === 'decline' ? (
                                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'NÃO JOGAR'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Card para quem declinou - permite mudar de ideia */}
                {showDeclinedCard && scheduledDate && (
                    <Card
                        variant="ghost"
                        className="border transition-all duration-300 bg-card"
                        style={{
                            borderColor: '#ef4444',
                        }}
                    >
                        <CardContent className="p-3 flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-lg"
                                style={{ backgroundColor: '#ef4444' }}
                            >
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black tracking-wide capitalize">
                                    {format(scheduledDate, "EEEE", { locale: ptBR })} às {format(scheduledDate, "HH:mm")}
                                </h3>
                                <p className="text-xs font-semibold text-red-500">
                                    Não vou jogar
                                </p>
                            </div>
                            <Button
                                onClick={handleConfirm}
                                disabled={isLoading !== null}
                                size="sm"
                                className="shrink-0 font-bold hover:opacity-90"
                                style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                            >
                                {isLoading === 'confirm' ? (
                                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'JOGAR'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        {nextMatch && hasPlayers && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 animate-pulse">
                                <Radio className="h-5 w-5 text-white" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {nextMatch && hasPlayers ? 'Ao Vivo' : 'Próxima Partida'}
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                {nextMatch && hasPlayers
                                    ? 'Acompanhe o jogo em tempo real'
                                    : 'Campeonato Semanal ' + new Date().getFullYear()
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && (
                            <Button asChild className="w-full sm:w-auto hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                                <Link href="/matches/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nova Partida
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Próxima Partida com Escalação e Stats */}
                {nextMatch && hasPlayers && (
                    <div className="space-y-4">
                        {/* Placar - Full Width Centralizado */}
                        <div className="flex flex-col items-center justify-center text-center py-6 w-full">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg" style={{ backgroundColor: nextMatch.team_a.color }} />
                                    <span className="text-xs sm:text-sm font-medium mt-2">{nextMatch.team_a.name}</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <span className="text-5xl sm:text-6xl font-bold">{teamAScore}</span>
                                    <span className="text-2xl font-black text-muted-foreground">x</span>
                                    <span className="text-5xl sm:text-6xl font-bold">{teamBScore}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-gray-300 shadow-lg" style={{ backgroundColor: nextMatch.team_b.color }} />
                                    <span className="text-xs sm:text-sm font-medium mt-2">{nextMatch.team_b.name}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{format(new Date(nextMatch.scheduled_at), "dd/MM · HH'h'mm", { locale: ptBR })}</span>
                            </div>
                            {isAdmin && nextMatch.status === 'scheduled' && (
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        onClick={handleFinalize}
                                        disabled={isSaving}
                                        className="hover:opacity-90"
                                        size="sm"
                                        style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                                    >
                                        {isSaving ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        ) : (
                                            <Square className="h-4 w-4 mr-1" />
                                        )}
                                        Finalizar
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-500/80 hover:bg-red-500 hover:text-white hover:border-red-500"
                                    >
                                        {isDeleting ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            )}
                            {/* Estatísticas inline */}
                            {(() => {
                                const allPlayers = [...teamAPlayers, ...teamBPlayers];
                                const scorers = allPlayers.filter(p => (stats[p.id]?.goals || 0) > 0).sort((a, b) => (stats[b.id]?.goals || 0) - (stats[a.id]?.goals || 0));
                                const assisters = allPlayers.filter(p => (stats[p.id]?.assists || 0) > 0).sort((a, b) => (stats[b.id]?.assists || 0) - (stats[a.id]?.assists || 0));
                                if (scorers.length === 0 && assisters.length === 0) return null;
                                return (
                                    <div className="flex flex-col gap-1 mt-4 text-xs text-muted-foreground">
                                        {scorers.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Gols: </span>
                                                {scorers.map((p, i) => (
                                                    <span key={p.id}>{i > 0 && ', '}{p.user.name} ({stats[p.id]?.goals})</span>
                                                ))}
                                            </div>
                                        )}
                                        {assisters.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Assist: </span>
                                                {assisters.map((p, i) => (
                                                    <span key={p.id}>{i > 0 && ', '}{p.user.name} ({stats[p.id]?.assists})</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Times - Mobile: empilhados, Desktop: 2 colunas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Time A */}
                            <div>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="h-5 w-5 rounded-full" style={{ backgroundColor: nextMatch.team_a.color }} />
                                    <span className="font-bold">{nextMatch.team_a.name}</span>
                                </div>
                                <div className="space-y-1">
                                    {teamAPlayers.map(player => renderPlayerStatCard(player))}
                                </div>
                            </div>

                            {/* Time B */}
                            <div>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: nextMatch.team_b.color }} />
                                    <span className="font-bold">{nextMatch.team_b.name}</span>
                                </div>
                                <div className="space-y-1">
                                    {teamBPlayers.map(player => renderPlayerStatCard(player))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Próxima Partida sem Escalação */}
                {nextMatch && !hasPlayers && (
                    <Card variant="ghost">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div
                                    className="h-12 w-12 rounded-full"
                                    style={{ backgroundColor: nextMatch.team_a.color }}
                                />
                                <span className="text-xl font-bold text-muted-foreground">vs</span>
                                <div
                                    className="h-12 w-12 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: nextMatch.team_b.color }}
                                />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Aguardando Formação</h3>
                            <p className="mb-1 text-sm text-muted-foreground">
                                {format(new Date(nextMatch.scheduled_at), "EEEE, dd/MM · HH'h'mm", { locale: ptBR })}
                            </p>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {nextMatch.confirmations.length} confirmados de {nextMatch.max_players}
                            </p>
                            {isAdmin && (
                                <div className="flex gap-2">
                                    <Link href={`/matches/${nextMatch.id}/assign-teams`}>
                                        <Button className="hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                                            <ArrowLeftRight className="mr-2 h-4 w-4" />
                                            Montar Times
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        variant="outline"
                                        className="text-red-500 border-red-500/80 hover:bg-red-500 hover:text-white hover:border-red-500"
                                    >
                                        {isDeleting ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Sem partida agendada */}
                {!nextMatch && (
                    <Card variant="ghost">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Users className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-semibold">Nenhuma partida agendada</p>
                            <p className="text-muted-foreground">
                                {isAdmin ? 'Crie uma nova partida para começar' : 'Aguarde o administrador criar uma partida'}
                            </p>
                            {isAdmin && (
                                <Link href="/matches/create" className="mt-4">
                                    <Button className="hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar partida
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

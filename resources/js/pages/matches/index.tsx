import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Trophy, Plus, Users, Trash2, Clock } from 'lucide-react';
import { colors } from '@/config/colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Team {
    id: number;
    name: string;
    color: string;
}

interface Confirmation {
    id: number;
    user_id: number;
    status: string;
}

interface Player {
    id: number;
    user_id: number;
}

interface ScheduledMatch {
    id: number;
    scheduled_at: string;
    max_players: number;
    status: string;
    team_a: Team;
    team_b: Team;
    confirmations: Confirmation[];
    players: Player[];
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
}

interface Props {
    scheduledMatches: ScheduledMatch[];
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

export default function MatchesIndex({ scheduledMatches, matches, auth }: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';

    const handleDeleteMatch = (matchId: number) => {
        if (confirm('Tem certeza que deseja excluir esta partida?')) {
            router.delete(`/matches/${matchId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partidas" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Partidas</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Campeonato Semanal {new Date().getFullYear()}
                        </p>
                    </div>
                    {isAdmin && (
                        <Button asChild className="w-full sm:w-auto hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                            <Link href="/matches/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Partida
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Partidas Agendadas */}
                {scheduledMatches.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Partidas Agendadas
                        </h2>
                        <div className="space-y-2">
                            {scheduledMatches.map((match) => {
                                const confirmedCount = match.confirmations.filter(c => c.status === 'confirmed').length;
                                const teamsAssigned = match.players.length > 0;

                                return (
                                    <Card key={match.id} variant="ghost" className="border-2 border-dashed border-primary/30">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="flex flex-col gap-3">
                                                {/* Info da partida */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="h-8 w-8 shrink-0 rounded-full shadow-sm"
                                                                style={{ backgroundColor: match.team_a.color }}
                                                            />
                                                            <span className="font-medium text-sm">vs</span>
                                                            <div
                                                                className="h-8 w-8 shrink-0 rounded-full shadow-sm border-2 border-gray-200"
                                                                style={{ backgroundColor: match.team_b.color }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Calendar className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                    {format(new Date(match.scheduled_at), "EEEE, dd/MM 'às' HH:mm", {
                                                                        locale: ptBR,
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Users className="h-3 w-3" />
                                                                <span>{confirmedCount}/{match.max_players} confirmados</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge variant={teamsAssigned ? "default" : "outline"} className="text-xs">
                                                        {teamsAssigned ? 'TIMES PRONTOS' : 'AGUARDANDO'}
                                                    </Badge>
                                                </div>

                                                {/* Ações do admin */}
                                                {isAdmin && (
                                                    <div className="flex gap-2 pt-2 border-t">
                                                        {!teamsAssigned && (
                                                            <Button asChild size="sm" className="flex-1 hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                                                                <Link href={`/matches/${match.id}/assign-teams`}>
                                                                    <Users className="mr-2 h-4 w-4" />
                                                                    Montar Times
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {teamsAssigned && (
                                                            <Button asChild size="sm" variant="outline" className="flex-1">
                                                                <Link href="/live">
                                                                    Ir para Ao Vivo
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                            onClick={() => handleDeleteMatch(match.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Partidas Anteriores */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Partidas Anteriores
                    </h2>
                    {matches.data.length > 0 ? (
                        <div className="space-y-2">
                            {matches.data.map((match) => {
                                const teamAWon = (match.team_a_score ?? 0) > (match.team_b_score ?? 0);
                                const teamBWon = (match.team_b_score ?? 0) > (match.team_a_score ?? 0);

                                return (
                                    <Card key={match.id} variant="ghost">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="grid grid-cols-3 items-center gap-2">
                                                {/* Coluna 1: Time A */}
                                                <div className="flex items-center gap-2 justify-start">
                                                    <div
                                                        className="h-10 w-10 shrink-0 rounded-full shadow-sm"
                                                        style={{ backgroundColor: match.team_a.color }}
                                                    />
                                                    <div className="min-w-0">
                                                        <span className="font-medium text-sm block truncate">
                                                            {match.team_a.name}
                                                        </span>
                                                        {teamAWon && <Trophy className="h-4 w-4 text-yellow-500" />}
                                                    </div>
                                                </div>

                                                {/* Coluna 2: Placar, Data e Status */}
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                                                            {match.team_a_score}
                                                        </span>
                                                        <span className="text-muted-foreground font-medium">x</span>
                                                        <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                                                            {match.team_b_score}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {format(new Date(match.scheduled_at), 'dd/MM', {
                                                                locale: ptBR,
                                                            })}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] mt-1">
                                                        FINAL
                                                    </Badge>
                                                </div>

                                                {/* Coluna 3: Time B */}
                                                <div className="flex items-center gap-2 justify-end">
                                                    <div className="min-w-0 text-right">
                                                        <span className="font-medium text-sm block truncate">
                                                            {match.team_b.name}
                                                        </span>
                                                        {teamBWon && (
                                                            <Trophy className="h-4 w-4 text-yellow-500 ml-auto" />
                                                        )}
                                                    </div>
                                                    <div
                                                        className="h-10 w-10 shrink-0 rounded-full shadow-sm border-2 border-gray-200"
                                                        style={{ backgroundColor: match.team_b.color }}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card variant="ghost">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Trophy className="mb-4 h-16 w-16 text-muted-foreground" />
                                <p className="text-lg font-semibold">Nenhuma partida finalizada</p>
                                <p className="text-muted-foreground">
                                    As partidas finalizadas aparecerão aqui
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

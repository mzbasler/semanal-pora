import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar, Users, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Team {
    id: number;
    name: string;
    color: string;
}

interface User {
    id: number;
    name: string;
}

interface Confirmation {
    id: number;
    is_confirmed: boolean;
    user: User;
}

interface Match {
    id: number;
    scheduled_at: string;
    played_at: string | null;
    status: string;
    max_players: number;
    team_a_score: number | null;
    team_b_score: number | null;
    team_a: Team;
    team_b: Team;
    confirmations: Confirmation[];
    players: Array<{
        id: number;
        user: User;
        team: Team;
        goals: number;
        assists: number;
    }>;
}

interface Props {
    match: Match;
    userConfirmation: Confirmation | null;
    confirmedPlayers: Confirmation[];
    waitingList: Confirmation[];
    availableSlots: number;
    isFull: boolean;
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
    { title: 'Detalhes', href: '#' },
];

export default function MatchShow({
    match,
    userConfirmation,
    confirmedPlayers,
    waitingList,
    availableSlots,
    isFull,
    auth,
}: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';
    const { post, processing } = useForm();

    const handleConfirmation = (confirmed: boolean) => {
        post(`/matches/${match.id}/confirm`, {
            data: { confirmed },
            preserveScroll: true,
        });
    };

    const handleAssignTeams = () => {
        router.get(`/matches/${match.id}/assign-teams`);
    };

    const isConfirmed = userConfirmation !== null;
    const isInWaitingList = userConfirmation !== null && !userConfirmation.is_confirmed;
    const hasPlayers = match.players.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Partida - ${match.team_a.name} vs ${match.team_b.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-3xl">
                                    <span style={{ color: match.team_a.color }}>{match.team_a.name}</span>
                                    {match.status === 'completed' ? (
                                        <span className="text-4xl font-bold">
                                            {match.team_a_score} - {match.team_b_score}
                                        </span>
                                    ) : (
                                        <span className="text-3xl">vs</span>
                                    )}
                                    <span style={{ color: match.team_b.color }}>{match.team_b.name}</span>
                                </CardTitle>
                                <CardDescription className="mt-3 flex items-center gap-4 text-base">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        {format(new Date(match.scheduled_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                                            locale: ptBR,
                                        })}
                                    </span>
                                    <Badge variant={match.status === 'completed' ? 'default' : 'secondary'}>
                                        {match.status === 'completed' ? 'Finalizada' : 'Agendada'}
                                    </Badge>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {match.status === 'scheduled' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Confirmação de Presença</CardTitle>
                            <CardDescription>
                                {isInWaitingList
                                    ? 'Você está na lista de espera. Entrarás se alguém desistir!'
                                    : isConfirmed && userConfirmation?.is_confirmed
                                    ? 'Sua presença está confirmada!'
                                    : `Confirme sua presença para participar da partida (${availableSlots} vaga${availableSlots !== 1 ? 's' : ''} disponível${availableSlots !== 1 ? 'is' : ''})`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-3">
                            <Button
                                onClick={() => handleConfirmation(true)}
                                disabled={processing || isConfirmed}
                                className="flex-1"
                                variant={isConfirmed ? 'default' : 'outline'}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isInWaitingList
                                    ? 'Na Lista de Espera'
                                    : isConfirmed
                                    ? 'Presença Confirmada'
                                    : isFull
                                    ? 'Entrar na Lista de Espera'
                                    : 'Confirmar Presença'}
                            </Button>
                            {isConfirmed && (
                                <Button
                                    onClick={() => handleConfirmation(false)}
                                    disabled={processing}
                                    variant="destructive"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Jogadores Confirmados ({confirmedPlayers.length}/{match.max_players})
                                </CardTitle>
                                <CardDescription>Ordem de chegada - quem confirmou primeiro</CardDescription>
                            </div>
                            {isAdmin && match.status === 'scheduled' && confirmedPlayers.length >= 2 && !hasPlayers && (
                                <Button onClick={handleAssignTeams} disabled={processing}>
                                    Montar Times
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {confirmedPlayers.length > 0 ? (
                            <div className="grid gap-2">
                                {confirmedPlayers.map((confirmation, index) => (
                                    <div
                                        key={confirmation.id}
                                        className="flex items-center gap-2 rounded-lg border p-3"
                                    >
                                        <Badge variant="outline" className="w-8 justify-center">
                                            {index + 1}
                                        </Badge>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>{confirmation.user.name}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Nenhum jogador confirmado ainda</p>
                        )}
                    </CardContent>
                </Card>

                {waitingList.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Lista de Espera ({waitingList.length})
                            </CardTitle>
                            <CardDescription>
                                Jogadores que confirmaram após o limite. Entrarão se alguém desistir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                {waitingList.map((confirmation, index) => (
                                    <div
                                        key={confirmation.id}
                                        className="flex items-center gap-2 rounded-lg border border-dashed p-3"
                                    >
                                        <Badge variant="secondary" className="w-8 justify-center">
                                            {index + 1}
                                        </Badge>
                                        <span className="text-muted-foreground">{confirmation.user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {hasPlayers && (
                    <div className="flex gap-4">
                        <Link href={`/matches/${match.id}/lineup`} className="flex-1">
                            <Button className="w-full" variant="outline">
                                Ver Escalação
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

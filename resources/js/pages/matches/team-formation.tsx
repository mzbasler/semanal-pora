import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

interface Confirmation {
    id: number;
    user: User;
}

interface Match {
    id: number;
    scheduled_at: string;
    team_a: Team;
    team_b: Team;
}

interface Props {
    match: Match | null;
    confirmedPlayers: Confirmation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Formação de Equipes', href: '/matches/team-formation' },
];

export default function TeamFormation({ match, confirmedPlayers }: Props) {
    const { post, processing } = useForm();
    const [teamAPlayers, setTeamAPlayers] = useState<number[]>([]);
    const [teamBPlayers, setTeamBPlayers] = useState<number[]>([]);

    const handleAssignTeam = (userId: number, team: 'A' | 'B') => {
        if (team === 'A') {
            setTeamAPlayers([...teamAPlayers, userId]);
            setTeamBPlayers(teamBPlayers.filter((id) => id !== userId));
        } else {
            setTeamBPlayers([...teamBPlayers, userId]);
            setTeamAPlayers(teamAPlayers.filter((id) => id !== userId));
        }
    };

    const handleConfirmMatch = () => {
        if (!match) return;

        post(`/matches/${match.id}/assign-teams`, {
            data: {
                team_a_players: teamAPlayers,
                team_b_players: teamBPlayers,
            },
        });
    };

    const getPlayerTeam = (userId: number): 'A' | 'B' | null => {
        if (teamAPlayers.includes(userId)) return 'A';
        if (teamBPlayers.includes(userId)) return 'B';
        return null;
    };

    const canConfirm = teamAPlayers.length > 0 && teamBPlayers.length > 0;

    if (!match) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Formação de Equipes" />
                <div className="flex flex-col gap-6 p-6">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="mb-4 h-16 w-16 text-muted-foreground" />
                            <p className="text-lg font-semibold">Nenhuma partida pendente</p>
                            <p className="text-muted-foreground">
                                Todas as partidas já têm os times formados
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formação de Equipes" />
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Formação de Equipes</h1>
                    <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {format(new Date(match.scheduled_at), "EEEE, dd 'de' MMMM 'às' HH'h'mm", {
                                locale: ptBR,
                            })}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr_1fr]">
                    {/* Time A */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div
                                    className="h-4 w-4 rounded-full"
                                    style={{ backgroundColor: match.team_a.color }}
                                />
                                {match.team_a.name}
                            </CardTitle>
                            <CardDescription>{teamAPlayers.length} jogadores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {teamAPlayers.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        Nenhum jogador selecionado
                                    </p>
                                ) : (
                                    confirmedPlayers
                                        .filter((c) => teamAPlayers.includes(c.user.id))
                                        .map((confirmation) => (
                                            <div
                                                key={confirmation.id}
                                                className="flex items-center gap-2 rounded-lg border p-3"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium">{confirmation.user.name}</span>
                                            </div>
                                        ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jogadores Confirmados */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Jogadores Confirmados ({confirmedPlayers.length})
                            </CardTitle>
                            <CardDescription>
                                Clique em Azul ou Branco para adicionar o jogador ao time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {confirmedPlayers.map((confirmation) => {
                                    const playerTeam = getPlayerTeam(confirmation.user.id);
                                    return (
                                        <div
                                            key={confirmation.id}
                                            className="rounded-lg border p-3"
                                        >
                                            <div className="mb-2 font-medium">{confirmation.user.name}</div>
                                            {playerTeam ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm text-muted-foreground">
                                                        Adicionado ao {playerTeam === 'A' ? match.team_a.name : match.team_b.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        style={{ backgroundColor: match.team_a.color }}
                                                        onClick={() => handleAssignTeam(confirmation.user.id, 'A')}
                                                    >
                                                        Azul
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        style={{
                                                            backgroundColor: match.team_b.color,
                                                            color: match.team_b.color === '#FFFFFF' ? '#000' : '#fff'
                                                        }}
                                                        onClick={() => handleAssignTeam(confirmation.user.id, 'B')}
                                                    >
                                                        Branco
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time B */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div
                                    className="h-4 w-4 rounded-full"
                                    style={{ backgroundColor: match.team_b.color }}
                                />
                                {match.team_b.name}
                            </CardTitle>
                            <CardDescription>{teamBPlayers.length} jogadores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {teamBPlayers.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-8">
                                        Nenhum jogador selecionado
                                    </p>
                                ) : (
                                    confirmedPlayers
                                        .filter((c) => teamBPlayers.includes(c.user.id))
                                        .map((confirmation) => (
                                            <div
                                                key={confirmation.id}
                                                className="flex items-center gap-2 rounded-lg border p-3"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium">{confirmation.user.name}</span>
                                            </div>
                                        ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        onClick={handleConfirmMatch}
                        disabled={!canConfirm || processing}
                    >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirmar Partida
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users, ArrowLeftRight, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

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
    user_id: number;
    user: User;
}

interface Match {
    id: number;
    team_a: Team;
    team_b: Team;
}

interface Props {
    match: Match;
    allPlayers: User[];
    confirmations: Confirmation[];
    confirmedPlayers: Confirmation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
    { title: 'Montar Times', href: '#' },
];

export default function AssignTeams({ match, allPlayers, confirmations, confirmedPlayers }: Props) {
    const [playerTeams, setPlayerTeams] = useState<Record<number, number>>({});
    const [processing, setProcessing] = useState(false);

    // Criar um mapa de user_id para confirmation para fácil acesso
    const confirmationMap = confirmations.reduce((acc, conf) => {
        acc[conf.user_id] = conf;
        return acc;
    }, {} as Record<number, Confirmation>);

    const handleToggleConfirmation = (userId: number, confirmed: boolean) => {
        router.post(`/matches/${match.id}/toggle-confirmation`, {
            user_id: userId,
            confirmed: confirmed,
        }, {
            preserveScroll: true,
        });
    };

    const handleTeamChange = (userId: number, teamId: string) => {
        if (teamId) {
            setPlayerTeams({ ...playerTeams, [userId]: Number(teamId) });
        } else {
            const newTeams = { ...playerTeams };
            delete newTeams[userId];
            setPlayerTeams(newTeams);
        }
    };

    const handleSubmit = () => {
        const teamAPlayers = Object.keys(playerTeams)
            .filter((userId) => playerTeams[Number(userId)] === match.team_a.id)
            .map(Number);

        const teamBPlayers = Object.keys(playerTeams)
            .filter((userId) => playerTeams[Number(userId)] === match.team_b.id)
            .map(Number);

        setProcessing(true);
        router.post(`/matches/${match.id}/assign-teams`, {
            team_a_players: teamAPlayers,
            team_b_players: teamBPlayers,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const teamACount = Object.values(playerTeams).filter((teamId) => teamId === match.team_a.id).length;
    const teamBCount = Object.values(playerTeams).filter((teamId) => teamId === match.team_b.id).length;
    const canSubmit = teamACount > 0 && teamBCount > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Montar Times" />
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Montar Times</h1>
                    <p className="text-muted-foreground">
                        Primeiro confirme os jogadores, depois distribua entre os times
                    </p>
                </div>

                {/* Seção 1: Confirmação de Presença */}
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Confirmar Presença dos Jogadores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {allPlayers.map((player) => {
                                const isConfirmed = !!confirmationMap[player.id];

                                return (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span className="font-medium">{player.name}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={isConfirmed}
                                                onCheckedChange={(checked) =>
                                                    handleToggleConfirmation(player.id, checked === true)
                                                }
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {isConfirmed ? 'Confirmado' : 'Não confirmado'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Seção 2: Resumo dos Times */}
                <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto w-full">
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full"
                                    style={{ backgroundColor: match.team_a.color }}
                                />
                                <span className="font-semibold">{match.team_a.name}</span>
                            </div>
                            <span className="text-2xl font-bold">{teamACount}</span>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full"
                                    style={{ backgroundColor: match.team_b.color }}
                                />
                                <span className="font-semibold">{match.team_b.name}</span>
                            </div>
                            <span className="text-2xl font-bold">{teamBCount}</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Seção 3: Distribuição dos Times */}
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowLeftRight className="h-5 w-5" />
                            Distribuir Jogadores Confirmados nos Times ({confirmedPlayers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {confirmedPlayers.map((confirmation) => {
                                const selectedTeam = playerTeams[confirmation.user.id]?.toString() || '';

                                return (
                                    <div
                                        key={confirmation.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <span className="font-medium">{confirmation.user.name}</span>
                                        </div>

                                        <ToggleGroup
                                            type="single"
                                            value={selectedTeam}
                                            onValueChange={(value) => handleTeamChange(confirmation.user.id, value)}
                                            variant="outline"
                                        >
                                            <ToggleGroupItem
                                                value={match.team_a.id.toString()}
                                                className="min-w-24 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: match.team_a.color }}
                                                    />
                                                    Azul
                                                </div>
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value={match.team_b.id.toString()}
                                                className="min-w-24 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full border"
                                                        style={{ backgroundColor: match.team_b.color }}
                                                    />
                                                    Branco
                                                </div>
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit || processing}
                        size="lg"
                    >
                        <ArrowLeftRight className="mr-2 h-5 w-5" />
                        Finalizar Formação de Equipes
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

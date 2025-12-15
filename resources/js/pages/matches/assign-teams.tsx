import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
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
    confirmedPlayers: Confirmation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
    { title: 'Montar Times', href: '#' },
];

type TeamAssignment = 'team_a' | 'team_b';

export default function AssignTeams({ match, allPlayers, confirmedPlayers }: Props) {
    const [processing, setProcessing] = useState(false);

    // IDs dos jogadores confirmados (do banco)
    const confirmedIds = new Set(confirmedPlayers.map(c => c.user.id));

    // Estado local: distribuição dos times
    const [teamAssignments, setTeamAssignments] = useState<Record<number, TeamAssignment>>({});

    // Jogadores ordenados: confirmados primeiro, depois alfabético
    const sortedPlayers = [...allPlayers].sort((a, b) => {
        const aConfirmed = confirmedIds.has(a.id);
        const bConfirmed = confirmedIds.has(b.id);
        if (aConfirmed && !bConfirmed) return -1;
        if (!aConfirmed && bConfirmed) return 1;
        return a.name.localeCompare(b.name);
    });

    // Toggle confirmação (salva no banco)
    const handleToggleConfirmation = (userId: number, confirmed: boolean) => {
        router.post(`/matches/${match.id}/toggle-confirmation`, {
            user_id: userId,
            confirmed,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (!confirmed) {
                    // Se removeu confirmação, remove do time também
                    setTeamAssignments(prev => {
                        const newState = { ...prev };
                        delete newState[userId];
                        return newState;
                    });
                }
            }
        });
    };

    // Mudar time (só local)
    const handleChangeTeam = (userId: number, team: TeamAssignment | null) => {
        if (!confirmedIds.has(userId)) return; // Só confirmados podem ter time

        setTeamAssignments(prev => {
            if (team === null) {
                const newState = { ...prev };
                delete newState[userId];
                return newState;
            }
            return { ...prev, [userId]: team };
        });
    };

    // Salvar times
    const handleSubmit = () => {
        const teamAPlayers = Object.entries(teamAssignments)
            .filter(([, team]) => team === 'team_a')
            .map(([userId]) => Number(userId));

        const teamBPlayers = Object.entries(teamAssignments)
            .filter(([, team]) => team === 'team_b')
            .map(([userId]) => Number(userId));

        setProcessing(true);
        router.post(`/matches/${match.id}/assign-teams`, {
            team_a_players: teamAPlayers,
            team_b_players: teamBPlayers,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const teamACount = Object.values(teamAssignments).filter(t => t === 'team_a').length;
    const teamBCount = Object.values(teamAssignments).filter(t => t === 'team_b').length;
    const unassignedConfirmed = confirmedPlayers.filter(c => !teamAssignments[c.user.id]);

    const canSubmit = teamACount >= 7 && teamBCount >= 7;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Montar Times" />
            <div className="flex flex-col h-[calc(100vh-120px)]">
                {/* Header fixo */}
                <div className="p-4 border-b bg-background">
                    <h1 className="text-xl font-bold mb-3">Montar Times</h1>

                    {/* Resumo */}
                    <div className="flex gap-4 text-sm flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: match.team_a.color }} />
                            <span className="font-medium">{match.team_a.name}:</span>
                            <Badge variant="secondary">{teamACount}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" style={{ backgroundColor: match.team_b.color }} />
                            <span className="font-medium">{match.team_b.name}:</span>
                            <Badge variant="secondary">{teamBCount}</Badge>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                {confirmedIds.size} confirmados
                            </Badge>
                            {unassignedConfirmed.length > 0 && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                    {unassignedConfirmed.length} sem time
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de jogadores */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {sortedPlayers.map(player => {
                            const isConfirmed = confirmedIds.has(player.id);
                            const assignment = teamAssignments[player.id];

                            return (
                                <div
                                    key={player.id}
                                    className={`flex items-center gap-3 rounded-lg border p-2 transition-colors ${
                                        isConfirmed ? 'bg-background' : 'bg-muted/30'
                                    }`}
                                >
                                    {/* Checkbox de confirmação */}
                                    <Checkbox
                                        checked={isConfirmed}
                                        onCheckedChange={(checked) => handleToggleConfirmation(player.id, !!checked)}
                                        className="flex-shrink-0"
                                    />

                                    {/* Nome */}
                                    <span className={`font-medium text-sm flex-1 truncate ${!isConfirmed ? 'text-muted-foreground' : ''}`}>
                                        {player.name}
                                    </span>

                                    {/* Botões de time (só para confirmados) */}
                                    {isConfirmed && (
                                        <div className="flex rounded-lg overflow-hidden border flex-shrink-0">
                                            <button
                                                onClick={() => handleChangeTeam(player.id, assignment === 'team_a' ? null : 'team_a')}
                                                className="px-3 py-1 text-xs font-medium transition-colors"
                                                style={assignment === 'team_a'
                                                    ? { backgroundColor: match.team_a.color, color: getColorsForBackground(match.team_a.color).text }
                                                    : {}
                                                }
                                            >
                                                {match.team_a.name}
                                            </button>
                                            <button
                                                onClick={() => handleChangeTeam(player.id, assignment === 'team_b' ? null : 'team_b')}
                                                className="px-3 py-1 text-xs font-medium transition-colors border-l"
                                                style={assignment === 'team_b'
                                                    ? { backgroundColor: match.team_b.color, color: getColorsForBackground(match.team_b.color).text, border: `1px solid ${getColorsForBackground(match.team_b.color).border}` }
                                                    : {}
                                                }
                                            >
                                                {match.team_b.name}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Botão fixo */}
                <div className="p-4 border-t bg-background">
                    <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit || processing}
                        className="w-full hover:opacity-90"
                        size="lg"
                        style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                    >
                        {processing ? (
                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                            <Check className="h-5 w-5 mr-2" />
                        )}
                        Confirmar Times ({teamACount} × {teamBCount})
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}

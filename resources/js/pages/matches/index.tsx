import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Team {
    id: number;
    name: string;
    color: string;
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
    matches: {
        data: Match[];
        current_page: number;
        last_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
];

export default function MatchesIndex({ matches }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Partidas" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Partidas Anteriores</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Historico do Campeonato Semanal {new Date().getFullYear()}
                    </p>
                </div>

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
        </AppLayout>
    );
}

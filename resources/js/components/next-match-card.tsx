import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type NextMatch, type MatchConfirmation } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Users } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NextMatchCardProps {
    match: NextMatch | null;
    userConfirmation: MatchConfirmation | null;
}

export function NextMatchCard({ match, userConfirmation }: NextMatchCardProps) {
    const handleConfirmation = () => {
        if (!match) return;

        router.post(`/matches/${match.id}/confirm`, { confirmed: true }, {
            preserveScroll: true,
        });
    };

    if (!match) {
        return (
            <div data-tour="next-match" className="border-2 border-dashed border-muted rounded-xl p-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>Nenhuma partida agendada no momento</span>
                    </div>
                </div>
            </div>
        );
    }

    const scheduledDate = new Date(match.scheduled_at);
    const isUserConfirmed = userConfirmation?.is_confirmed === true;
    const hasConfirmation = userConfirmation !== null;
    const availableSlots = match.max_players - match.confirmed_count;
    const isFull = availableSlots <= 0;

    return (
        <div data-tour="next-match" className="relative overflow-hidden border-2 border-accent rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />

            <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Teams */}
                    <div className="flex items-center justify-center gap-4 md:gap-3">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                style={{ backgroundColor: match.team_a.color }}
                            >
                                {match.team_a.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">{match.team_a.name}</span>
                        </div>
                        <span className="text-xl font-black text-muted-foreground">VS</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden sm:inline">{match.team_b.name}</span>
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                style={{ backgroundColor: match.team_b.color }}
                            >
                                {match.team_b.name.charAt(0)}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col items-center md:items-start md:flex-1 gap-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-accent" />
                            <span className="font-medium">
                                {format(scheduledDate, "EEE, dd/MM 'as' HH:mm", { locale: ptBR })}
                            </span>
                            <span className="text-muted-foreground">
                                ({formatDistanceToNow(scheduledDate, { addSuffix: true, locale: ptBR })})
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                                {match.confirmed_count}/{match.max_players} confirmados
                                {!isFull && ` (${availableSlots} vaga${availableSlots !== 1 ? 's' : ''})`}
                            </span>
                        </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-2">
                        <Badge variant={isUserConfirmed ? 'default' : 'secondary'} className="hidden sm:flex">
                            {isUserConfirmed ? 'Confirmado' : hasConfirmation ? 'Espera' : 'Pendente'}
                        </Badge>

                        {!hasConfirmation && (
                            <Button onClick={handleConfirmation} size="sm">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {isFull ? 'Lista de Espera' : 'Confirmar'}
                            </Button>
                        )}

                        {hasConfirmation && (
                            <Button
                                variant={isUserConfirmed ? 'default' : 'secondary'}
                                size="sm"
                                disabled
                            >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {isUserConfirmed ? 'Confirmado' : 'Na Espera'}
                            </Button>
                        )}

                        <Button variant="outline" size="sm" asChild>
                            <Link href="/matches">
                                Ver mais
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Calendar, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface Match {
    id: number;
    scheduled_at: string;
    max_players: number;
    confirmed_count: number;
}

interface UserConfirmation {
    id: number;
    is_confirmed: boolean;
    status: string;
}

interface ConfirmationBannerProps {
    match: Match | null;
    userConfirmation: UserConfirmation | null;
}

export function ConfirmationBanner({ match, userConfirmation }: ConfirmationBannerProps) {
    const [isLoading, setIsLoading] = useState<'confirm' | 'decline' | null>(null);
    const [isDismissed, setIsDismissed] = useState(false);

    // Mostra se: há partida E (não tem confirmação OU status é 'declined') E não fechou
    const hasConfirmedOrWaiting = userConfirmation?.status === 'confirmed' || userConfirmation?.status === 'waiting';

    if (!match || hasConfirmedOrWaiting || isDismissed) {
        return null;
    }

    const scheduledDate = new Date(match.scheduled_at);
    const availableSlots = match.max_players - match.confirmed_count;
    const isFull = availableSlots <= 0;

    const handleConfirm = () => {
        setIsLoading('confirm');
        router.post(`/matches/${match.id}/confirm`, { confirmed: true }, {
            preserveScroll: true,
            onFinish: () => setIsLoading(null),
        });
    };

    return (
        <>
            {/* Overlay para mobile */}
            <div className="fixed inset-0 bg-black/60 z-40 md:hidden" />

            {/* Bottom Sheet (mobile) / Banner (desktop) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:px-4">
                <div className="bg-card border-t md:border md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-top duration-300">
                    {/* Header */}
                    <div className="bg-accent px-4 py-3 relative">
                        <div className="flex items-center justify-center gap-2 text-accent-foreground">
                            <Calendar className="h-5 w-5" />
                            <span className="font-bold text-lg">Partida Agendada!</span>
                        </div>
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors text-accent-foreground"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4 space-y-4">
                        {/* Info */}
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold capitalize">
                                {format(scheduledDate, "EEEE", { locale: ptBR })}
                            </p>
                            <p className="text-3xl font-black text-accent">
                                {format(scheduledDate, "HH:mm")}
                            </p>
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                    {match.confirmed_count}/{match.max_players}
                                    {!isFull && ` • ${availableSlots} vaga${availableSlots !== 1 ? 's' : ''}`}
                                    {isFull && ' • Lista de espera'}
                                </span>
                            </div>
                        </div>

                        {/* Botão principal */}
                        <Button
                            onClick={handleConfirm}
                            disabled={isLoading !== null}
                            className="w-full h-12 text-base font-bold"
                            size="lg"
                        >
                            {isLoading === 'confirm' ? (
                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                isFull ? 'ENTRAR NA ESPERA' : 'CONFIRMAR PRESENÇA'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

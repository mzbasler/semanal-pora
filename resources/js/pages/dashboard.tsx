import { ConfirmationBanner } from '@/components/confirmation-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { colors } from '@/config/colors';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Trophy, Icon, type LucideProps, Calendar, Vote } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface PendingMatch {
    match: {
        id: number;
        scheduled_at: string;
        max_players: number;
        confirmed_count: number;
    };
    userConfirmation: { id: number; is_confirmed: boolean; status: string } | null;
}

const SoccerBallIcon = (props: LucideProps) => (
    <Icon iconNode={soccerBall} {...props} />
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const menuCards = [
    {
        href: '/matches',
        title: 'PARTIDAS',
        subtitle: 'Ver próximas partidas',
        icon: SoccerBallIcon,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    },
    {
        href: '/standings',
        title: 'CLASSIFICAÇÃO',
        subtitle: 'Ver ranking',
        icon: Trophy,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    },
];

export default function Dashboard() {
    const { pendingMatch } = usePage<{ pendingMatch: PendingMatch | null }>().props;
    const [isLoading, setIsLoading] = useState(false);

    const hasConfirmedOrWaiting = pendingMatch?.userConfirmation?.status === 'confirmed' || pendingMatch?.userConfirmation?.status === 'waiting';
    const scheduledDate = pendingMatch?.match ? new Date(pendingMatch.match.scheduled_at) : null;
    const isFull = pendingMatch?.match ? pendingMatch.match.confirmed_count >= pendingMatch.match.max_players : false;

    const handleConfirm = () => {
        if (!pendingMatch?.match) return;
        setIsLoading(true);
        router.post(`/matches/${pendingMatch.match.id}/confirm`, { confirmed: true }, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleDecline = () => {
        if (!pendingMatch?.match) return;
        setIsLoading(true);
        router.post(`/matches/${pendingMatch.match.id}/confirm`, { confirmed: false }, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="h-full flex-1 flex flex-col gap-3 p-4 overflow-hidden">
                {/* Card de próxima partida - full width */}
                {scheduledDate && (
                    <Card
                        variant="ghost"
                        className="shrink-0 border transition-all duration-300 bg-card"
                        style={{
                            borderColor: hasConfirmedOrWaiting ? colors.actions.success : colors.actions.primary,
                        }}
                    >
                        <CardContent className="p-3 sm:p-4">
                            {/* Mobile: empilhado */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        className="flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg shadow-lg"
                                        style={{ backgroundColor: hasConfirmedOrWaiting ? colors.actions.success : colors.actions.primary }}
                                    >
                                        <Calendar className="h-6 w-6 sm:h-5 sm:w-5" style={{ color: hasConfirmedOrWaiting ? colors.actions.successText : colors.actions.primaryText }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-sm font-black tracking-wide capitalize">
                                            {format(scheduledDate, "EEEE", { locale: ptBR })} às {format(scheduledDate, "HH:mm")}
                                        </h3>
                                        <p
                                            className="text-sm sm:text-xs font-semibold"
                                            style={{ color: hasConfirmedOrWaiting ? colors.actions.success : colors.actions.primary }}
                                        >
                                            {hasConfirmedOrWaiting
                                                ? pendingMatch?.userConfirmation?.status === 'confirmed'
                                                    ? '✓ Presença confirmada'
                                                    : '⏳ Na lista de espera'
                                                : 'Aguardando confirmação'
                                            }
                                        </p>
                                    </div>
                                </div>
                                {hasConfirmedOrWaiting ? (
                                    <Button
                                        onClick={handleDecline}
                                        disabled={isLoading}
                                        variant="outline"
                                        className="w-full sm:w-auto shrink-0 font-bold text-red-500 border-red-500/80 hover:bg-red-500 hover:text-white hover:border-red-500"
                                    >
                                        {isLoading ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'CANCELAR'
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto shrink-0 font-bold hover:opacity-90"
                                        style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                                    >
                                        {isLoading ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            isFull ? 'ENTRAR NA ESPERA' : 'CONFIRMAR PRESENÇA'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cards de navegação */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 min-h-0">
                    {menuCards.map((card) => {
                        const CardIcon = card.icon;
                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group relative overflow-hidden rounded-xl border border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-accent"
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
                                <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-3">
                                    <div className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-lg">
                                        <CardIcon className="h-5 w-5 sm:h-4 sm:w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-sm font-black tracking-wider text-white drop-shadow-lg">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-white/70 mt-0.5 sm:hidden">
                                            {card.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Card de Votações - desativado */}
                    <div className="group relative overflow-hidden rounded-xl border border-[#0D1B4C]/30 dark:border-border bg-muted/50 opacity-50 cursor-not-allowed col-span-2 md:col-span-1">
                        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-3">
                            <div className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shadow-lg">
                                <Vote className="h-5 w-5 sm:h-4 sm:w-4" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-sm font-black tracking-wider text-muted-foreground drop-shadow-lg">
                                    VOTAÇÕES
                                </h3>
                                <p className="text-xs text-muted-foreground/70 mt-0.5 sm:hidden">
                                    Em breve
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {pendingMatch && (
                <ConfirmationBanner
                    match={pendingMatch.match}
                    userConfirmation={pendingMatch.userConfirmation}
                />
            )}
        </AppLayout>
    );
}

import { ConfirmationBanner } from '@/components/confirmation-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colors } from '@/config/colors';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Trophy, Icon, type LucideProps, Calendar, Vote, Radio } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';

interface PendingMatch {
    match: {
        id: number;
        scheduled_at: string;
        max_players: number;
        confirmed_count: number;
    };
    userConfirmation: { id: number; is_confirmed: boolean; status: string } | null;
}

interface Team {
    id: number;
    name: string;
    color: string;
}

interface MatchPlayer {
    id: number;
    user: { id: number; name: string };
    team: Team;
    goals: number;
    assists: number;
}

interface LiveMatch {
    id: number;
    scheduled_at: string;
    team_a: Team;
    team_b: Team;
    players: MatchPlayer[];
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
        href: '/live',
        title: 'AO VIVO',
        subtitle: 'Acompanhar partida',
        icon: Radio,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    },
    {
        href: '/matches',
        title: 'PARTIDAS',
        subtitle: 'Ver historico',
        icon: SoccerBallIcon,
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    },
    {
        href: '/standings',
        title: 'CLASSIFICAÇÃO',
        subtitle: 'Ver ranking',
        icon: Trophy,
        image: 'https://s2-ge.glbimg.com/zT-DS_e-5HGvAMGOWiDG5nQI7EI=/0x0:5704x3320/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2025/h/l/0ZLkCQT7aBIkwW7pTBmA/2025-12-17t201323z-139163107-up1elch1k6a9z-rtrmadp-3-soccer-intercontinental-psg-fla.jpg',
    },
];

export default function Dashboard() {
    const { pendingMatch, liveMatch } = usePage<{ pendingMatch: PendingMatch | null; liveMatch: LiveMatch | null }>().props;
    const [isLoading, setIsLoading] = useState(false);

    const hasConfirmedOrWaiting = pendingMatch?.userConfirmation?.status === 'confirmed' || pendingMatch?.userConfirmation?.status === 'waiting';
    const hasDeclined = pendingMatch?.userConfirmation?.status === 'declined';
    const scheduledDate = pendingMatch?.match ? new Date(pendingMatch.match.scheduled_at) : null;
    const isFull = pendingMatch?.match ? pendingMatch.match.confirmed_count >= pendingMatch.match.max_players : false;

    // Calcular placar da partida ao vivo
    const teamAScore = liveMatch?.players?.filter(p => p.team.id === liveMatch.team_a.id).reduce((sum, p) => sum + p.goals, 0) || 0;
    const teamBScore = liveMatch?.players?.filter(p => p.team.id === liveMatch.team_b.id).reduce((sum, p) => sum + p.goals, 0) || 0;

    // Artilheiros e assistentes da partida ao vivo
    const liveScorers = liveMatch?.players?.filter(p => p.goals > 0).sort((a, b) => b.goals - a.goals) || [];
    const liveAssisters = liveMatch?.players?.filter(p => p.assists > 0).sort((a, b) => b.assists - a.assists) || [];

    // Auto-refresh para partida ao vivo
    useEffect(() => {
        if (!liveMatch) return;
        const interval = setInterval(() => {
            router.reload({ only: ['liveMatch'] });
        }, 10000);
        return () => clearInterval(interval);
    }, [liveMatch]);

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
                            borderColor: hasConfirmedOrWaiting ? colors.actions.success : hasDeclined ? '#ef4444' : colors.actions.primary,
                        }}
                    >
                        <CardContent className="p-3 sm:p-4">
                            {/* Mobile: empilhado */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        className="flex h-12 w-12 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg shadow-lg"
                                        style={{ backgroundColor: hasConfirmedOrWaiting ? colors.actions.success : hasDeclined ? '#ef4444' : colors.actions.primary }}
                                    >
                                        <Calendar className="h-6 w-6 sm:h-5 sm:w-5" style={{ color: hasConfirmedOrWaiting ? colors.actions.successText : '#ffffff' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-sm font-black tracking-wide capitalize">
                                            {format(scheduledDate, "EEEE", { locale: ptBR })} às {format(scheduledDate, "HH:mm")}
                                        </h3>
                                        <p
                                            className="text-sm sm:text-xs font-semibold"
                                            style={{ color: hasConfirmedOrWaiting ? colors.actions.success : hasDeclined ? '#ef4444' : colors.actions.primary }}
                                        >
                                            {hasConfirmedOrWaiting
                                                ? pendingMatch?.userConfirmation?.status === 'confirmed'
                                                    ? '✓ Presença confirmada'
                                                    : '⏳ Na lista de espera'
                                                : hasDeclined
                                                    ? 'Não vou jogar'
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
                                            'NÃO JOGAR'
                                        )}
                                    </Button>
                                ) : hasDeclined ? (
                                    <Button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto shrink-0 font-bold hover:opacity-90"
                                        style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                                    >
                                        {isLoading ? (
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'JOGAR'
                                        )}
                                    </Button>
                                ) : (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            onClick={handleDecline}
                                            disabled={isLoading}
                                            variant="outline"
                                            className="flex-1 sm:flex-none shrink-0 font-bold hover:bg-red-500 hover:text-white hover:border-red-500"
                                        >
                                            {isLoading ? (
                                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                'NÃO JOGAR'
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleConfirm}
                                            disabled={isLoading}
                                            className="flex-1 sm:flex-none shrink-0 font-bold hover:opacity-90"
                                            style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}
                                        >
                                            {isLoading ? (
                                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                'JOGAR'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Card de partida ao vivo */}
                {liveMatch && (
                    <Link href="/live" className="block">
                        <Card
                            variant="ghost"
                            className="shrink-0 border-2 border-red-500 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
                        >
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 animate-pulse">
                                            <Radio className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-black tracking-wide">AO VIVO</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="h-10 w-10 rounded-full shadow"
                                                style={{ backgroundColor: liveMatch.team_a.color }}
                                            />
                                            <span className="text-[10px] font-medium mt-1">{liveMatch.team_a.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-bold">{teamAScore}</span>
                                            <span className="text-lg text-muted-foreground font-medium">x</span>
                                            <span className="text-3xl font-bold">{teamBScore}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="h-10 w-10 rounded-full border border-gray-300 shadow"
                                                style={{ backgroundColor: liveMatch.team_b.color }}
                                            />
                                            <span className="text-[10px] font-medium mt-1">{liveMatch.team_b.name}</span>
                                        </div>
                                    </div>
                                    {/* Estatísticas */}
                                    {(liveScorers.length > 0 || liveAssisters.length > 0) && (
                                        <div className="flex flex-col gap-1 mt-3 text-[10px] text-muted-foreground">
                                            {liveScorers.length > 0 && (
                                                <div>
                                                    <span className="font-semibold">Gols: </span>
                                                    {liveScorers.slice(0, 3).map((p, i) => (
                                                        <span key={p.id}>{i > 0 && ', '}{p.user.name} ({p.goals})</span>
                                                    ))}
                                                </div>
                                            )}
                                            {liveAssisters.length > 0 && (
                                                <div>
                                                    <span className="font-semibold">Assist: </span>
                                                    {liveAssisters.slice(0, 3).map((p, i) => (
                                                        <span key={p.id}>{i > 0 && ', '}{p.user.name} ({p.assists})</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="text-[10px] text-muted-foreground mt-2">Toque para acompanhar</div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* Cards de navegação */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 min-h-0">
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
                    <div className="group relative overflow-hidden rounded-xl border border-[#0D1B4C]/30 dark:border-border bg-muted/50 opacity-50 cursor-not-allowed">
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

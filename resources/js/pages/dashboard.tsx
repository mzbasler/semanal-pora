import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type DashboardProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Trophy, Icon, type LucideProps } from 'lucide-react';
import { soccerBall } from '@lucide/lab';
import { NextMatchCard } from '@/components/next-match-card';

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

export default function Dashboard({
    nextMatch,
    userConfirmation,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <NextMatchCard
                    match={nextMatch}
                    userConfirmation={userConfirmation}
                />

                <div className="grid w-full gap-4 md:grid-cols-2">
                    {menuCards.map((card) => {
                        const CardIcon = card.icon;
                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-accent"
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
                                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                                        <CardIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-wider text-white drop-shadow-lg">
                                            {card.title}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-white/80">
                                            {card.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

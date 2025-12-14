import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Vote } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Election {
    id: number;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string;
    status: string;
    votes_count: number;
}

interface Props {
    elections: {
        data: Election[];
    };
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Eleições', href: '/elections' },
];

const statusLabels: Record<string, string> = {
    scheduled: 'Agendada',
    active: 'Em Andamento',
    completed: 'Finalizada',
    cancelled: 'Cancelada',
};

const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    active: 'bg-green-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500',
};

export default function ElectionsIndex({ elections, auth }: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';

    // Eleição em destaque: ativa primeiro, senão agendada, senão nenhuma
    const featuredElection =
        elections.data.find((e) => e.status === 'active') ||
        elections.data.find((e) => e.status === 'scheduled');

    const otherElections = elections.data.filter(
        (e) => e.id !== featuredElection?.id
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Eleições" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    {isAdmin && (
                        <Link href="/elections/create">
                            <Button>Nova Eleição</Button>
                        </Link>
                    )}
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-bold">Eleições</h1>
                        <p className="text-muted-foreground">Campeonato Semanal {new Date().getFullYear()}</p>
                    </div>
                    {isAdmin && <div className="w-[120px]"></div>}
                </div>

                {/* Eleição em Destaque (Ativa ou Agendada) */}
                {featuredElection && (
                    <div>
                        <div className="mb-4 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {format(new Date(featuredElection.starts_at), "dd 'de' MMMM", {
                                        locale: ptBR,
                                    })}{' '}
                                    -{' '}
                                    {format(new Date(featuredElection.ends_at), "dd 'de' MMMM 'às' HH'h'mm", {
                                        locale: ptBR,
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4 text-center">
                            <h2 className="text-2xl font-bold">{featuredElection.title}</h2>
                            {featuredElection.description && (
                                <p className="mt-2 text-muted-foreground">{featuredElection.description}</p>
                            )}
                        </div>

                        <Card className="mx-auto max-w-md">
                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    {featuredElection.status === 'active' ? (
                                        <Badge className="bg-green-500">Em Andamento</Badge>
                                    ) : (
                                        <Badge className="bg-blue-500">Agendada</Badge>
                                    )}
                                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Vote className="h-4 w-4" />
                                        {featuredElection.votes_count} votos
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {featuredElection.status === 'active' ? (
                                        <>
                                            <Link href={`/elections/${featuredElection.id}/vote`}>
                                                <Button className="w-full">Votar Agora</Button>
                                            </Link>
                                            <Link href={`/elections/${featuredElection.id}`}>
                                                <Button variant="outline" className="w-full">
                                                    Ver Detalhes
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href={`/elections/${featuredElection.id}`}>
                                            <Button variant="outline" className="w-full">
                                                Ver Detalhes
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Outras Eleições */}
                {otherElections.length > 0 && (
                    <>
                        <div className="text-center mt-12">
                            <h2 className="text-3xl font-bold">Outras Eleições</h2>
                            <p className="text-sm text-muted-foreground">Histórico e agendadas</p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {otherElections.map((election) => (
                                <Card key={election.id} className="group cursor-pointer transition-all hover:border-primary">
                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <Badge className={statusColors[election.status]}>
                                                {statusLabels[election.status]}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Vote className="h-3 w-3" />
                                                {election.votes_count}
                                            </span>
                                        </div>

                                        <h3 className="mb-2 font-bold">{election.title}</h3>

                                        <div className="mb-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {format(new Date(election.starts_at), "dd/MM/yyyy", {
                                                        locale: ptBR,
                                                    })}{' '}
                                                    -{' '}
                                                    {format(new Date(election.ends_at), "dd/MM/yyyy", {
                                                        locale: ptBR,
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <Link href={`/elections/${election.id}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Ver Detalhes
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {elections.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Vote className="mb-4 h-16 w-16 text-muted-foreground" />
                            <p className="text-lg font-semibold">Nenhuma eleição encontrada</p>
                            <p className="text-muted-foreground">Comece criando a primeira eleição</p>
                            {isAdmin && (
                                <Link href="/elections/create" className="mt-4">
                                    <Button>Criar primeira eleição</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
    id: number;
    name: string;
}

interface Vote {
    id: number;
    president_candidate: User;
    vice_president_candidate: User;
}

interface Election {
    id: number;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string;
    status: string;
    president_votes: number;
    vice_president_votes: number;
}

interface Props {
    election: Election;
    userVote: Vote | null;
    canVote: boolean;
    auth: {
        user: {
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Eleições', href: '/elections' },
    { title: 'Detalhes', href: '#' },
];

export default function ElectionShow({ election, userVote, canVote, auth }: Props) {
    const isAdmin = auth.user.role === 'president' || auth.user.role === 'vice_president';
    const canViewResults = election.status === 'completed' || isAdmin;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={election.title} />
            <div className="flex flex-col gap-6 p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-3xl">{election.title}</CardTitle>
                                {election.description && (
                                    <CardDescription className="mt-2 text-base">{election.description}</CardDescription>
                                )}
                                <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Início: {format(new Date(election.starts_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Término: {format(new Date(election.ends_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </span>
                                </div>
                            </div>
                            <Badge
                                variant={election.status === 'active' ? 'default' : 'secondary'}
                                className="text-base"
                            >
                                {election.status === 'active' ? 'Em Andamento' : election.status === 'completed' ? 'Finalizada' : 'Agendada'}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {userVote && (
                    <Card className="border-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Voto Registrado
                            </CardTitle>
                            <CardDescription>Você já votou nesta eleição</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Presidente</p>
                                <p className="text-lg font-semibold">{userVote.president_candidate.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Vice-Presidente</p>
                                <p className="text-lg font-semibold">{userVote.vice_president_candidate.name}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {canVote && !userVote && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pronto para votar?</CardTitle>
                            <CardDescription>
                                Vote nos candidatos para presidente e vice-presidente do grupo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/elections/${election.id}/vote`}>
                                <Button size="lg" className="w-full">
                                    Votar Agora
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {canViewResults && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Resultados</CardTitle>
                            <CardDescription>
                                {election.status === 'completed' ? 'Resultado final da eleição' : 'Resultados parciais'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/elections/${election.id}/results`}>
                                <Button variant="outline" className="w-full">
                                    Ver Resultados
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

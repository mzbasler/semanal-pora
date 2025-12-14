import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trophy, Award } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Result {
    vote_count: number;
    president_candidate?: User;
    vice_president_candidate?: User;
}

interface Election {
    id: number;
    title: string;
    status: string;
}

interface Props {
    election: Election;
    presidentResults: Result[];
    vicePresidentResults: Result[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Eleições', href: '/elections' },
    { title: 'Resultados', href: '#' },
];

export default function ElectionResults({ election, presidentResults, vicePresidentResults }: Props) {
    const totalPresidentVotes = presidentResults.reduce((sum, r) => sum + r.vote_count, 0);
    const totalVicePresidentVotes = vicePresidentResults.reduce((sum, r) => sum + r.vote_count, 0);

    const renderResults = (results: Result[], totalVotes: number, type: 'president' | 'vice') => {
        if (results.length === 0) {
            return <p className="text-center text-muted-foreground">Nenhum voto registrado ainda</p>;
        }

        return (
            <div className="space-y-4">
                {results.map((result, index) => {
                    const candidate = type === 'president' ? result.president_candidate : result.vice_president_candidate;
                    const percentage = totalVotes > 0 ? (result.vote_count / totalVotes) * 100 : 0;
                    const isWinner = index === 0 && election.status === 'completed';

                    return (
                        <div key={candidate?.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isWinner && (
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                    )}
                                    {!isWinner && index < 3 && (
                                        <Award className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="font-semibold">{candidate?.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        {result.vote_count} {result.vote_count === 1 ? 'voto' : 'votos'}
                                    </span>
                                    <Badge variant={isWinner ? 'default' : 'secondary'}>
                                        {percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Resultados - ${election.title}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Resultados - {election.title}</h1>
                    <p className="text-muted-foreground">
                        {election.status === 'completed' ? 'Resultado final' : 'Resultados parciais'}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Presidente</CardTitle>
                            <CardDescription>
                                {totalPresidentVotes} {totalPresidentVotes === 1 ? 'voto' : 'votos'} registrado
                                {totalPresidentVotes !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderResults(presidentResults, totalPresidentVotes, 'president')}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vice-Presidente</CardTitle>
                            <CardDescription>
                                {totalVicePresidentVotes} {totalVicePresidentVotes === 1 ? 'voto' : 'votos'} registrado
                                {totalVicePresidentVotes !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderResults(vicePresidentResults, totalVicePresidentVotes, 'vice')}
                        </CardContent>
                    </Card>
                </div>

                {election.status === 'completed' && presidentResults.length > 0 && vicePresidentResults.length > 0 && (
                    <Card className="border-green-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <Trophy className="h-6 w-6" />
                                Vencedores
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Presidente Eleito</p>
                                <p className="text-2xl font-bold">{presidentResults[0]?.president_candidate?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Vice-Presidente Eleito</p>
                                <p className="text-2xl font-bold">{vicePresidentResults[0]?.vice_president_candidate?.name}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Election {
    id: number;
    title: string;
    description: string | null;
}

interface Props {
    election: Election;
    candidates: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Eleições', href: '/elections' },
    { title: 'Votar', href: '#' },
];

export default function VoteCreate({ election, candidates }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        president_candidate_id: '',
        vice_president_candidate_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/elections/${election.id}/vote`);
    };

    const isSameCandidate = data.president_candidate_id === data.vice_president_candidate_id && data.president_candidate_id !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Votar - ${election.title}`} />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">{election.title}</h1>
                    <p className="text-muted-foreground">Escolha seus candidatos para presidente e vice-presidente</p>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Seu Voto</CardTitle>
                        <CardDescription>
                            Selecione um candidato diferente para cada cargo. Seu voto é secreto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {isSameCandidate && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Você deve escolher candidatos diferentes para presidente e vice-presidente.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="president">Candidato a Presidente *</Label>
                                <Select
                                    value={data.president_candidate_id}
                                    onValueChange={(value) => setData('president_candidate_id', value)}
                                >
                                    <SelectTrigger id="president">
                                        <SelectValue placeholder="Selecione um candidato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates.map((candidate) => (
                                            <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                                {candidate.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.president_candidate_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vice_president">Candidato a Vice-Presidente *</Label>
                                <Select
                                    value={data.vice_president_candidate_id}
                                    onValueChange={(value) => setData('vice_president_candidate_id', value)}
                                >
                                    <SelectTrigger id="vice_president">
                                        <SelectValue placeholder="Selecione um candidato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates.map((candidate) => (
                                            <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                                {candidate.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.vice_president_candidate_id} />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing || isSameCandidate || !data.president_candidate_id || !data.vice_president_candidate_id}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Confirmar Voto
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

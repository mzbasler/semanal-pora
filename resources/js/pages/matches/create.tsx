import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { colors } from '@/config/colors';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Partidas', href: '/matches' },
    { title: 'Nova Partida', href: '#' },
];

export default function MatchCreate() {
    const { data, setData, post, processing, errors } = useForm({
        scheduled_at: '',
        max_players: 20,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/matches');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Partida" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Nova Partida</h1>
                    <p className="text-muted-foreground">Agende uma nova partida do campeonato</p>
                </div>

                <Card className="mx-auto w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informações da Partida</CardTitle>
                        <CardDescription>
                            Defina a data e horário da partida. Os times serão sorteados automaticamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="scheduled_at">Data e Horário</Label>
                                <Input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={data.scheduled_at}
                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                    required
                                />
                                <InputError message={errors.scheduled_at} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_players">Número Máximo de Jogadores</Label>
                                <Input
                                    id="max_players"
                                    type="number"
                                    min="2"
                                    max="100"
                                    value={data.max_players}
                                    onChange={(e) => setData('max_players', parseInt(e.target.value))}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Jogadores que confirmarem após o limite irão para lista de espera
                                </p>
                                <InputError message={errors.max_players} />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing} className="flex-1 hover:opacity-90" style={{ backgroundColor: colors.actions.primary, color: colors.actions.primaryText }}>
                                    Criar Partida
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

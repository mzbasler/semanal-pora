import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';

interface Props {
    players: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Jogadores', href: '/players' },
];

export default function PlayersIndex({ players }: Props) {
    const handleDelete = (player: User) => {
        if (confirm(`Tem certeza que deseja remover ${player.name}?`)) {
            router.delete(`/players/${player.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jogadores" />
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Jogadores</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Gerencie os jogadores cadastrados</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/players/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Jogador
                        </Link>
                    </Button>
                </div>

                <Card variant="ghost">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Users className="h-5 w-5" />
                            Lista de Jogadores
                        </CardTitle>
                        <CardDescription>
                            {players.length} jogador{players.length !== 1 ? 'es' : ''} cadastrado{players.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        {players.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-3 text-left font-semibold">Nome</th>
                                                <th className="p-3 text-left font-semibold">Email</th>
                                                <th className="p-3 text-left font-semibold">Cadastrado em</th>
                                                <th className="p-3 text-right font-semibold">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players.map((player) => (
                                                <tr
                                                    key={player.id}
                                                    className="border-b transition-colors hover:bg-muted/50 last:border-0"
                                                >
                                                    <td className="p-3 font-medium">{player.name}</td>
                                                    <td className="p-3 text-muted-foreground">{player.email}</td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {new Date(player.created_at).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/players/${player.id}/edit`}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(player)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {players.map((player) => (
                                        <div
                                            key={player.id}
                                            className="flex items-center justify-between rounded-lg border bg-card p-4"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium">{player.name}</p>
                                                <p className="truncate text-sm text-muted-foreground">{player.email}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/players/${player.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(player)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                Nenhum jogador cadastrado ainda
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Trophy } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface PlayerStats {
    user_id: number;
    user: User;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    total_goals: number;
    total_assists: number;
    points: number;
    aproveitamento: number;
}

export default function Welcome({
    canRegister = true,
    standings = [],
}: {
    canRegister?: boolean;
    standings?: PlayerStats[];
}) {
    const { auth } = usePage<SharedData>().props;

    const getMedalColor = (position: number) => {
        if (position === 1) return 'text-yellow-400';
        if (position === 2) return 'text-gray-300';
        if (position === 3) return 'text-amber-500';
        return 'text-white/60';
    };

    return (
        <>
            <Head title="Semanal do Porã - Futebol">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=bebas-neue:400|inter:400,500,600,700" rel="stylesheet" />
                <style>{`html, body { background-color: #0a0a0a !important; }`}</style>
            </Head>

            <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover opacity-60"
                    >
                        <source src="/videos/soccer.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                </div>

                <div className="relative z-10 flex h-screen flex-col">
                    <header className="flex items-center justify-between p-6 lg:px-12">
                        <div className="flex items-center gap-3">
                            <img src="/images/emblema-logo.svg" alt="Emblema" className="h-12 w-12" />
                            <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                Semanal do Porã
                            </span>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={dashboard()} className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-[#0D1B4C] transition-all hover:bg-yellow-300">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white">
                                        Entrar
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()} className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-[#0D1B4C] transition-all hover:bg-yellow-300">
                                            Registrar
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="max-w-4xl">
                            <img src="/images/emblema-logo.svg" alt="Emblema" className="mx-auto mb-6 h-32 w-32 sm:h-40 sm:w-40" />

                            <h1 className="mb-2 text-5xl leading-tight font-bold tracking-tight text-white sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                SEMANAL DO PORÃ
                            </h1>
                            <p className="mb-6 text-3xl text-yellow-400 font-bold sm:text-4xl lg:text-5xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                #nãoésófutebol
                            </p>

                            <p className="mx-auto mb-8 max-w-2xl text-lg text-white sm:text-xl">
                                Organize o racha, sorteie os times, vote nos craques e acompanhe quem tá voando.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link href={dashboard()} className="group flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-lg font-semibold text-[#0D1B4C] transition-all hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30">
                                        Entrar no Sistema
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={register()} className="group flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-lg font-semibold text-[#0D1B4C] transition-all hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30">
                                            Criar Minha Conta
                                        </Link>
                                        <Link href={login()} className="rounded-full border-2 border-[#0D1B4C] bg-[#0D1B4C] px-8 py-4 text-lg font-semibold text-yellow-400 transition-all hover:bg-[#0D1B4C]/80">
                                            Já tenho conta
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-black/40 border border-border p-5 backdrop-blur-sm">
                                <h3 className="mb-1 text-base font-semibold text-yellow-400">Confirme Presença</h3>
                                <p className="text-sm text-white/70">Veja as próximas partidas e confirme se vai jogar</p>
                            </div>
                            <div className="rounded-2xl bg-black/40 border border-border p-5 backdrop-blur-sm">
                                <h3 className="mb-1 text-base font-semibold text-yellow-400">Times Equilibrados</h3>
                                <p className="text-sm text-white/70">Sorteio justo pra ninguém reclamar depois</p>
                            </div>
                            <div className="rounded-2xl bg-black/40 border border-border p-5 backdrop-blur-sm">
                                <h3 className="mb-1 text-base font-semibold text-yellow-400">Eleição do Craque</h3>
                                <p className="text-sm text-white/70">Vote em quem jogou mais bola na semana</p>
                            </div>
                        </div>
                    </main>
                </div>

                {/* Seção de Classificação */}
                <section className="relative z-10 px-6 py-16" style={{ backgroundColor: '#f8fafc' }}>
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-[#0D1B4C] sm:text-4xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                    CLASSIFICAÇÃO <span className="text-[#0D1B4C]">GERAL</span>
                                </h2>
                                <p className="mt-2 text-gray-500">Ranking completo dos jogadores</p>
                            </div>

                            <Card className="bg-transparent shadow-none border border-[#0D1B4C]">
                                <CardHeader>
                                    <CardTitle className="text-black">Tabela de Classificação</CardTitle>
                                    <CardDescription className="text-black/60">Ordenado por pontos, vitórias e saldo de gols</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {standings.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-black">
                                                <thead>
                                                    <tr className="border-b border-black/20">
                                                        <th className="p-3 text-left font-semibold">#</th>
                                                        <th className="p-3 text-left font-semibold">Jogador</th>
                                                        <th className="p-3 text-center font-semibold">Pts</th>
                                                        <th className="p-3 text-center font-semibold">J</th>
                                                        <th className="p-3 text-center font-semibold">V</th>
                                                        <th className="p-3 text-center font-semibold">E</th>
                                                        <th className="p-3 text-center font-semibold">D</th>
                                                        <th className="hidden p-3 text-center font-semibold sm:table-cell">GP</th>
                                                        <th className="hidden p-3 text-center font-semibold sm:table-cell">GC</th>
                                                        <th className="p-3 text-center font-semibold">SG</th>
                                                        <th className="hidden p-3 text-center font-semibold md:table-cell">Gols</th>
                                                        <th className="hidden p-3 text-center font-semibold md:table-cell">Ass</th>
                                                        <th className="p-3 text-center font-semibold">%</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {standings.map((player, index) => {
                                                        const position = index + 1;
                                                        const medalColor = position === 1 ? 'text-yellow-500' : position === 2 ? 'text-gray-400' : position === 3 ? 'text-amber-600' : 'text-gray-500';
                                                        return (
                                                            <tr
                                                                key={player.user_id}
                                                                className="border-b border-black/10 transition-colors hover:bg-gray-100 last:border-0"
                                                            >
                                                                <td className="p-3">
                                                                    <div className="flex items-center gap-2">
                                                                        {position <= 3 ? (
                                                                            <Trophy className={`h-5 w-5 ${medalColor}`} />
                                                                        ) : (
                                                                            <span className="text-gray-500">{position}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="p-3 font-medium">{player.user.name}</td>
                                                                <td className="p-3 text-center">
                                                                    <Badge className="bg-green-600">{player.points}</Badge>
                                                                </td>
                                                                <td className="p-3 text-center">{player.matches_played}</td>
                                                                <td className="p-3 text-center font-semibold text-green-600">{player.wins}</td>
                                                                <td className="p-3 text-center font-semibold text-yellow-600">{player.draws}</td>
                                                                <td className="p-3 text-center font-semibold text-red-600">{player.losses}</td>
                                                                <td className="hidden p-3 text-center sm:table-cell">{player.goals_for}</td>
                                                                <td className="hidden p-3 text-center sm:table-cell">{player.goals_against}</td>
                                                                <td className="p-3 text-center">
                                                                    <span className={player.goal_difference > 0 ? 'font-semibold text-green-600' : player.goal_difference < 0 ? 'font-semibold text-red-600' : ''}>
                                                                        {player.goal_difference > 0 && '+'}{player.goal_difference}
                                                                    </span>
                                                                </td>
                                                                <td className="hidden p-3 text-center md:table-cell">
                                                                    <Badge variant="secondary">{player.total_goals}</Badge>
                                                                </td>
                                                                <td className="hidden p-3 text-center md:table-cell">
                                                                    <Badge variant="outline">{player.total_assists}</Badge>
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    <Badge variant={player.aproveitamento >= 70 ? 'default' : player.aproveitamento >= 50 ? 'secondary' : 'outline'}>
                                                                        {player.aproveitamento.toFixed(1)}%
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center text-black/50">
                                            Nenhuma estatística disponível ainda
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="mt-6 bg-transparent shadow-none border border-[#0D1B4C]">
                                <CardHeader>
                                    <CardTitle className="text-black">Legenda</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 text-sm text-black md:grid-cols-2 lg:grid-cols-3">
                                        <div><span className="font-semibold">Pts:</span> Pontos</div>
                                        <div><span className="font-semibold">J:</span> Jogos</div>
                                        <div><span className="font-semibold">V:</span> Vitórias</div>
                                        <div><span className="font-semibold">E:</span> Empates</div>
                                        <div><span className="font-semibold">D:</span> Derrotas</div>
                                        <div><span className="font-semibold">GP:</span> Gols Pró</div>
                                        <div><span className="font-semibold">GC:</span> Gols Contra</div>
                                        <div><span className="font-semibold">SG:</span> Saldo de Gols</div>
                                        <div><span className="font-semibold">Gols:</span> Gols Marcados</div>
                                        <div><span className="font-semibold">Ass:</span> Assistências</div>
                                        <div><span className="font-semibold">%:</span> Aproveitamento</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </section>

                <footer className="relative z-10 p-6 text-center text-sm text-white/40" style={{ backgroundColor: '#0a0a0a' }}>
                    <p>Semanal do Porã - Organize seu futebol semanal</p>
                </footer>
            </div>
        </>
    );
}

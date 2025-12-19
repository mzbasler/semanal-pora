import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Trophy, Volume2, VolumeX, Target, Users, Clock, Maximize2, Minimize2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { colors } from '@/config/colors';

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
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const hasInteracted = useRef(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current && !hasInteracted.current) {
                hasInteracted.current = true;
                audioRef.current.muted = false;
                audioRef.current.volume = 0.3;
                audioRef.current.play().then(() => {
                    setIsMuted(false);
                }).catch(() => {});

                document.removeEventListener('click', playAudio);
                document.removeEventListener('touchstart', playAudio);
                document.removeEventListener('scroll', playAudio);
                document.removeEventListener('keydown', playAudio);
            }
        };

        // Tenta tocar imediatamente
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().then(() => {
                hasInteracted.current = true;
                setIsMuted(false);
            }).catch(() => {
                // Bloqueado - espera interação
                document.addEventListener('click', playAudio);
                document.addEventListener('touchstart', playAudio);
                document.addEventListener('scroll', playAudio);
                document.addEventListener('keydown', playAudio);
            });
        }

        return () => {
            document.removeEventListener('click', playAudio);
            document.removeEventListener('touchstart', playAudio);
            document.removeEventListener('scroll', playAudio);
            document.removeEventListener('keydown', playAudio);
        };
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.3;
                audioRef.current.play();
                setIsMuted(false);
            } else {
                audioRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

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
                <style>{`html, body { background-color: ${colors.background.dark} !important; }`}</style>
            </Head>

            <audio ref={audioRef} loop>
                <source src="/audio/west-ham-bubbles-77370.mp3" type="audio/mpeg" />
            </audio>

            <div className="relative h-svh overflow-hidden" style={{ backgroundColor: colors.background.dark }}>
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover opacity-40"
                    >
                        <source src="/videos/soccer.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
                </div>

                <div className="relative z-10 flex h-full flex-col">
                    <header className="flex items-center justify-between p-4 sm:p-6 lg:px-12">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img src="/images/emblema-logo.svg" alt="Emblema" className="h-10 w-10 sm:h-12 sm:w-12" />
                            <span className="hidden text-xl font-bold tracking-wider text-white sm:block sm:text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                Semanal do Porã
                            </span>
                        </div>

                        <nav className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={toggleFullscreen}
                                className="rounded-full p-2 transition-all sm:p-2.5 sm:hidden"
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
                                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={toggleAudio}
                                className="rounded-full p-2 transition-all sm:p-2.5"
                                style={isMuted
                                    ? { backgroundColor: colors.brand.yellow, color: colors.brand.blue }
                                    : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }
                                }
                                title={isMuted ? 'Ativar som da torcida' : 'Silenciar'}
                            >
                                {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </button>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-90 sm:px-6 sm:py-2.5 sm:text-sm"
                                    style={{ backgroundColor: colors.brand.yellow, color: colors.brand.blue }}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-90 sm:px-6 sm:py-2.5 sm:text-sm"
                                    style={{ backgroundColor: colors.brand.yellow, color: colors.brand.blue }}
                                >
                                    Entrar
                                </Link>
                            )}
                        </nav>
                    </header>

                    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
                        <div className="max-w-4xl">
                            <img src="/images/emblema-logo.svg" alt="Emblema" className="mx-auto mb-4 h-24 w-24 sm:mb-6 sm:h-32 sm:w-32 md:h-40 md:w-40" />

                            <h1 className="mb-2 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                SEMANAL DO PORÃ
                            </h1>
                            <p className="mb-4 text-2xl text-yellow-400 font-bold sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                #nãoésófutebol
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="group flex w-full items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-base font-semibold transition-all hover:opacity-90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                                    style={{ backgroundColor: colors.brand.blue, borderColor: colors.brand.blue, color: colors.brand.yellow }}
                                >
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Seção de Classificação */}
                <section className="relative z-10 px-4 py-8 sm:px-6 sm:py-16" style={{ backgroundColor: colors.background.light }}>
                        <div className="w-full">
                            <div className="mb-6 text-center sm:mb-8">
                                <h2 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                    CLASSIFICAÇÃO GERAL
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">Ranking completo dos jogadores</p>
                            </div>

                            <Card className="bg-transparent shadow-none" style={{ borderColor: colors.brand.blue, borderWidth: 1 }}>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-base text-black sm:text-lg">Tabela de Classificação</CardTitle>
                                    <CardDescription className="text-xs text-black/60 sm:text-sm">Ordenado por pontos, vitórias e saldo de gols</CardDescription>
                                </CardHeader>
                                <CardContent className="p-2 sm:p-6">
                                    {standings.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-black text-xs sm:text-sm">
                                                <thead>
                                                    <tr className="border-b border-black/20">
                                                        <th className="p-2 text-left font-semibold sm:p-3">#</th>
                                                        <th className="p-2 text-left font-semibold sm:p-3">Jogador</th>
                                                        <th className="p-2 text-center font-semibold sm:p-3">Pts</th>
                                                        <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">J</th>
                                                        <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">V</th>
                                                        <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">E</th>
                                                        <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">D</th>
                                                        <th className="hidden p-2 text-center font-semibold md:table-cell sm:p-3">GP</th>
                                                        <th className="hidden p-2 text-center font-semibold md:table-cell sm:p-3">GC</th>
                                                        <th className="hidden p-2 text-center font-semibold sm:table-cell sm:p-3">SG</th>
                                                        <th className="hidden p-2 text-center font-semibold lg:table-cell sm:p-3">Gols</th>
                                                        <th className="hidden p-2 text-center font-semibold lg:table-cell sm:p-3">Ass</th>
                                                        <th className="p-2 text-center font-semibold sm:p-3">%</th>
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
                                                                <td className="p-2 sm:p-3">
                                                                    <div className="flex items-center">
                                                                        {position <= 3 ? (
                                                                            <Trophy className={`h-4 w-4 ${medalColor}`} />
                                                                        ) : (
                                                                            <span className="text-gray-500">{position}</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="p-2 font-medium sm:p-3">{player.user.name}</td>
                                                                <td className="p-2 text-center sm:p-3">
                                                                    <Badge className="bg-green-600 text-xs">{player.points}</Badge>
                                                                </td>
                                                                <td className="hidden p-2 text-center sm:table-cell sm:p-3">{player.matches_played}</td>
                                                                <td className="hidden p-2 text-center font-semibold text-green-600 sm:table-cell sm:p-3">{player.wins}</td>
                                                                <td className="hidden p-2 text-center font-semibold text-yellow-600 sm:table-cell sm:p-3">{player.draws}</td>
                                                                <td className="hidden p-2 text-center font-semibold text-red-600 sm:table-cell sm:p-3">{player.losses}</td>
                                                                <td className="hidden p-2 text-center md:table-cell sm:p-3">{player.goals_for}</td>
                                                                <td className="hidden p-2 text-center md:table-cell sm:p-3">{player.goals_against}</td>
                                                                <td className="hidden p-2 text-center sm:table-cell sm:p-3">
                                                                    <span className={player.goal_difference > 0 ? 'font-semibold text-green-600' : player.goal_difference < 0 ? 'font-semibold text-red-600' : ''}>
                                                                        {player.goal_difference > 0 && '+'}{player.goal_difference}
                                                                    </span>
                                                                </td>
                                                                <td className="hidden p-2 text-center lg:table-cell sm:p-3">
                                                                    <Badge variant="secondary" className="text-xs">{player.total_goals}</Badge>
                                                                </td>
                                                                <td className="hidden p-2 text-center lg:table-cell sm:p-3">
                                                                    <Badge variant="outline" className="text-xs">{player.total_assists}</Badge>
                                                                </td>
                                                                <td className="p-2 text-center sm:p-3">
                                                                    <Badge className="text-xs" variant={player.aproveitamento >= 70 ? 'default' : player.aproveitamento >= 50 ? 'secondary' : 'outline'}>
                                                                        {player.aproveitamento.toFixed(0)}%
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

                            {standings.length > 0 && (() => {
                                const topScorers = [...standings]
                                    .filter(p => p.total_goals > 0)
                                    .sort((a, b) => b.total_goals - a.total_goals)
                                    .slice(0, 10);
                                const topAssisters = [...standings]
                                    .filter(p => p.total_assists > 0)
                                    .sort((a, b) => b.total_assists - a.total_assists)
                                    .slice(0, 10);
                                const getMedalColorLocal = (position: number) => {
                                    if (position === 1) return 'text-yellow-500';
                                    if (position === 2) return 'text-gray-400';
                                    if (position === 3) return 'text-amber-600';
                                    return 'text-gray-500';
                                };

                                return (
                                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                                        {/* Top 10 Artilheiros */}
                                        <Card className="bg-transparent shadow-none" style={{ borderColor: colors.brand.blue, borderWidth: 1 }}>
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
                                                    <Target className="h-4 w-4 text-yellow-500" />
                                                    Top 10 Artilheiros
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                {topScorers.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {topScorers.map((player, index) => (
                                                            <div key={player.user_id} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-5 text-sm font-bold ${getMedalColorLocal(index + 1)}`}>
                                                                        {index + 1}º
                                                                    </span>
                                                                    <span className="text-sm text-black truncate max-w-[120px]">{player.user.name}</span>
                                                                </div>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {player.total_goals} gols
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-black/50 text-center py-4">Sem dados</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Top 10 Assistências */}
                                        <Card className="bg-transparent shadow-none" style={{ borderColor: colors.brand.blue, borderWidth: 1 }}>
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
                                                    <Users className="h-4 w-4 text-yellow-500" />
                                                    Top 10 Assistências
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                {topAssisters.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {topAssisters.map((player, index) => (
                                                            <div key={player.user_id} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`w-5 text-sm font-bold ${getMedalColorLocal(index + 1)}`}>
                                                                        {index + 1}º
                                                                    </span>
                                                                    <span className="text-sm text-black truncate max-w-[120px]">{player.user.name}</span>
                                                                </div>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {player.total_assists} assist.
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-black/50 text-center py-4">Sem dados</p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Top 10 Atrasos */}
                                        <Card className="bg-transparent shadow-none" style={{ borderColor: colors.brand.blue, borderWidth: 1 }}>
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-black">
                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                    Top 10 Atrasos
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <p className="text-sm text-black/50 text-center py-4">Em breve</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })()}

                            <Card className="mt-4 bg-transparent shadow-none sm:mt-6" style={{ borderColor: colors.brand.blue, borderWidth: 1 }}>
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-sm text-black sm:text-base">Legenda</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                                    <div className="grid grid-cols-2 gap-1 text-xs text-black sm:grid-cols-3 sm:gap-2 sm:text-sm md:grid-cols-6">
                                        <div><span className="font-semibold">Pts:</span> Pontos</div>
                                        <div><span className="font-semibold">J:</span> Jogos</div>
                                        <div><span className="font-semibold">V:</span> Vitórias</div>
                                        <div><span className="font-semibold">E:</span> Empates</div>
                                        <div><span className="font-semibold">D:</span> Derrotas</div>
                                        <div><span className="font-semibold">%:</span> Aprov.</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </section>

            <footer className="p-4 text-center text-xs text-white/40 sm:p-6 sm:text-sm" style={{ backgroundColor: colors.background.dark }}>
                <p>Semanal do Porã</p>
            </footer>
        </>
    );
}

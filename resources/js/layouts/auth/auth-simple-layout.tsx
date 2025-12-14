import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=bebas-neue:400|inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="relative min-h-svh overflow-hidden bg-black">
                {/* Video Background */}
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

                {/* Content */}
                <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <img src="/images/emblema-logo.svg" alt="Emblema" className="h-16 w-16" />
                                    <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                        Semanal do Porã
                                    </span>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium text-white">{title}</h1>
                                    <p className="text-center text-sm text-white/70">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="rounded-2xl bg-black/60 border border-border p-6 backdrop-blur-sm">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

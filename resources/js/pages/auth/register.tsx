import { login } from '@/routes';
import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { colors } from '@/config/colors';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Criar uma conta"
            description="Preencha os dados abaixo para criar sua conta"
        >
            <Head title="Registrar" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-white/90">
                            Nome
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nome completo"
                            className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-white/90">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@exemplo.com"
                            className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-white/90">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Senha"
                            className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="password_confirmation" className="text-sm font-medium text-white/90">
                            Confirmar senha
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirmar senha"
                            className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 w-full rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: colors.brand.yellow, color: colors.brand.blue }}
                        tabIndex={5}
                        data-test="register-user-button"
                    >
                        {processing && <Spinner />}
                        Criar conta
                    </button>
                </div>

                <div className="text-center text-sm text-white/70">
                    Já tem uma conta?{' '}
                    <Link href={login()} tabIndex={6} className="text-yellow-400 hover:text-yellow-300">
                        Entrar
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

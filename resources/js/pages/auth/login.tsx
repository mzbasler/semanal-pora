import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Entrar na sua conta"
            description="Digite seu email e senha para acessar"
        >
            <Head title="Entrar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-white/90">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@exemplo.com"
                                    className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <label htmlFor="password" className="text-sm font-medium text-white/90">
                                        Senha
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="ml-auto text-sm text-yellow-400 hover:text-yellow-300"
                                            tabIndex={5}
                                        >
                                            Esqueceu a senha?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Senha"
                                    className="w-full rounded-lg border border-yellow-400/30 bg-black/50 px-4 py-3 text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="h-4 w-4 rounded border-yellow-400/30 bg-black/50 text-yellow-400 focus:ring-yellow-400"
                                />
                                <label htmlFor="remember" className="text-sm text-white/90">
                                    Lembrar de mim
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-[#0D1B4C] transition-all hover:bg-yellow-300 disabled:opacity-50"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Entrar
                            </button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-white/70">
                                Não tem uma conta?{' '}
                                <Link href={register()} tabIndex={5} className="text-yellow-400 hover:text-yellow-300">
                                    Cadastre-se
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}

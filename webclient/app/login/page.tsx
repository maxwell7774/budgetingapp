'use client';

import { Button } from '@/components/ui/button';
import { GithubIcon, GoogleIcon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        await authClient.signIn.email({
            email: email,
            password: password,
            callbackURL: '/',
            fetchOptions: {
                onSuccess: () => {
                    router.push('/');
                },
            },
        });
    };

    return (
        <>
            <div className="absolute top-0 left-0 right-0 h-[32rem] bg-indigo-500 dark:bg-indigo-800 -z-10 isolate"></div>
            <form
                className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8"
                onSubmit={handleSubmit}
            >
                <h1 className="text-xl font-bold text-center">
                    Sign in to start budgeting!
                </h1>
                <div>
                    <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
                        Username/Email
                    </label>
                    <Input
                        name="email"
                        type="text"
                        className="dark:bg-slate-900"
                        placeholder="type here..."
                    />
                </div>
                <div>
                    <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
                        Password
                    </label>
                    <Input
                        name="password"
                        type="password"
                        className="dark:bg-slate-900"
                        placeholder="type here..."
                    />
                </div>
                <div className="space-y-4">
                    <Button className="w-full" type="submit">
                        Login
                    </Button>
                    <div className="flex items-center justify-center gap-4">
                        <div className="border-b border-slate-300 dark:border-slate-600 flex-1"></div>
                        <p className="text-xs text-slate-400 dark:text-slate-600">
                            OR
                        </p>
                        <div className="border-b border-slate-300 dark:border-slate-600 flex-1"></div>
                    </div>
                    <Button
                        className="w-full"
                        type="button"
                        onClick={async () => {
                            await authClient.signIn.social({
                                provider: 'github',
                            });
                        }}
                    >
                        <GithubIcon className="stroke-white fill-white size-5 me-2" />
                        Sign in with Github
                    </Button>
                    <Button
                        className="w-full"
                        type="button"
                        onClick={async () => {
                            await authClient.signIn.social({
                                provider: 'google',
                            });
                        }}
                    >
                        <GoogleIcon className="stroke-white fill-white size-5 me-2" />
                        Sign in with Google
                    </Button>
                    <div className="flex items-center justify-center gap-4">
                        <div className="border-b border-slate-300 dark:border-slate-600 flex-1"></div>
                        <p className="text-xs text-slate-400 dark:text-slate-600">
                            OR
                        </p>
                        <div className="border-b border-slate-300 dark:border-slate-600 flex-1"></div>
                    </div>
                    <Button
                        className="w-full"
                        type="button"
                        variant="outline"
                        asChild
                    >
                        <Link href="/register">Create Account</Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

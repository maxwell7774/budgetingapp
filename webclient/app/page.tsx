'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const { data: session } = authClient.useSession();
    return (
        <main>
            <Button
                type="button"
                onClick={async () => {
                    await authClient.signUp.email({
                        email: 'test2@example.com',
                        name: 'Bobio2 Jones',
                        password: 'password',
                    });
                }}
            >
                Sign up
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    await authClient.signIn.email({
                        email: 'test2@example.com',
                        password: 'password',
                        callbackURL: '/test',
                    });
                }}
            >
                Sign in
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    const res = await fetch('/api/v1/health');
                    console.log(res);
                }}
            >
                Test JWT
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                router.push('/login');
                            },
                        },
                    });
                }}
            >
                Sign out
            </Button>
            {session && <p>{session.user.name}</p>}
        </main>
    );
}

import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function Test() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <main>
            <Link href='/'>Home</Link>
            {session && <p>{session.user.name}</p>}
        </main>
    );
}

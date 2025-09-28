import { auth } from '@/lib/auth/server';
import { NavbarContent } from './navbar/navbar-content';
import { headers } from 'next/headers';

async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <header className="sticky top-4 md:top-8 left-0 right-0 z-50 isolate mx-4 md:mx-8 mt-4 md:mt-8">
            <NavbarContent session={session} />
        </header>
    );
}

export default Navbar;

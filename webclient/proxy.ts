import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from './lib/auth/server';

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Apply middleware to specific routes
    matcher: ['/profile', '/budgets'],
};

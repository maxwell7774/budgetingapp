import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/lib/db/index';

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: () => crypto.randomUUID(),
        },
    },
    session: {
        cookieCache: { enabled: true },
    },
    database: drizzleAdapter(schema.db, {
        schema: schema,
        provider: 'pg',
        usePlural: true,
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [jwt()],
});

export type Session = typeof auth.$Infer.Session;

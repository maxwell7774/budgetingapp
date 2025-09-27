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
    plugins: [jwt()],
});

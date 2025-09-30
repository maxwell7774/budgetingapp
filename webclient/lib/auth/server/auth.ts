import { APIError, betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/lib/db/index';
import { HTTPMethod } from '@/lib/types';

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
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    const res = await fetch(
                        `${process.env.GO_API_URL}/api/v1/users`,
                        {
                            method: HTTPMethod.POST,
                            headers: {
                                'X-API-KEY': process.env.GO_API_KEY as string,
                            },
                            body: JSON.stringify(user),
                        }
                    );

                    if (!res.ok) {
                        throw new APIError('INTERNAL_SERVER_ERROR', {
                            message: "Couldn't create user in the application.",
                        });
                    }
                    console.log(await res.json());
                },
            },
        },
    },
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

import { headers } from 'next/headers';
import { auth } from '../auth/server';

class APIFetcher {
    private baseURL: string = process.env.GO_API_URL || 'http://localhost:8080';

    async fetch(path: string, options: RequestInit = {}): Promise<Response> {
        const finalOptions: RequestInit = { ...options };

        try {
            const { token } = await auth.api.getToken({
                headers: await headers(),
            });

            if (token) {
                finalOptions.headers = {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                };
            }
        } catch {
            // No token available — continue without auth
        }

        return fetch(`${this.baseURL}${path}`, finalOptions);
    }
}

export const api = new APIFetcher();

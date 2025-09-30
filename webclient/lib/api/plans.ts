import { headers } from 'next/headers';
import { auth } from '../auth/server';
import { HTTPMethod } from '../types';

export async function createPlan(formData: FormData) {
    'use server';

    const params = {
        name: formData.get('name') as string,
    };

    console.log(params);

    const { token } = await auth.api.getToken({ headers: await headers() });

    const res = await fetch(process.env.GO_API_URL + '/api/v1/plans', {
        method: HTTPMethod.POST,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    });
    console.log(await res.json());
}

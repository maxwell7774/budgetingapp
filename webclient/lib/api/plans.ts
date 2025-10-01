import { HTTPMethod } from '../types';
import { revalidatePath } from 'next/cache';
import { api } from './api';

export async function createPlan(formData: FormData) {
    'use server';

    const params = {
        name: formData.get('name') as string,
    };

    const res = await api.fetch('/api/v1/plans', {
        method: HTTPMethod.POST,
        body: JSON.stringify(params),
    });
    console.log(await res.json());
    revalidatePath('/budgets');
}

import { FormErrors, FormState, HTTPMethod } from '../types';
import { revalidatePath } from 'next/cache';
import { api } from './api';

export async function createPlan(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    'use server';

    const name = formData.get('name') as string;

    const errors: FormErrors = {};

    if (!name.length) errors['name'] = 'Name is required';
    if (name.length < 3) errors['name'] = 'Name must be over 3 characters';

    if (Object.keys(errors).length)
        return {
            message: 'Validation Failed',
            errors: errors,
        };

    const res = await api.fetch('/api/v1/plans', {
        method: HTTPMethod.POST,
        body: JSON.stringify({ name }),
    });

    if (!res.ok)
        return {
            message: "Couldn't create plan...",
        };

    revalidatePath('/budgets');
    return {
        message: 'Plan Created Successfully',
    };
}

import {
    CreatePlanParams,
    createPlanSchema,
    HTTPMethod,
    CreatePlanFormState,
} from '../types';
import { revalidatePath } from 'next/cache';
import { api } from './api';
import z from 'zod';

export async function createPlan(
    _prevState: CreatePlanFormState,
    formData: FormData
): Promise<CreatePlanFormState> {
    'use server';

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dat: CreatePlanParams = {
        name: formData.get('name') as string,
    };

    const validatedDat = createPlanSchema.safeParse(dat);

    if (!validatedDat.success)
        return {
            success: false,
            message: 'Validation failed, please fix the errors',
            errors: z.flattenError(validatedDat.error).fieldErrors,
            inputs: dat,
        };

    const res = await api.fetch('/api/v1/plans', {
        method: HTTPMethod.POST,
        body: JSON.stringify(dat),
    });

    if (!res.ok)
        return {
            success: false,
            message: "Couldn't create plan...",
            inputs: dat,
        };

    revalidatePath('/budgets');
    return {
        success: true,
        message: 'Plan Created Successfully',
    };
}

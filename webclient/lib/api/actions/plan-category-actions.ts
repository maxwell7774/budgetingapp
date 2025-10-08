import {
    CreatePlanCategoryFormState,
    CreatePlanCategoryParams,
    createPlanCategorySchema,
    CreatePlanFormState,
    HTTPMethod,
} from '@/lib/types';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { api } from '../server';

export async function createPlanCategory(
    _prevState: CreatePlanFormState,
    formData: FormData
): Promise<CreatePlanCategoryFormState> {
    'use server';

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deposit = Number(formData.get('deposit') as string);
    const withdrawal = Number(formData.get('withdrawal') as string);

    const dat: CreatePlanCategoryParams = {
        plan_id: formData.get('plan_id') as string,
        name: formData.get('name') as string,
        deposit: deposit,
        withdrawal: withdrawal,
    };

    console.log(formData);

    const validatedDat = createPlanCategorySchema.safeParse(dat);

    if (!validatedDat.success)
        return {
            success: false,
            message: 'Validation failed, please fix the errors',
            errors: z.flattenError(validatedDat.error).fieldErrors,
            inputs: dat,
        };

    const res = await api.fetch('/api/v1/plan-categories', {
        method: HTTPMethod.POST,
        body: JSON.stringify({
            ...dat,
            deposit: dat.deposit * 100,
            withdrawal: dat.withdrawal * 100,
        }),
    });

    if (!res.ok)
        return {
            success: false,
            message: "Couldn't create plan category...",
            inputs: dat,
        };

    revalidatePath('/budgets');
    return {
        success: true,
        message: 'Plan Category Created Successfully',
    };
}

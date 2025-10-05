'use server';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { createActionFn, createBaseActionFn } from './actions';
import { CreatePlanParams, createPlanSchema, HTTPMethod } from '@/lib/types';
import { api } from '../api';

type DeletePlanCTX = { id: string };
export const deletePlan = createBaseActionFn<DeletePlanCTX>(
    async function (_state, _formData, context) {
        const res = await api.fetch(`/api/v1/plans/${context.id}`, {
            method: HTTPMethod.DELETE,
        });

        if (!res.ok) {
            return {
                success: true,
                message: 'Failed to delete plan...',
            };
        }

        revalidatePath('/budgets');
        return {
            success: true,
            message: 'Successfully deleted plan!',
        };
    }
);
export type DeletePlanFn = typeof deletePlan;

export const createPlan = createActionFn(async function (_state, formData) {
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
        message: 'Plan Created Successfully!',
    };
});
export type CreatePlanFn = typeof createPlan;

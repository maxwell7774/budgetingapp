import z from 'zod';
import { Resource } from './resource';
import { BaseFormState, FormState } from './form-state';

export type CreatePlanCategoryFormState = FormState<CreatePlanCategoryParams>;

export type CreatePlanCategoryAction = (
    prevState: CreatePlanCategoryFormState,
    formData: FormData
) => Promise<CreatePlanCategoryFormState>;

export const createPlanCategorySchema = z.object({
    plan_id: z.uuid(),
    name: z
        .string()
        .min(3, { message: 'Name must be more than 3 characters' })
        .max(255, { message: 'Name must be less than 255 characters' }),
    deposit: z
        .number()
        .nonnegative({ message: 'Deposit must not be negative' }),
    withdrawal: z
        .number()
        .nonnegative({ message: 'Withdrawal must not be negative' }),
});

export type CreatePlanCategoryParams = z.infer<typeof createPlanCategorySchema>;

export type DeletePlanCategoryFormState = BaseFormState;

export type DeletePlanCategoryAction = (
    prevState: DeletePlanCategoryFormState,
    formData: FormData
) => Promise<DeletePlanCategoryFormState>;

export interface PlanCategory extends Resource {
    id: string;
    plan_id: string;
    name: string;
    deposit: number;
    withdrawal: number;
    created_at: string;
    updated_at: string;
}

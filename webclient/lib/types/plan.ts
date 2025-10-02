import z from 'zod';
import { Resource } from './resource';
import { BaseFormState, FormState } from './form-state';

export type CreatePlanFormState = FormState<CreatePlanParams>;

export type CreatePlanAction = (
    prevState: CreatePlanFormState,
    formData: FormData
) => Promise<CreatePlanFormState>;

export const createPlanSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name must be more than 3 characters' })
        .max(255, { message: 'Name must be less than 255 characters' }),
});

export type CreatePlanParams = z.infer<typeof createPlanSchema>;

export type DeletePlanFormState = BaseFormState;

export type DeletePlanAction = (
    prevState: DeletePlanFormState,
    formData: FormData
) => Promise<DeletePlanFormState>;

export interface Plan extends Resource {
    id: string;
    owner_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

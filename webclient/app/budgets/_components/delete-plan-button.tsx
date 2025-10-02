'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreatePlanAction, CreatePlanParams, FormState } from '@/lib/types';
import { useActionState } from 'react';

interface Props {
    createPlan: CreatePlanAction;
}

interface Props {
    createPlan: (
        prevState: FormState<CreatePlanParams>,
        formData: FormData
    ) => Promise<FormState<CreatePlanParams>>;
}

export function DeletePlanButton({ createPlan }: Props) {
    const [state, formAction, pending] = useActionState(createPlan, {
        success: false,
        message: '',
    });
    return (
        <form action={formAction} className="w-max">
            <Button type="submit" disabled={pending}>
                {pending ? 'Submitting...' : 'Add Plan'}
            </Button>
        </form>
    );
}

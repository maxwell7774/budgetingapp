'use client';
import { Button } from '@/components/ui/button';
import { DeletePlanFn } from '@/lib/api/actions/plan-actions';
import { CreatePlanAction, CreatePlanParams, FormState } from '@/lib/types';
import { useActionState } from 'react';

interface Props {
    deletePlan: DeletePlanFn;
}

export function DeletePlanButton({ deletePlan }: Props) {
    const [state, formAction, pending] = useActionState(
        deletePlan,
        {
            success: false,
            message: '',
        },
        { id: '' }
    );
    return (
        <form action={formAction} className="w-max">
            <Button type="submit" disabled={pending}>
                {pending ? 'Submitting...' : 'Add Plan'}
            </Button>
        </form>
    );
}

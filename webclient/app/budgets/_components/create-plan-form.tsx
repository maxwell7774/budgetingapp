'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreatePlanAction, CreatePlanParams, FormState } from '@/lib/types';
import { useActionState } from 'react';

interface Props {
    createPlan: CreatePlanAction;
}

export function CreatePlanForm({ createPlan }: Props) {
    const [state, formAction, pending] = useActionState(createPlan, {
        success: false,
        message: '',
    });
    return (
        <form action={formAction}>
            <div className="mb-8">
                <label htmlFor="name">Name</label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={state.inputs?.name}
                    aria-invalid={state.errors?.name ? true : false}
                    className="mt-1"
                    placeholder="name"
                />
                {state.errors?.name && (
                    <p className="text-red-500">{state.errors.name}</p>
                )}
            </div>
            <div className="ms-auto w-max">
                <Button type="submit" disabled={pending}>
                    {pending ? 'Submitting...' : 'Add Plan'}
                </Button>
            </div>
        </form>
    );
}

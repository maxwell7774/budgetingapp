'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { FormState } from '@/lib/types';
import { useActionState } from 'react';

interface Props {
    createPlan: (
        prevState: FormState,
        formData: FormData
    ) => Promise<FormState>;
}

export function CreatePlanForm({ createPlan }: Props) {
    const [state, formAction, pending] = useActionState(createPlan, {
        message: '',
    });
    return (
        <form action={formAction}>
            <div>{JSON.stringify(state)}</div>
            <Input name="name" placeholder="name" />
            <Button type="submit">Submit</Button>
        </form>
    );
}

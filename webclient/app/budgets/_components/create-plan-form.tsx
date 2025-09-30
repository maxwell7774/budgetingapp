'use client';
import { Button } from '@/components/ui/button';
import { createPlan } from '@/lib/api/plans';

export function CreatePlanForm() {
    return (
        <form action={createPlan}>
            <input placeholder="name" />
            <Button type="submit">Submit</Button>
        </form>
    );
}

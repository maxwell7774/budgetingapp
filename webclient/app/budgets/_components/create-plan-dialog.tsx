'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useActionState, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CreatePlanFn } from '@/lib/api/actions/plan-actions';

interface Props {
    createPlan: CreatePlanFn;
}

export function CreateBudgetDialog({ createPlan }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [state, formAction, pending] = useActionState(createPlan, {
        success: false,
        message: '',
    });

    useEffect(() => {
        if (state.success) {
            setOpen(false);
        }
    }, [state.success]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Budget</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-lg text-bold text-indigo-500">
                    Create New Budget
                </DialogTitle>
                <DialogDescription>
                    Please give your new budget a name...
                </DialogDescription>
                <form action={formAction}>
                    <div className="mb-8">
                        <label htmlFor="name">Name</label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={state.inputs?.name}
                            aria-invalid={state.errors?.name ? true : false}
                            className="mt-1"
                            placeholder="type here..."
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
            </DialogContent>
        </Dialog>
    );
}

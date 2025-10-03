'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { CreatePlanCategoryAction } from '@/lib/types';
import { useActionState, useEffect, useState } from 'react';

interface Props {
    planID: string;
    createPlanCategory: CreatePlanCategoryAction;
}

export function CreateCategoryDialog({ planID, createPlanCategory }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [catType, setCatType] = useState<'withdrawal' | 'deposit' | ''>('');
    const [state, formAction, pending] = useActionState(createPlanCategory, {
        success: false,
        message: '',
    });

    useEffect(() => {
        if (state.success) {
            setOpen(false);
        }
    }, [state.success]);

    console.log(state);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-lg text-bold text-indigo-500">
                    Create New Category
                </DialogTitle>
                <DialogDescription>
                    Please fill out your category...
                </DialogDescription>
                <form action={formAction} className="space-y-8">
                    <input type="hidden" name="plan_id" value={planID} />
                    <div>
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
                    <div>
                        <label htmlFor="type">Type</label>
                        <Select
                            value={catType}
                            onValueChange={(newValue) => {
                                if (newValue === 'withdrawal')
                                    setCatType('withdrawal');
                                else if (newValue === 'deposit')
                                    setCatType('deposit');
                                else setCatType('');
                            }}
                        >
                            <SelectTrigger id="type" className="w-full mt-1">
                                <SelectValue placeholder="Select option..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="withdrawal">
                                    Withdrawal
                                </SelectItem>
                                <SelectItem value="deposit">Deposit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {catType === 'deposit' && (
                        <div className="mb-8">
                            <label htmlFor="name">Expected Deposit</label>
                            <MoneyInput
                                id="deposit"
                                name="deposit"
                                defaultValue={
                                    state.inputs?.deposit
                                        ? state.inputs?.deposit.toString()
                                        : ''
                                }
                                aria-invalid={
                                    state.errors?.deposit ? true : false
                                }
                                className="mt-1"
                            />
                            {state.errors?.deposit && (
                                <p className="text-red-500">
                                    {state.errors.deposit}
                                </p>
                            )}
                        </div>
                    )}
                    {catType === 'withdrawal' && (
                        <div className="mb-8">
                            <label htmlFor="withdrawal">
                                Expected Withdrawal
                            </label>
                            <MoneyInput
                                id="withdrawal"
                                name="withdrawal"
                                defaultValue={
                                    state.inputs?.withdrawal
                                        ? state.inputs?.withdrawal.toString()
                                        : ''
                                }
                                aria-invalid={
                                    state.errors?.withdrawal ? true : false
                                }
                                className="mt-1"
                            />
                            {state.errors?.withdrawal && (
                                <p className="text-red-500">
                                    {state.errors.withdrawal}
                                </p>
                            )}
                        </div>
                    )}
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

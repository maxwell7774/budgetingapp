import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
} from '../../../components/ui/index.ts';
import {
    APIMutationCallbackFn,
    APIMutationFn,
} from '../../../components/api/api.ts';
import { useForm } from '@tanstack/react-form';
import { DialogDescription } from '@radix-ui/react-dialog';
import { MoneyInput } from '../../../components/ui/money-input.tsx';
import { formatCurrency } from '../../../utils/index.ts';
import { CreateLineItemParams } from '../../../components/api/line-items.ts';

interface Props {
    planCategoryID: string;
    mutationFn: APIMutationFn<CreateLineItemParams>;
    callbacks: APIMutationCallbackFn[];
}

export function LineItemForm(
    { planCategoryID, mutationFn, callbacks }: Props,
) {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm({
        defaultValues: {
            description: '',
            amount: '',
        },
        validators: {
            onChange: ({ value }) => {
                if (value.description === '') {
                    return 'Description is required';
                }
            },
        },
        onSubmit: async ({ value }) => {
            await mutationFn({
                updatedDat: {
                    description: value.description,
                    plan_category_id: planCategoryID,
                    amount: Number(value.amount) * 100,
                },
                callback: callbacks,
            }).then(() => {
                setOpen(false);
                form.reset();
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Line Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Line Item</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <form
                    className='space-y-8'
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.Field
                        name='description'
                        validators={{
                            onChange: ({ value }) => {
                                if (value === '') {
                                    return 'Description is required';
                                }
                                if (
                                    value.length > 500
                                ) {
                                    return 'Description must be under 500 characters';
                                }
                            },
                        }}
                    >
                        {(field) => (
                            <div>
                                <label
                                    htmlFor='description'
                                    className='mb-1 block'
                                >
                                    Description
                                </label>
                                <Input
                                    name='description'
                                    type='text'
                                    placeholder='type text here...'
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors && (
                                    <p className='text-red-500 mt-1'>
                                        {field.state.meta.errors}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>
                    <form.Field
                        name='amount'
                        validators={{
                            onChange: ({ value }) => {
                                const num = Number(value);
                                if (isNaN(num) || num <= 0) {
                                    return 'Amount must be greater than $0.00';
                                }
                                if (num > 9999999999999.99) {
                                    return `Amount must be under ${
                                        formatCurrency(999999999999999)
                                    }`;
                                }
                            },
                        }}
                    >
                        {(field) => (
                            <div>
                                <label htmlFor='amount' className='mb-1 block'>
                                    Amount
                                </label>
                                <MoneyInput
                                    name='amount'
                                    value={field.state.value}
                                    onChange={field.handleChange}
                                    onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors && (
                                    <p className='text-red-500 mt-1'>
                                        {field.state.meta.errors}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>
                    <DialogFooter className='flex gap-2 ms-auto'>
                        <Button type='submit'>Add Line Item</Button>
                        <DialogClose asChild>
                            <Button variant='outline'>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

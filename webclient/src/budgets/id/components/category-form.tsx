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
    Select,
} from '../../../components/ui/index.ts';
import {
    APIMutationCallbackFn,
    APIMutationFn,
} from '../../../components/api/api.ts';
import { PlanCategory } from '../../../components/api/plan-categories.ts';
import { useForm } from '@tanstack/react-form';
import { DialogDescription } from '@radix-ui/react-dialog';

interface Props {
    planID: string;
    mutationFn: APIMutationFn<PlanCategory>;
    callbacks: APIMutationCallbackFn[];
}

export function CategoryForm(
    { planID, mutationFn, callbacks }: Props,
) {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm({
        defaultValues: {
            name: '',
            amount: '' as unknown as number,
            type: '',
        },
        validators: {
            onChange: ({ value }) => {
                if (value.name === '') {
                    return 'Name is required';
                }
            },
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            await mutationFn({
                updatedDat: {
                    name: value.name,
                    plan_id: planID,
                    deposit: value.type === 'deposit' ? value.amount : 0,
                    withdrawal: value.type === 'withdrawal' ? value.amount : 0,
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
                <Button>Add New Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hello</DialogTitle>
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
                        name='name'
                        validators={{
                            onChange: ({ value }) => {
                                if (value === '') return 'Name is required';
                                if (
                                    value.length > 500
                                ) return 'Name must be under 500 characters';
                            },
                        }}
                    >
                        {(field) => (
                            <div>
                                <label htmlFor='name' className='mb-1 block'>
                                    Category Name
                                </label>
                                <Input
                                    name='name'
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
                                if (
                                    value <= 0 || isNaN(value)
                                ) return 'Amount must be greater than 0';
                            },
                        }}
                    >
                        {(field) => (
                            <div>
                                <label htmlFor='amount' className='mb-1 block'>
                                    Amount
                                </label>
                                <Input
                                    name='amount'
                                    type='number'
                                    placeholder='type text here...'
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.valueAsNumber,
                                        )}
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
                        name='type'
                        validators={{
                            onChange: ({ value }) => {
                                if (
                                    value === '' ||
                                    (value !== 'deposit' &&
                                        value !== 'withdrawal')
                                ) return 'Type is required';
                            },
                        }}
                    >
                        {(field) => (
                            <div>
                                <label className='mb-1 block'>Type</label>
                                <Select
                                    onChange={(newValue) =>
                                        field.handleChange(newValue.toString())}
                                    value={field.state.value}
                                    options={[
                                        { label: 'Deposit', value: 'deposit' },
                                        {
                                            label: 'Withdrawal',
                                            value: 'withdrawal',
                                        },
                                    ]}
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
                        <Button type='submit'>Add Category</Button>
                        <DialogClose asChild>
                            <Button variant='outline'>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

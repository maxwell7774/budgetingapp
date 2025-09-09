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
} from '../../components/ui/index.ts';
import {
    APIMutationCallbackFn,
    APIMutationFn,
} from '../../components/api/api.ts';
import { useForm } from '@tanstack/react-form';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Plan } from '../../components/api/plans.ts';

interface Props {
    mutationFn: APIMutationFn<Plan>;
    callbacks: APIMutationCallbackFn[];
}

export function PlanForm(
    { mutationFn, callbacks }: Props,
) {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm({
        defaultValues: {
            name: '',
        },
        validators: {
            onChange: ({ value }) => {
                if (value.name === '') {
                    return 'Name is required';
                }
            },
        },
        onSubmit: async ({ value }) => {
            await mutationFn({
                updatedDat: {
                    name: value.name,
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
                <Button>New Plan</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Plan</DialogTitle>
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
                                    Name
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
                    <DialogFooter className='flex gap-2 ms-auto'>
                        <Button type='submit'>Add Plan</Button>
                        <DialogClose asChild>
                            <Button variant='outline'>Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

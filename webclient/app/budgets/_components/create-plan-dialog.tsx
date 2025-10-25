'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { CreatePlanParams, createPlanSchema } from '@/lib/types';
import { createPlan } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

const defaultParams: CreatePlanParams = {
    name: '',
};

export function CreateBudgetDialog() {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm({
        defaultValues: defaultParams,
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: createPlanSchema,
        },
        onSubmit: async function ({ value, formApi }) {
            await createPlan(value, {
                onSuccess: function () {
                    setOpen(false);
                    form.reset();
                    router.refresh();
                    formApi.reset();
                },
                onError: function (err) {
                    formApi.setErrorMap({
                        onSubmit: { form: err.error, fields: {} },
                    });
                    formApi.update();
                },
            });
        },
    });

    console.log(form.state);

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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <div className="mb-8">
                        <label htmlFor="name">Name</label>
                        <form.Field name="name">
                            {(field) => (
                                <>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={!field.state.meta.isValid}
                                        className="mt-1"
                                        placeholder="type here..."
                                    />
                                    {!field.state.meta.isValid && (
                                        <p className="text-red-500">
                                            {field.state.meta.errors
                                                .map((e) => e?.message)
                                                .join(',')}
                                        </p>
                                    )}
                                </>
                            )}
                        </form.Field>
                    </div>
                    {form.state.errorMap.onSubmit && (
                        <div>{form.state.errorMap.onSubmit}</div>
                    )}
                    {form.state.isSubmitSuccessful && (
                        <p>Hello this was successful</p>
                    )}
                    <div className="ms-auto w-max">
                        <Button
                            type="submit"
                            disabled={form.state.isSubmitting}
                        >
                            {form.state.isSubmitting
                                ? 'Submitting...'
                                : 'Add Plan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

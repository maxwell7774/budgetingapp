import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/index';

const buttonVariants = cva(
    `
    focus-visible:outline-2 outline-offset-2 outline-indigo-500
    text-nowrap font-semibold h-11 px-5 hover:opacity-80
    hover:cursor-pointer active:opacity-60 transition-all rounded-full
    inline-flex items-center justify-center disabled:opacity-50 
    `,
    {
        variants: {
            variant: {
                primary: 'bg-indigo-500 text-white',
                outline:
                    'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500/20',
                ghost: 'hover:bg-indigo-100 dark:hover:bg-indigo-900',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
);

function Button({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };

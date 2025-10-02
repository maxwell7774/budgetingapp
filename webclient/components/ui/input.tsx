import * as React from 'react';

import { cn } from '@/lib/utils/index';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                `
                appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                [-moz-appearance:textfield] w-full h-11 bg-slate-100 dark:bg-slate-900 rounded-full px-5 focus-visible:outline-2
                outline-offset-2 outline-indigo-500 aria-invalid:border aria-invalid:border-red-500
            `,
                className
            )}
            {...props}
        />
    );
}

export { Input };

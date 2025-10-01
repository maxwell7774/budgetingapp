import * as React from 'react';

import { cn } from '@/lib/utils/index';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-md',
                className
            )}
            {...props}
        />
    );
}
export { Card };

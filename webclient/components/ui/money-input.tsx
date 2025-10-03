// import { forwardRef, useState, useEffect } from 'react';
// import { DollarSignIcon } from 'lucide-react';
// import { Input } from './input';
// import { cn } from '@/lib/utils';
//
// interface MoneyInputProps
//     extends Omit<
//         React.InputHTMLAttributes<HTMLInputElement>,
//         'value' | 'defaultValue' | 'onChange'
//     > {
//     value?: string; // Controlled
//     defaultValue?: string; // Uncontrolled
//     onValueChange?: (value: string) => void; // Cleaner than onChange
// }
//
// export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
//     function MoneyInput(
//         {
//             className,
//             value: controlledValue,
//             defaultValue,
//             onValueChange,
//             onBlur,
//             ...props
//         },
//         ref
//     ) {
//         const isControlled = controlledValue !== undefined;
//         const [uncontrolledValue, setUncontrolledValue] = useState(
//             defaultValue ?? ''
//         );
//
//         const value = isControlled ? controlledValue : uncontrolledValue;
//
//         // Sync defaultValue if it changes in uncontrolled mode
//         useEffect(() => {
//             if (!isControlled && defaultValue !== undefined) {
//                 setUncontrolledValue(defaultValue);
//             }
//         }, [defaultValue, isControlled]);
//
//         const handleInternalValueChange = (newValue: string) => {
//             if (!isControlled) {
//                 setUncontrolledValue(newValue);
//             }
//             onValueChange?.(newValue);
//         };
//
//         const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//             const raw = e.target.value;
//
//             // Allow empty string
//             if (raw === '') {
//                 handleInternalValueChange('');
//                 return;
//             }
//
//             // Disallow negative signs entirely
//             if (raw.startsWith('-')) return;
//
//             // Allow incomplete decimal forms (e.g. ".", "0.", ".5", "12.")
//             if (/^\d*\.?\d*$/.test(raw)) {
//                 handleInternalValueChange(raw);
//             }
//         };
//
//         const formatToTwoDecimals = (input: string) => {
//             if (input.trim() === '') return '';
//
//             // Handle cases like ".", ".5", "0.", "123."
//             let num = input;
//
//             if (num.startsWith('.')) {
//                 num = '0' + num; // ".5" -> "0.5"
//             }
//
//             if (num.endsWith('.')) {
//                 num = num.slice(0, -1); // "7." -> "7"
//             }
//
//             const parsed = Number(num);
//             if (isNaN(parsed)) return input; // fallback to raw if not numeric
//
//             return parsed.toFixed(2);
//         };
//
//         const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//             const formatted = formatToTwoDecimals(value);
//             if (formatted !== value) {
//                 handleInternalValueChange(formatted);
//             }
//             onBlur?.(e); // preserve any onBlur prop
//         };
//
//         return (
//             <div className="relative">
//                 <Input
//                     ref={ref}
//                     type="text"
//                     inputMode="decimal"
//                     className={cn('ps-9', className)}
//                     placeholder="0.00"
//                     value={value}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     {...props}
//                 />
//                 <div className="absolute top-0 left-3 h-full select-none pointer-events-none flex !items-center text-slate-500">
//                     <DollarSignIcon className="size-5 mt-0.5" />
//                 </div>
//             </div>
//         );
//     }
// );
//
import { forwardRef, useState, useEffect } from 'react';
import { DollarSignIcon } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface MoneyInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'value' | 'defaultValue' | 'onChange'
    > {
    value?: string; // Controlled
    defaultValue?: string; // Uncontrolled
    min?: number;
    max?: number;
    onValueChange?: (value: string) => void; // Updated value callback
}

const MIN_VALUE = 0;
const MAX_VALUE = 9999999999999;
const MAX_DIGITS_BEFORE_DECIMAL = 14;

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
    function MoneyInput(
        {
            className,
            value: controlledValue,
            defaultValue,
            onValueChange,
            onBlur,
            min = MIN_VALUE,
            max = MAX_VALUE,
            ...props
        },
        ref
    ) {
        const isControlled = controlledValue !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState('');

        // Helper: Format a number string with commas and 2 decimals
        const formatCurrency = (input: string) => {
            if (input.trim() === '') return '';

            let num = input;

            // Handle cases like ".", ".5", "0.", "123."
            if (num.startsWith('.')) num = '0' + num;
            if (num.endsWith('.')) num = num.slice(0, -1);

            let parsed = Number(num);
            if (isNaN(parsed)) return input;

            // Clamp to min/max
            parsed = Math.min(Math.max(parsed, min), max);

            // Format with commas and 2 decimals
            return parsed.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        };

        const normalizeInitialValue = (input?: string) => {
            if (!input || input.trim() === '') return '';
            return formatCurrency(input);
        };

        // Initialize uncontrolled value
        useEffect(() => {
            if (!isControlled) {
                setUncontrolledValue(normalizeInitialValue(defaultValue));
            }
        }, [defaultValue, isControlled]);

        const value = isControlled
            ? normalizeInitialValue(controlledValue)
            : uncontrolledValue;

        const handleInternalValueChange = (newValue: string) => {
            if (!isControlled) setUncontrolledValue(newValue);
            onValueChange?.(newValue);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;

            // Allow empty
            if (raw === '') {
                handleInternalValueChange('');
                return;
            }

            // Disallow negative
            if (raw.startsWith('-')) return;

            // Match valid in-progress numeric strings: digits + optional single decimal
            if (/^\d*\.?\d*$/.test(raw)) {
                // Enforce max digits before decimal
                const [beforeDecimal] = raw.split('.');
                if (beforeDecimal.length > MAX_DIGITS_BEFORE_DECIMAL) return;

                handleInternalValueChange(raw);
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const formatted = formatCurrency(value);
            if (formatted !== value) {
                handleInternalValueChange(formatted);
            }
            onBlur?.(e);
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type="text"
                    inputMode="decimal"
                    className={cn('ps-9', className)}
                    placeholder="0.00"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    {...props}
                />
                <div className="absolute top-0 left-3 h-full select-none pointer-events-none flex !items-center text-slate-500">
                    <DollarSignIcon className="size-5 mt-0.5" />
                </div>
            </div>
        );
    }
);

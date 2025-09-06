import { DollarIcon } from './icons/index.ts';

interface MoneyInputProps extends
    Pick<
        React.InputHTMLAttributes<HTMLInputElement>,
        'className' | 'onBlur' | 'name'
    > {
    value: string;
    onChange: (value: string) => void;
}

export const MoneyInput: React.FC<MoneyInputProps> = function (
    { className, onChange, onBlur, value, ...props },
) {
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.valueAsNumber;
        const stringValue = e.target.value;

        if (stringValue.length === 0) {
            onChange(stringValue);
            return;
        }
        if (isNaN(newValue)) return;

        if (stringValue.includes('.')) {
            const parts = stringValue.split('.');
            if (parts[1].length > 2) return;
        }

        onChange(stringValue);
    };

    const handleBlur = function (
        e: React.FocusEvent<HTMLInputElement, Element>,
    ) {
        let newValue = value;
        if (!newValue.includes('.')) {
            if (newValue) {
                newValue += '.00';
            }
        } else {
            const parts = newValue.split('.');
            if (parts[1].length === 1) {
                newValue += '0';
            }
            if (parts[1].length === 0) {
                newValue += '00';
            }
        }
        if (newValue !== value) {
            onChange(newValue);
        }

        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <div className='relative'>
            <input
                type='number'
                className={'ps-9 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] w-full h-11 bg-slate-100 dark:bg-slate-900 rounded-full px-5 focus-visible:outline-2 outline-offset-2 outline-indigo-500 ' +
                    className}
                placeholder='0.00'
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
                {...props}
            />
            <div className='absolute top-0 bottom-0 left-3 select-none pointer-events-none flex items-center text-slate-500'>
                <DollarIcon className='size-5' />
            </div>
        </div>
    );
};

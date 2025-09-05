interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = function (
    { className, ...props },
) {
    return (
        <input
            className={'w-full h-11 bg-slate-100 dark:bg-slate-900 rounded-full px-5 focus-visible:outline-2 outline-offset-2 outline-indigo-500 ' +
                className}
            {...props}
        />
    );
};

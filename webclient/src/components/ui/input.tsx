interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = function (
  { className, ...props },
) {
  return (
    <input
      className={"w-full h-11 border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 rounded-full px-5 focus-visible:outline-2 outline-offset-2 outline-indigo-500 " +
        className}
      {...props}
    />
  );
};

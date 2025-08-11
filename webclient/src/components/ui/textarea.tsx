interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = function (
  { className, ...props },
) {
  return (
    <textarea
      className={"w-full h-11 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5 focus-visible:outline-2 outline-offset-2 outline-indigo-500 " +
        className}
      {...props}
    />
  );
};

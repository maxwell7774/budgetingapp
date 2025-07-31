interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button: React.FC<ButtonProps> = function (
  { variant = "primary", children, className, ...props },
) {
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-indigo-500 text-white";
      break;
    case "outline":
      variantClasses =
        "border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500/20";
      break;
    case "ghost":
      variantClasses = "hover:bg-indigo-100 dark:hover:bg-indigo-900";
      break;
  }

  return (
    <button
      className={"text-nowrap font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-all rounded-full inline-flex items-center justify-center " +
        variantClasses + " " + className}
      {...props}
    >
      {children}
    </button>
  );
};

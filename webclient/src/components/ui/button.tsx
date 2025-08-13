import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className = "", ...props }, ref) => {
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
        ref={ref}
        className={"focus-visible:outline-2 outline-offset-2 outline-indigo-500 text-nowrap font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-all rounded-full inline-flex items-center justify-center disabled:opacity-50 " +
          variantClasses + " " + className}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

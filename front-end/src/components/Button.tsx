import { Link, type LinkProps } from "react-router-dom";
import { twMerge } from "tailwind-merge";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
  };

type ButtonAsLink = BaseProps &
  LinkProps & {
    to: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = ({className, variant = "primary", children, ...props}: ButtonProps) => {
  const baseClass = "text-primary px-8 py-3.5 rounded-sm font-medium tracking-wide transition-all duration-200 text-sm w-max active:scale-97 inline-flex justify-center whitespace-nowrap cursor-pointer"

  const variants = {
    primary: "bg-btn hover:bg-btn/90 text-white",
    outline:"border border-primary/20 hover:border-primary"
  }

  const combinedClassName = twMerge(baseClass, variants[variant], className);

  if("to" in props && props.to !== undefined) {
    return (
      <Link className={combinedClassName} {...(props as LinkProps)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${combinedClassName}`} {...props}>
      {children}
    </button>
  )
}
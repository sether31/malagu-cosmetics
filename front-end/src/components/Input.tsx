import { twMerge } from "tailwind-merge";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  rightIcon?: React.ReactNode;
  inputClassName?: string; 
}

const Input = ({ id, label, error, rightIcon, inputClassName, ...rest }: InputProps) => {
  const baseClassName = `border rounded-md py-2 px-3 w-full outline-none focus:border-primary ${
    error ? "border-red-500" : "border-gray-400"
  }`;
  const mergedClassName = twMerge(baseClassName, inputClassName);

  return (
    <div className="flex flex-col gap-2 relative">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        <input
          id={id}
          className={mergedClassName}
          {...rest}
        />

        {rightIcon && (
          <div className="absolute right-3 cursor-pointer text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
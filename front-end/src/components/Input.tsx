import { twMerge } from "tailwind-merge";

interface InputProps {
  id: string;
  label: React.ReactNode;
  error?: string;
  rightIcon?: React.ReactNode;
  style?: string;
}


const Input = ({ id, label, error, rightIcon, style, ...rest}: InputProps) => {

  const className = `border rounded-md py-2 px-3 w-full outline-none focus:border-primary ${
            error ? "border-red-500" : "border-gray-400"
          }`
  const newClassName = twMerge(className, style)
  return (
    <div className="flex flex-col gap-2 relative">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      
      <div className="relative flex items-center">
        <input
          id={id}
          className={newClassName}
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
  )
}

export default Input

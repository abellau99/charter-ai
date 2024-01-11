import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { KeyboardEvent, useState } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface IInputProps<T> extends UseControllerProps {
  id: string;
  name: string;
  label?: string;
  type: string;
  placeholder: string;
  control: any;
  className?: string;
  onEnter?: Function | undefined;
}

const PasswordInputComponent = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  control,
  onEnter,
  ...rest
}: IInputProps<T>) => {
  const onEnterHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div {...rest}>
      {label && (
        <label
          htmlFor={`id-${name}`}
          className="block text-tc-primary mb-2 text-tc-base font-medium"
        >
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({
          field: { onBlur, onChange, value },
          fieldState: { error },
        }) => (
          <div className="relative">
            <input
              id={`id-${name}`}
              // className={`form-input h-12 w-full rounded-lg appearance-none px-2 text-tc-primary leading-normal border-none focus:border-none focus:outline-none focus:shadow-outline ${
              className={`form-input bg-tc-input h-12 w-full rounded-lg appearance-none px-4 text-tc-primary leading-normal border-none focus:ring-tc-primary ${
                error ? "outline outline-1 outline-red-600" : "outline-none"
              }`}
              name={name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              onKeyDown={onEnterHandler}
            />
            <label
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 rounded-full p-0 mr-2 mt-3 text-sm text-tc-primary cursor-pointer "
            >
              {showPassword ? (
                <EyeSlashIcon
                  className="text-tc-primary"
                  width={24}
                  height={24}
                />
              ) : (
                <EyeIcon className="text-tc-primary" width={24} height={24} />
              )}
            </label>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
};

export default PasswordInputComponent;

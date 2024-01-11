"use client";

import { KeyboardEvent } from "react";
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

const TextInputComponent = <T extends FieldValues>({
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
          <>
            <input
              id={`id-${name}`}
              // className={`form-input h-12 w-full rounded-lg appearance-none px-2 text-tc-primary leading-normal border-none focus:border-none focus:outline-none focus:shadow-outline ${
              className={`form-input bg-tc-input h-12 w-full rounded-lg appearance-none px-4 text-tc-primary leading-normal border-none focus:ring-tc-primary ${
                error ? "outline outline-1 outline-red-600" : "outline-none"
              }`}
              name={name}
              type={type}
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              onKeyDown={onEnterHandler}
            />
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default TextInputComponent;

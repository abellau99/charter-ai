"use client";

import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface IInputProps<T> extends UseControllerProps {
  id: string;
  name: string;
  control: any;
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
}

const Radio = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  value,
  checked,
  disabled = false,
}: IInputProps<T>) => {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange } }) => (
          <div className="flex items-center mb-4">
            <input
              id={id}
              type="radio"
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              className="w-6 h-6 text-tc-primary-alt focus:ring-transparent"
              checked={checked}
              radioGroup={name}
              disabled={disabled}
            />
            <label
              htmlFor={id}
              className="block ml-2 text-tc-base font-normal text-tc-primary"
            >
              {label}
            </label>
          </div>
        )}
      />
    </div>
  );
};

export default Radio;

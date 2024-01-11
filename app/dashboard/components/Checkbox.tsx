"use client";

import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface IInputProps<T> extends UseControllerProps {
  id: string;
  name: string;
  control: any;
  label: string;
  disabled?: boolean;
}

const sliderPrimary = "#45484b";
const sliderSecondary = "#f6f8fa";
const sliderKnobBorder = "#FFFFFF";

const Checkbox = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  disabled = false,
}: IInputProps<T>) => {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({
          field: { onBlur, onChange, value },
          fieldState: { error },
        }) => (
          <div className="flex items-center mb-4 rounded-full">
            <input
              id={id}
              type="checkbox"
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              className="rounded-md w-6 h-6 text-tc-primary-alt border-tc-card-border cursor-pointer focus:ring-transparent"
              checked={value}
              disabled={disabled}
            />
            <label
              htmlFor={id}
              className="ml-2 text-base font-medium text-tc-primary"
            >
              {label}
            </label>
          </div>
        )}
      />
    </div>
  );
};

export default Checkbox;

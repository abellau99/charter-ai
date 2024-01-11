"use client";

import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface IInputProps<T> extends UseControllerProps {
  id: string;
  name: string;
  type: string;
  control: any;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const VideoInput = <T extends FieldValues>({
  name,
  type = "text",
  control,
  prefix = "",
  suffix = "",
  disabled = false,
  className = "",
  inputClassName = "",
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
          <div
            className={`h-8 flex font-normal text-tc-primary text-tc-base border border-1 border-tc-pallet-focused rounded-lg ${className}`}
          >
            {prefix.length > 0 && (
              <span className="w-8 h-full bg-tc-input inline-flex items-center px-3 rounded-lg">
                {prefix}
              </span>
            )}

            <input
              className={`focus:ring-0 form-input custom-video-input bg-white w-24 text-center appearance-none text-tc-primary leading-normal border-none focus:ring-tc-primary ${
                error ? "outline outline-1 outline-red-600" : "outline-none"
              } ${prefix.length > 0 || suffix.length > 0 ? "w-24" : "w-32"} ${
                suffix.length > 0 ? "rounded-l-lg" : "rounded-lg"
              } ${inputClassName}`}
              name={name}
              type={type}
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              disabled={disabled}
            />
            {suffix.length > 0 && (
              <span className="w-8 h-full bg-tc-input inline-flex items-center px-2 rounded-r-lg">
                {suffix}
              </span>
            )}
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
};

export default VideoInput;

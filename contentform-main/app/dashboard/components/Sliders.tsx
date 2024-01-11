"use client";

import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import styled from "styled-components";

interface IInputProps<T> extends UseControllerProps {
  id: string;
  name: string;
  control: any;
  min: number | string;
  max: number | string;
  disabled?: boolean;
}

const sliderPrimary = "#1C86EC";
const sliderSecondary = "#f6f8fa";
const sliderKnobBorder = "#FFFFFF";

const StyledInput = styled.input`
  -webkit-appearance: none;
  background: linear-gradient(
    to right,
    ${sliderPrimary} 0%,
    ${sliderPrimary}
      ${(props) =>
        (((props.value as number) - (props.min as number)) /
          ((props.max as number) - (props.min as number))) *
        100}%,
    ${sliderSecondary}
      ${(props) =>
        (((props.value as number) - (props.min as number)) /
          ((props.max as number) - (props.min as number))) *
        100}%,
    ${sliderSecondary} 100%
  );
  background-position: left;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: ${sliderPrimary};
    border: 3px solid ${sliderKnobBorder};
    border-radius: 10px;
    height: 20px;
    width: 20px;
  }

  &::-moz-range-thumb {
    background: ${sliderPrimary};
    border: 3px solid ${sliderKnobBorder};
    border-radius: 10px;
    height: 20px;
    width: 20px;
  }
`;

const Slider = <T extends FieldValues>({
  id,
  name,
  control,
  min = 0,
  max = 100,
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
          <StyledInput
            id={id}
            className="range-slider h-2 w-full rounded-lg cursor-pointer"
            name={name}
            type="range"
            min={min}
            max={max}
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
};

export default Slider;

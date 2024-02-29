'use client'

import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form"

import { InputType } from "@/types/base";

export type FormInputProps = {
  id: string;
  name: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string;
  validation?: RegisterOptions<FieldValues, string>;
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type,
  placeholder,
  defaultValue,
  validation 
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <input 
        {...register(name, validation)}
        className={`${defaultStyle} ${errors[name] ? withErrorStyle : withoutErrorStyle}`}
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </>
  )
}

const defaultStyle = `
flex-auto
`;
const withErrorStyle = ``;
const withoutErrorStyle = ``;

export default FormInput;

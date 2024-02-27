'use client'

import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form"

type InputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type FormInputProps = {
  id: string;
  name: string;
  label: string;
  type: InputType;
  placeholder: string;
  validation: RegisterOptions<FieldValues, string>;
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type,
  placeholder,
  validation 
}) => {
  const { register } = useFormContext();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input 
        {...register(name, validation)}
        placeholder={placeholder}
        type={type}
        id={id}
      />
    </div>
  )
}

export default FormInput;

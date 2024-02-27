'use client'

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput, { FormInputProps } from "./FormInput";

interface UploadFormInputs {
  title: string;
  album: string;
  image: File;
  song: File;
}

export default function UploadForm() {
  const methods = useForm<UploadFormInputs>();
  const [album, setAlbum] = useState<string | undefined>(undefined);

  function onSubmit(data: UploadFormInputs) {  
    console.log(data, album)
  }
  
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormInput {...titleProps}/>
        
        <select onChange={(e) => setAlbum(e.target.value)} defaultValue='second option'>
          <option value='first option'>first</option>
          <option value='second option'>second</option>
        </select>

        <button type="submit">upload</button>
      </form>
    </FormProvider>
  );
}

const titleProps: FormInputProps = {
  id: 'title',
  name: 'title',
  label: 'title',
  type: 'text',
  placeholder: 'title for your song',
  validation: {
    required: {
      value: true,
      message: 'title is required'
    },
    maxLength: {
      value: 20,
      message: 'title must be less then 20 letters'
    },
  },
}
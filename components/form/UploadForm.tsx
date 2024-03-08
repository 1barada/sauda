'use client'

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import FormInput, { FormInputProps } from "./FormInput";
import { useAuth } from "@/hooks/useAuth";
import { upload } from "@/actions/upload";
import { UploadFormInputs } from "@/types/author";

export default function UploadForm() {
  const methods = useForm<UploadFormInputs>();
  const {user} = useAuth();

  const onSubmit: SubmitHandler<UploadFormInputs> = (data) => {
    upload(data);
  };
  
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="grid grid-cols-form gap-y-4"
      >
        <Label htmlFor="title" value='Title'/>
        <FormInput {...titleProps}/>
        
        <Label htmlFor="album" value='Album'/>
        <div className="flex flex-col">
          <select 
            {...methods.register('album')}  
            id='album'          
            defaultValue='without album'
            className="my-0 mx-auth text-center"
          >
            <option value='without album'>without album</option>
            <option value='first option'>first</option>
            <option value='second option'>second</option>
          </select>
          <button>create new album</button>
        </div>

        <Label htmlFor="authors" value="Authors"/>
        <div className="flex flex-row items-center w-full gap-2">
          <p><span className="font-semibold">{user?.name}</span> and</p>
          <FormInput {...authorsProps}/>
        </div>

        <button type="submit" className="col-span-2">upload</button>
      </form>
    </FormProvider>
  );
}

function Label({ htmlFor, value }: { htmlFor: string, value: string }) {
  return (
    <label htmlFor={htmlFor} className="font-medium text-xl">{value}</label>
  );
}

const titleProps: FormInputProps = {
  id: 'title',
  name: 'title',
  type: 'text',
  placeholder: 'title for your song...',
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

const authorsProps: FormInputProps = {
  id: 'authors',
  name: 'authors',
  type: 'text',
  placeholder: 'enter all authors separated by one space',
};
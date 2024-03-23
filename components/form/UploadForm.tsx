'use client'

import toast from "react-hot-toast";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import FormInput, { FormInputProps } from "./FormInput";
import { useAuth } from "@/hooks/useAuth";
import uploadSong from "@/utils/uploadSong";
import { SongUploadRequestType, UploadFormInputTypes } from "@/types/author";

export default function UploadForm() {
  const methods = useForm<UploadFormInputTypes>();
  const { user } = useAuth();

  if (!user) {
    return (
      <p>not authorized</p>
    );
  }

  const onSubmit: SubmitHandler<UploadFormInputTypes> = async (inputs) => {
    // transforming
    let song: File = inputs.song[0];
    let cover: File = inputs.cover[0];
    
    let subAuthors: string | undefined = undefined;

    if (inputs.subAuthors) {
      subAuthors = inputs.subAuthors.split('&').map(entry => entry.trim()).join(' & ');
    }

    const data: SongUploadRequestType = {
      title: inputs.title,
      album: inputs.album,
      cover,
      song,
      subAuthors
    };

    // uploading and handling response
    const uploadPromise = new Promise(async (resolve, reject) => {
      const { data: responseData, error } = await uploadSong(data);

      if (error) {
        reject(error.message);
      } else {
        resolve(responseData);
      }
    });

    toast.promise(uploadPromise, {
      loading: 'uploading...',
      error: (error) => error || 'unable to upload',
      success: 'successfully uploaded'
    }, {});
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

        <Label htmlFor="subAuthors" value="Sub authors"/>
        <div className="flex flex-row items-center w-full gap-2">
          <p><span className="font-semibold">{user.name}</span> and</p>
          <FormInput {...subAuthorsProps}/>
        </div>

        <Label htmlFor="song" value="Song"/>
        <div className="flex flex-row items-center w-full gap-2">
          <FormInput {...songProps}/>
        </div>

        <Label htmlFor="cover" value="Cover"/>
        <div className="flex flex-row items-center w-full gap-2">
          <FormInput {...coverProps}/>
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
      message: 'title must be less then 20 characters'
    },
  },
}

const subAuthorsProps: FormInputProps = {
  id: 'subAuthors',
  name: 'subAuthors',
  type: 'text',
  placeholder: 'enter all sub authors separated by ampersand(&)',
  validation: {
    maxLength: {
      value: 100,
      message: 'sub authors must be less then 100 characters'
    }
  }
};

const songProps: FormInputProps = {
  id: 'song',
  name: 'song',
  type: 'file',
  accept: 'audio/mpeg',
  validation: {
    required: {
      value: true,
      message: 'song is required'
    },
    validate: (value: FileList) => {
      return value[0].type === 'audio/mpeg' ? true : 'this format is not supported';
    }
  }
}

const coverProps: FormInputProps = {
  id: 'cover',
  name: 'cover',
  type: 'file',
  accept: 'image/*',
  validation: {
    required: {
      value: true,
      message: 'cover is required'
    },
    validate: (value: FileList) => {
      return value[0].type.split('/')[0] === 'image' ? true : 'this format is not supported';
    }
  }
}
import { withAuthentication } from "@/middlewares";
import { MiddlewareFunction, handler } from "@/middlewares/handler";
import { albumUploadValidation, albumUpdateValidation, albumDeleteValidation } from "./middlewares";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import NodeID3 from "node-id3";
import { HttpStatus } from "@/types/httpStatusEnum";
import { RequestUploadAlbumData, RequestUpdateAlbumData, RequestDeleteAlbumData } from "./dtos";

const upload: MiddlewareFunction<RequestUploadAlbumData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.albumData) throw new Error('albumUploadValidation middleware not provided');

  const supabase = createClient(cookies());
  const albumData = req.albumData;
  const coverId = randomUUID();

  // remove metadata
  const coverBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await albumData.cover.arrayBuffer()));

  // failed to remove metadata
  if (typeof coverBuffer === 'boolean') throw new Error('unable to remove tags from buffered cover file');
  
  const coverUploadResponse = await supabase.storage.from('covers').upload(
    coverId,
    coverBuffer, 
    {
      contentType: albumData.cover.type
    }
  );

  if (coverUploadResponse.error) throw new Error('unable to upload album. ' + coverUploadResponse.error.message);
  
  const coverUploadData = coverUploadResponse.data;
  const { title, authors } = albumData;
  const releaseDate = `${albumData.releaseDate.getUTCFullYear()}-${albumData.releaseDate.getUTCMonth() + 1}-${albumData.releaseDate.getUTCDate()}`
  
  const { error } = await supabase.from('albums').insert({
    title,
    authors,
    coverUrl: coverUploadData.path,
    authorId: req.user.id,
    releaseDate
  });
  
  // if error delete all uploaded data
  if (error) {
    // we are not waiting for promises to finish so client can get response sooner
    const removeCoverPromise = supabase.storage
      .from('covers')
      .remove([coverUploadData.path])
      .then(({ error }) => {
        if (error) console.error('Fatal error:', error.message);
      });

    console.error(error);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: {
        message: 'internal server error'
      }
    }
  }

  return {
    status: HttpStatus.CREATED,
    data: null,
    error: null
  };
}

const update: MiddlewareFunction<RequestUpdateAlbumData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.albumData) throw new Error('albumUpdateValidation middleware not provided');

  const supabase = createClient(cookies());
  const albumData = req.albumData;

  if (albumData.cover) {
    const coverBuffer = NodeID3.removeTagsFromBuffer(Buffer.from(await albumData.cover.file.arrayBuffer()));

    if (typeof coverBuffer === 'boolean') throw new Error('unable to remove tags from buffered cover file');
    const { error } = await supabase.storage.from('covers').update(
      albumData.cover.path, 
      coverBuffer,
      {
        contentType: albumData.cover.file.type
      }
    );
    
    if (error) throw new Error('unable to update album cover: ' + error.message);
  }

  const { error } = await supabase.from('albums').update({
    title: albumData.title,
    authors: albumData.authors
  }).eq('id', albumData.id);

  if (error) throw new Error('ubable to update album data: ' + error.message);;
  
  return {
    status: 200,
    data: null,
    error: null
  };
}

const deleteAlbum: MiddlewareFunction<RequestDeleteAlbumData, null> = async (req) => {
  if (!req.user) throw new Error('withAuthentication middleware not provided');
  if (!req.albumData) throw new Error('albumDeleteValidation middleware not provided');

  const supabase = createClient(cookies());
  const albumData = req.albumData;

  const deleteCoverPromise = supabase.storage.from('covers').remove([albumData.coverUrl]);
  const deleteSongInstancePromise = supabase.from('songs').delete().eq('id', albumData.id);

  const [ deleteCoverResponse, deleteAlbumInstanceResponse ] = await Promise.all([
    deleteCoverPromise, 
    deleteSongInstancePromise
  ]);

  if (deleteCoverResponse.error) throw new Error('unable to delete cover. ' + deleteCoverResponse.error);
  if (deleteAlbumInstanceResponse.error) throw new Error('unable to delete album instance. ' + deleteAlbumInstanceResponse.error);

  return {
    status: HttpStatus.OK,
    data: null,
    error: null
  }
}

export const POST = handler<RequestUploadAlbumData, null>(
  withAuthentication,
  albumUploadValidation,
  upload
);

export const PATCH = handler<RequestUpdateAlbumData, null>(
  withAuthentication,
  albumUpdateValidation,
  update
);

export const DELETE = handler<RequestDeleteAlbumData, null>(
  withAuthentication,
  albumDeleteValidation,
  deleteAlbum
);
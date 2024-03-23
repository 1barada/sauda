'use client'

import Button from "@/components/Button";
import UploadForm from "@/components/form/UploadForm";
import usePlayerQueue from "@/hooks/usePlayerQueue";
import { Song } from "@/types/audio";
import { BASE_URL } from "@/utils/constants";

export default function Home() {
  const setPlayerQueue = usePlayerQueue();

  return (
    <div
      className="
        flex-auto
        bg-main
        p-2
        flex
        flex-row
        gap-2
      "
    >
      <Button 
        onClick={() => setPlayerQueue([{
          id: '24kljsdhdgflksdhjfssjdhfkshf',
          title: 'some song 1',
          url: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/songs/13%20Mountain%20Temple%20(Polyester%20Jammy).mp3',
          duration: 100,
          authors: 'me & grecha',
          coverUrl: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/covers/pop-rock-album-cover-template.png',
          album: 'asdfasf'
        }, {
          id: '24kljeessssdhdgflksdhjfsjdhfkshf',
          title: 'some song 2',
          url: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/songs/1.%20Evenflow.mp3',
          duration: 100,
          authors: 'me & grecha',
          coverUrl: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/covers/pop-rock-album-cover-template.png',
          album: 'asdfasf'
        }, {
          id: '24kljssssdhaadgflksdhjfsjdhfkshf',
          title: 'some song 3',
          url: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/songs/Jean_Dawson_Mac_DeMarco_-_MENTHOL_(patefon.org).mp3',
          duration: 100,
          authors: 'me & grecha',
          coverUrl: 'https://fnssesasapykevrjjntl.supabase.co/storage/v1/object/public/covers/pop-rock-album-cover-template.png',
          album: 'asdfasf'
        }])}
      >
        load song
      </Button>
      <UploadForm/>
    </div>
  );
}
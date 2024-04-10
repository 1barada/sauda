declare module 'get-mp3-duration' {
  export default function getSongDuration(buffer: Buffer): number {}
}

declare module 'node-id3' {
  namespace NodeID3 {
    export function removeTagsFromBuffer(data: Buffer): boolean | Buffer {}
  }

  export = NodeID3;
}
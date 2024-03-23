import { UploadFormRequestData } from "@/types/author";
import { BASE_URL } from "./constants";
import { ApiResponse } from "@/types/base";

export default async function uploadSong(data: UploadFormRequestData): Promise<ApiResponse<null>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await fetch(`${BASE_URL}/api/author`, {
    method: 'POST',
    body: formData
  });

  const body: ApiResponse<null> = await response.json();

  return body;
}
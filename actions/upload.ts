"use server";

export async function upload(formData: FormData) {
  const file = formData.get("song");
  if (!file) return console.log("nah");
  console.log(file);

  const reader = new FileReader();

  if (file instanceof File) reader.readAsArrayBuffer(file);
}

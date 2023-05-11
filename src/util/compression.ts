import imageCompression, { Options } from "browser-image-compression";

const options: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
};

export async function compressImage(file: File): Promise<File> {
  const compressedFile = await imageCompression(file, options);
  console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
  return compressedFile;
}

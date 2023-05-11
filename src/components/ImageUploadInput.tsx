import { ChangeEvent, useState } from "react";
import { compressImage } from "../util/compression.ts";
import imageCompression from "browser-image-compression";

export function ImageUploadInput(props: {
  onFileSelected: (image: File) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      setPreviewUrl(await imageCompression.getDataUrlFromFile(compressedFile));
      props.onFileSelected(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <label
      htmlFor="dropzone-file"
      style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}}
      className="group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100 hover:!bg-none"
    >
      <div
        style={previewUrl ? { display: "none" } : {}}
        className="flex flex-col items-center justify-center pb-6 pt-5 group-hover:!flex"
      >
        <svg
          aria-hidden="true"
          className="mb-3 h-10 w-10 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="mb-2 text-sm text-black">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-black">PNG or JPG</p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        accept="image/png, image/gif, image/jpeg"
        onChange={onFileSelected}
      />
    </label>
  );
}

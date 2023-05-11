import { ChangeEvent, useState } from "react";
import { compressImage } from "../util/compression.ts";
import imageCompression from "browser-image-compression";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

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
        <CloudArrowUpIcon className="h-10 w-10 text-black" />
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

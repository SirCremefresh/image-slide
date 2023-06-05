import { compressImage } from "../util/compression.ts";
import { Size } from "@common/models/sizes.ts";
import { ChangeEvent, useState } from "react";
import imageCompression from "browser-image-compression";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

export function ImageUploadInput(props: {
  onFileSelected: (image: { image: File; size: Size }) => void;
  isImageDirty: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHasError(false);

    try {
      const compressedFile = await compressImage(file);
      const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
      setPreviewUrl(dataUrl);
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const size: Size = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
      props.onFileSelected({ size, image: compressedFile });
    } catch (error) {
      console.error("Could not convert image", error);
      setPreviewUrl(undefined);
      setHasError(true);
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
        {previewUrl && (
          <p className="mb-2 text-sm font-semibold text-black">
            Image Selected
          </p>
        )}
        <p className="mb-2 text-sm text-black">
          <span className="font-semibold">Click to upload</span>
          or drag and drop
        </p>
        <p className="text-xs text-black">PNG or JPG</p>
        {hasError && (
          <p className="mt-2 text-sm text-red-600">
            Something went wrong. Please try again.
          </p>
        )}
        {props.isImageDirty && previewUrl == undefined && (
          <p className="mt-2 text-sm text-red-600">
            You have to select an Image.
          </p>
        )}
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

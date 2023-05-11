import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import type { Image } from "@common/models/collection.ts";
import { uploadImage } from "../api-client/images.ts";
import { ImageUploadInput } from "./ImageUploadInput.tsx";

function TitleInput(props: { text: string; setText: (text: string) => void }) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Email
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          aria-invalid="true"
          aria-describedby="email-error"
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-red-600" id="email-error">
        Not a valid email address.
      </p>
    </div>
  );
}

export function FileUploadModal({
  setOpenModal,
  collectionId,
  onFileUploaded,
  secret,
}: {
  setOpenModal: (open: boolean) => void;
  onFileUploaded: (image: Image) => unknown;
  collectionId: string;
  secret: string;
}) {
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<undefined | File>(undefined);

  const uploadFileWithAxios = async () => {
    if (!file) return;
    try {
      const imageId = await uploadImage(
        collectionId,
        file,
        secret,
        setUploadProgress
      );
      onFileUploaded({
        imageId,
        title: title,
        links: [],
      });
      setOpenModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={() => setOpenModal(false)}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
            <div className="mt-2 text-center sm:ml-4 sm:text-left">
              <h4 className="text-lg font-medium text-gray-800">
                Upload Image
              </h4>
              <div className="flex w-full items-center justify-center">
                <ImageUploadInput
                  onFileSelected={(file) => setFile(file)}
                ></ImageUploadInput>
              </div>
              <TitleInput setText={setTitle} text={title}></TitleInput>
              {uploadProgress}
              <div className="mt-3 items-center gap-2 sm:flex">
                <button
                  className="mt-2 w-full flex-1 rounded-md bg-blue-600 p-2.5 text-white outline-none ring-red-600 ring-offset-2 focus:ring-2"
                  onClick={() => {
                    uploadFileWithAxios();
                    // setOpenModal(false);
                  }}
                >
                  Upload
                </button>
                <button
                  className="mt-2 w-full flex-1 rounded-md border p-2.5 text-gray-800 outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

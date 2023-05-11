import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import type { Image } from "@common/models/collection.ts";
import { uploadImage } from "../api-client/images.ts";
import { ImageUploadInput } from "./ImageUploadInput.tsx";
import { classNames } from "../util/class-names.ts";

function TitleInput(props: {
  text: string;
  setText: (text: string) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}) {
  const isInvalid = props.isDirty && props.text.length === 0;

  return (
    <div>
      <label
        htmlFor="title"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Title
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="title"
          name="title"
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 pr-10 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
            isInvalid &&
              "border-red-300 text-red-900 outline-red-300 ring-red-300 placeholder:text-red-300 focus:ring-red-500"
          )}
          placeholder="Title"
          aria-invalid="true"
          aria-describedby="email-error"
          value={props.text}
          onChange={(e) => {
            props.setText(e.target.value);
            props.setIsDirty(true);
          }}
        />
        {isInvalid && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {isInvalid && (
        <p className="mt-2 text-sm text-red-600">Title cannot be empty.</p>
      )}
    </div>
  );
}

export function ImageUploadModal({
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
  const [isTitleDirty, setIsTitleDirty] = useState(false);
  const [file, setFile] = useState<undefined | File>(undefined);

  const uploadFileWithAxios = async () => {
    if (!file) return;
    try {
      const imageId = await uploadImage(collectionId, file, secret);
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
                <ImageUploadInput onFileSelected={(file) => setFile(file)} />
              </div>
              <TitleInput
                setText={setTitle}
                text={title}
                isDirty={isTitleDirty}
                setIsDirty={setIsTitleDirty}
              />
              <div className="mt-3 items-center gap-2 sm:flex">
                <button
                  className="mt-2 w-full flex-1 rounded-md bg-blue-600 p-2.5 text-white outline-none ring-red-600 ring-offset-2 focus:ring-2"
                  onClick={uploadFileWithAxios}
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

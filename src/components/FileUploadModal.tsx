import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { ChangeEvent, useState } from "react";
import imageCompression, { Options } from "browser-image-compression";
import type { Image } from "@common/models/collection.ts";
import axios from "axios";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";

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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const uploadFileWithAxios = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file as File);
    try {
      const res = await axios.post<{ imageId: string }>(
        `/api/collections/${collectionId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: secret,
            Accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded /
                assertNotNullOrUndefined(progressEvent.total)) *
                100
            );
            console.log(progress);
            setUploadProgress(progress);
          },
        }
      );
      onFileUploaded({
        imageId: res.data.imageId,
        title: title,
        links: [],
      });
      setOpenModal(false);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const options: Options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    };
    try {
      const compressedFile = await imageCompression(file, options);
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      );
      setPreviewUrl(await imageCompression.getDataUrlFromFile(compressedFile));
      setFile(compressedFile);
    } catch (error) {
      console.log(error);
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
                <div
                  role="status"
                  className="absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
                <label
                  htmlFor="dropzone-file"
                  style={
                    previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}
                  }
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 bg-contain bg-center bg-no-repeat hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      aria-hidden="true"
                      className="mb-3 h-10 w-10 text-gray-400"
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
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={onFileSelected}
                  />
                </label>
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

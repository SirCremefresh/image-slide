import {ExclamationCircleIcon} from "@heroicons/react/20/solid";
import {useState} from "react";
import imageCompression, {Options} from "browser-image-compression";
import type {Image} from "../models/image.ts";
import axios from "axios";
import {assertNotNull} from "../util/assert.ts";


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
                                    collectionId
                                }: {
    setOpenModal: (open: boolean) => void;
    onFileUploaded: (image: Image) => unknown;
    collectionId: string;
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
            const res = await axios.post(`/api/collections/${collectionId}/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / assertNotNull(progressEvent.total)) * 100
                    );
                    setUploadProgress(progress);
                },
            });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("onFileSelected", e.target.files);
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
                "compressedFile instanceof Blob",
                compressedFile instanceof Blob
            ); // true
            console.log(
                `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
            ); // smaller than maxSizeMB
            setPreviewUrl(await imageCompression.getDataUrlFromFile(compressedFile));
            setFile(compressedFile);
        } catch (error) {
            console.log(error);
        }

        // if (e.target.files) {
        //     const file = e.target.files[0];
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         const image = new Image();
        //         image.title = title;
        //         image.file = file;
        //         image.dataUrl = e.target?.result as string;
        //         image.collectionId = collectionId;
        //         onFileUploaded(image);
        //     };
        //     reader.readAsDataURL(file);
        // }
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
                                <label
                                    htmlFor="dropzone-file"
                                    style={
                                        previewUrl ? {backgroundImage: `url(${previewUrl})`} : {}
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
                                    Delete
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

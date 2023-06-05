import { classNames } from "../util/class-names.ts";
import { Image } from "@common/models/collection.ts";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";

function SearchListItem(props: {
  selected: boolean;
  image: Image;
  active: boolean;
}) {
  return (
    <>
      <span
        className={classNames(
          "block truncate",
          props.selected && "font-semibold"
        )}
      >
        {props.image.title}
      </span>

      {props.selected && (
        <span
          className={classNames(
            "absolute inset-y-0 right-0 flex items-center pr-4",
            props.active ? "text-white" : "text-indigo-600"
          )}
        >
          <CheckIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </>
  );
}

function ImageAutocomplete(props: {
  images: Image[];
  setSelectedImage: (image: Image | null) => void;
  selectedImage: Image | null;
}) {
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.click();
  }, [buttonRef]);

  const filteredImages =
    query === ""
      ? props.images
      : props.images.filter((image) => {
          return image.title.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={props.selectedImage}
      onChange={props.setSelectedImage}
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        Assigned to
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          displayValue={(image: Image) => image?.title}
        />
        <Combobox.Button
          ref={buttonRef}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {filteredImages.map((image) => (
            <Combobox.Option
              key={image.imageId}
              value={image}
              className={({ active }) =>
                classNames(
                  "relative cursor-default select-none py-2 pl-3 pr-9",
                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                )
              }
            >
              {({ active, selected }) => (
                <SearchListItem
                  selected={selected}
                  image={image}
                  active={active}
                />
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export default function LinkEditModal({
  images,
  onLinkCreated,
  onCanceled,
}: {
  images: Image[];
  onLinkCreated: (image: Image) => void;
  onCanceled: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={() => {
            onCanceled();
          }}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg">
            <div className="mt-2 text-center sm:ml-4 sm:text-left">
              <div className="flex w-full items-center justify-center">
                <h2>Link</h2>
              </div>
              <ImageAutocomplete
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                images={images}
              ></ImageAutocomplete>
              <div className="mt-3 items-center gap-2 sm:flex">
                <button
                  className="mt-2 w-full flex-1 rounded-md bg-blue-600 p-2.5 text-white outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
                  disabled={selectedImage === null}
                  onClick={() => {
                    onLinkCreated(assertNotNullOrUndefined(selectedImage));
                  }}
                >
                  Create
                </button>
                <button
                  className="mt-2 w-full flex-1 rounded-md border p-2.5 text-gray-800 outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
                  onClick={() => {
                    onCanceled();
                  }}
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

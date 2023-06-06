import { Collection, Image } from "@common/models/collection.ts";
import { classNames } from "../../../util/class-names.ts";
import { TrashIcon } from "@heroicons/react/20/solid";
import { imageUrl } from "../../../util/img-url.ts";
import { Fragment, useState } from "react";
import { ImageDropArea } from "./ImageDropArea.tsx";

export function ImagesSidebar(props: {
  collection: Collection;
  onSelectImage: (image: Image) => void;
  currentImage: Image;
  onDeleteImage: (image: Image) => void;
  moveImage: (image: Image, targetIndex: number) => void;
}) {
  const [draggingImage, setDraggingImage] = useState<Image | undefined>();
  const [targetIndex, setTargetIndex] = useState<number | undefined>();
  return (
    <div
      className={
        "flex flex-col gap-1 overflow-scroll rounded-lg border border-gray-300 bg-white p-2 shadow-md"
      }
    >
      {props.collection.images.map((image, index) => (
        <Fragment key={image.imageId}>
          {draggingImage !== undefined && (
            <ImageDropArea
              setTargetIndex={setTargetIndex}
              targetIndex={targetIndex}
              onDrop={(targetIndex) => {
                props.moveImage(draggingImage, targetIndex);
              }}
              collection={props.collection}
              index={index}
            />
          )}
          <div
            draggable={true}
            onClick={() => {
              props.onSelectImage(image);
            }}
            style={{ backgroundColor: props.collection.backgroundColor }}
            onDragStart={(e) => {
              console.log("drag start");
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.dropEffect = "move";
              setDraggingImage(image);
              e.dataTransfer.setData("imageId", image.imageId);
            }}
            onDragEnd={() => {
              console.log("drag end");
              setTargetIndex(undefined);
              setDraggingImage(undefined);
            }}
            className={classNames(
              "flex w-[100%] flex-col",
              image.imageId === props.currentImage.imageId &&
                "border-2 border-blue-500"
            )}
          >
            <img
              draggable={false}
              className={"aspect-video w-[100%] rounded object-contain"}
              src={imageUrl(props.collection.collectionId, image.imageId)}
              alt={image.title}
              loading={"lazy"}
            />

            <div className="flex flex-row items-center justify-between p-2">
              <span className={"text-sm font-semibold text-white"}>
                {image.title}
              </span>
              <TrashIcon
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="h-4 w-4 cursor-pointer text-white transition-colors hover:text-gray-400"
              ></TrashIcon>
            </div>
          </div>
        </Fragment>
      ))}
      {draggingImage !== undefined && (
        <ImageDropArea
          setTargetIndex={setTargetIndex}
          targetIndex={targetIndex}
          onDrop={(targetIndex) => {
            props.moveImage(draggingImage, targetIndex);
          }}
          collection={props.collection}
          index={props.collection.images.length}
        />
      )}
    </div>
  );
}

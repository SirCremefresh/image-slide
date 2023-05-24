import { MouseEvent, useCallback, useMemo, useState } from "react";
import "./Editor.css";
import { useImageRectangle } from "../../hooks/ImageRectangle.ts";
import { PercentageBoxButton } from "../../components/BoxButton.tsx";
import { FloatingToolbar } from "../../components/FloatingToolbar.tsx";
import { useParams } from "react-router-dom";
import { useCollection } from "../../api-client/collections.ts";
import {
  Collection,
  collectionDeleteImageAndRemoveDependents,
  collectionDeleteLink,
  collectionUpsertImage,
  collectionUpsertLink,
  collectionUpsertTitle,
  Image,
  Link,
} from "@common/models/collection.ts";
import { ImageUploadModal } from "../../components/ImageUploadModal.tsx";
import {
  buildPercentPointFromMouseEvent,
  PercentagePoint,
} from "@common/models/points.ts";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";
import { CreateLinkRectangle } from "./CreateLinkRectangle.tsx";
import { classNames } from "../../util/class-names.ts";
import { TrashIcon } from "@heroicons/react/20/solid";
import { EditLinkRectangle } from "./edit-link-rectangle/EditLinkRectangle.tsx";
import { useMouseState } from "./use-mouse-state.ts";

function Editor() {
  const { collectionId, secret } = useParams<{
    collectionId: string;
    secret: string;
  }>();
  const { data } = useCollection(assertNotNullOrUndefined(collectionId));

  if (data === undefined) return <div>Loading...</div>;
  return (
    <EditorLoaded
      collection={data}
      secret={assertNotNullOrUndefined(secret)}
    ></EditorLoaded>
  );
}

function imageUrl(collectionId: string, imageId: string) {
  return "/api/collections/" + collectionId + "/images/" + imageId;
}

type Action =
  | { name: "none" }
  | { name: "create-link"; start: PercentagePoint }
  | { name: "edit-link"; link: Link }
  | { name: "image-upload" };

const NONE_ACTION: Action = { name: "none" };

function EditorLoaded(props: { collection: Collection; secret: string }) {
  const [collection, setCollection] = useState<Collection>(props.collection);
  const [imageId, setImageId] = useState<string | undefined>(
    collection.images.at(0)?.imageId
  );
  const [imageRectangle, imageRef, setImageRef] = useImageRectangle();
  const mouseState = useMouseState(imageRef, imageRectangle);
  const [action, setAction] = useState<Action>(NONE_ACTION);

  const safeCollection = useCallback(
    async (newCollection: Collection) => {
      console.log("safeCollection");
      const response = await fetch(
        `/api/collections/${newCollection.collectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: props.secret,
          },
          body: JSON.stringify(newCollection),
        }
      );
      console.log(response.status);
    },
    [props.secret]
  );

  const cancelActiveRectangle = (): Collection => {
    if (action.name === "edit-link") {
      const newCollection = collectionUpsertLink(
        collection,
        image,
        action.link
      );
      setCollection(newCollection);
      return newCollection;
    }
    setAction(NONE_ACTION);
    return collection;
  };

  const image = useMemo(() => {
    const image = collection.images.find((image) => image.imageId === imageId);
    if (!image) throw new Error(`Image with id ${imageId} not found`);
    return image;
  }, [collection, imageId]);

  const createRectangle = (e: MouseEvent) => {
    if (action.name === "edit-link") {
      const newCollection = collectionUpsertLink(
        collection,
        image,
        action.link
      );
      setCollection(newCollection);
      safeCollection(newCollection).then(() => console.log("saved"));
      setAction(NONE_ACTION);
      return;
    }
    setAction({
      name: "create-link",
      start: buildPercentPointFromMouseEvent(imageRectangle, e),
    });
  };

  const finishRectangle = (link: Link) => {
    if (action.name === "none") return;

    const newCollection = collectionUpsertLink(collection, image, link);
    if (action.name === "create-link") {
      setCollection(newCollection);
      safeCollection(newCollection).then(() => console.log("saved"));
      setAction(NONE_ACTION);
    }
    if (action.name === "edit-link") {
      safeCollection(newCollection).then(() => console.log("saved"));
      setAction({
        name: "edit-link",
        link,
      });
    }
  };

  const handleEditTitle = (newTitle: string) => {
    const newCollection = collectionUpsertTitle(collection, newTitle);
    setCollection(newCollection);
    safeCollection(newCollection).then(() => console.log("saved"));
  };

  const handleUpload = () => {
    cancelActiveRectangle();
    setAction({ name: "image-upload" });
  };

  const onFileUploaded = (newImage: Image) => {
    setCollection((collection) => {
      const newCollection = collectionUpsertImage(collection, newImage);
      safeCollection(newCollection).then(() => console.log("saved"));
      console.log("onFileUploaded", newImage);
      return newCollection;
    });
  };

  const editRectangle = (link: Link) => {
    setAction({
      name: "edit-link",
      link,
    });
    setCollection((collection) =>
      collectionDeleteLink(collection, image, link)
    );
  };

  const onDeleteRectangle = (link: Link) => {
    const newCollection = collectionDeleteLink(collection, image, link);

    setCollection(newCollection);
    setAction(NONE_ACTION);
    safeCollection(newCollection).then(() => console.log("saved"));
  };

  const deleteImage = (image: Image) => {
    const newCollection = collectionDeleteImageAndRemoveDependents(
      cancelActiveRectangle(),
      image
    );
    const newImageId = newCollection.images.at(0)?.imageId;
    setImageId(newImageId);
    setCollection(newCollection);
    safeCollection(newCollection).then(() => console.log("saved"));
  };

  return (
    <div className={"min-h-screen bg-gray-300 px-2"}>
      <div className={"grid grid-cols-[1fr_300px] grid-rows-[120px_1fr]"}>
        <div className={"col-span-2"}>
          <FloatingToolbar
            initialTitle={collection.title}
            onTitleChange={handleEditTitle}
            onUpload={handleUpload}
          />
        </div>
        <div>
          <div
            ref={setImageRef}
            className="relative inline-block flex-1 select-none"
            draggable={false}
          >
            <img
              className="block max-h-[100%] max-w-[100%] rounded"
              src={imageUrl(collection.collectionId, image.imageId)}
              alt={image.title}
              draggable={false}
              onMouseDown={createRectangle}
            />
            {image.links.map((link, index) => (
              <PercentageBoxButton
                onClick={() => editRectangle(link)}
                clickable={action.name === "none"}
                key={index}
                rectangle={link.rectangle}
              ></PercentageBoxButton>
            ))}
            {action.name == "create-link" && (
              <CreateLinkRectangle
                onCreate={finishRectangle}
                onCancel={cancelActiveRectangle}
                start={action.start}
                mouseState={mouseState}
                images={collection.images}
              ></CreateLinkRectangle>
            )}
            {action.name == "edit-link" && (
              <EditLinkRectangle
                onUpdate={finishRectangle}
                onDelete={onDeleteRectangle}
                link={action.link}
                mouseState={mouseState}
              ></EditLinkRectangle>
            )}
          </div>
        </div>
        <div
          className={
            "flex flex-col gap-1 rounded-lg border border-gray-300 bg-white p-2 shadow-md"
          }
        >
          {collection.images.map((image, index) => (
            <div
              onClick={() => {
                cancelActiveRectangle();
                setImageId(image.imageId);
              }}
              key={index}
              style={{ backgroundColor: collection.backgroundColor }}
              className={classNames(
                "flex w-[100%] flex-col",
                image.imageId === imageId && "border-2 border-blue-500"
              )}
            >
              <img
                className={"aspect-video w-[100%] rounded object-contain"}
                src={imageUrl(collection.collectionId, image.imageId)}
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
                    deleteImage(image);
                  }}
                  className="h-4 w-4 cursor-pointer text-white transition-colors hover:text-gray-400"
                ></TrashIcon>
              </div>
            </div>
          ))}
        </div>
      </div>

      {action.name === "image-upload" && (
        <ImageUploadModal
          secret={props.secret}
          closeModal={() => setAction(NONE_ACTION)}
          onFileUploaded={onFileUploaded}
          collectionId={collection.collectionId}
        />
      )}
    </div>
  );
}

export default Editor;

import { PercentagePoint } from "@common/models/points.ts";
import {
  Collection,
  Image,
  Link,
  collectionDeleteImageAndRemoveDependents,
  collectionDeleteLink,
  collectionMoveImage,
  collectionUpsertImage,
  collectionUpsertLink,
  collectionUpsertTitle,
} from "@common/models/collection.ts";
import { useCallback, useMemo, useState } from "react";
import { useImageRectangle } from "../../hooks/ImageRectangle.ts";
import { useMouseState } from "./use-mouse-state.ts";
import { FloatingToolbar } from "../../components/FloatingToolbar.tsx";
import { imageUrl } from "../../util/img-url.ts";
import { PercentageBoxButton } from "../../components/BoxButton.tsx";
import { CreateLinkRectangle } from "./CreateLinkRectangle.tsx";
import { EditLinkRectangle } from "./edit-link-rectangle/EditLinkRectangle.tsx";
import { ImagesSidebar } from "./images-sidebar/ImagesSidebar.tsx";
import { ImageUploadModal } from "../../components/ImageUploadModal.tsx";

type Action =
  | { name: "none" }
  | { name: "create-link"; start: PercentagePoint }
  | { name: "edit-link"; link: Link }
  | { name: "image-upload" };

const NONE_ACTION: Action = { name: "none" };

export function EditorLoaded(props: {
  collection: Collection;
  secret: string;
}) {
  const [collection, setCollection] = useState<Collection>(props.collection);
  const [imageId, setImageId] = useState<string | undefined>(
    collection.images.at(0)?.imageId
  );
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [imageRectangle, imageRef, setImageRef] = useImageRectangle();
  const mouseState = useMouseState(containerRef, imageRef, imageRectangle);
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
      setAction(NONE_ACTION);
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

  const createRectangle = () => {
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
      start: mouseState.point,
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
    setImageId(newImage.imageId);
  };

  const editRectangle = (link: Link) => {
    console.log("on click");
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

  const moveImage = (image: Image, targetIndex: number) => {
    const newCollection = collectionMoveImage(
      cancelActiveRectangle(),
      image,
      targetIndex
    );
    setCollection(newCollection);
    safeCollection(newCollection).then(() => console.log("saved"));
  };

  return (
    <div className={"min-h-screen bg-gray-300 px-2"}>
      <div
        className={"grid h-[100vh] grid-cols-[1fr_300px] grid-rows-[120px_1fr]"}
      >
        <div className={"col-span-2"}>
          <FloatingToolbar
            initialTitle={collection.title}
            onTitleChange={handleEditTitle}
            onUpload={handleUpload}
          />
        </div>
        <div className={"overflow-scroll"} ref={setContainerRef}>
          <div
            ref={setImageRef}
            className="relative inline-block flex-1 select-none"
            draggable={false}
          >
            <img
              className="block max-h-[100%] max-w-[100%] rounded"
              src={imageUrl(collection.collectionId, image.imageId)}
              onMouseDown={createRectangle}
              alt={image.title}
              draggable={false}
              data-testid="active-slide"
            />
            {image.links.map((link) => (
              <PercentageBoxButton
                onClick={() => editRectangle(link)}
                clickable={action.name === "none"}
                key={link.linkId}
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

        <ImagesSidebar
          collection={collection}
          currentImage={image}
          onDeleteImage={deleteImage}
          onSelectImage={(image) => {
            cancelActiveRectangle();
            setImageId(image.imageId);
          }}
          moveImage={moveImage}
        />
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

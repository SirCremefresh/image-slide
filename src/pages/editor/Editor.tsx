import { useCallback, useEffect, useMemo, useState } from "react";
import "./Editor.css";
import { PaintingState } from "./painting-state.ts";
import { useImageRectangle } from "../../hooks/ImageRectangle.ts";
import { PercentageBoxButton } from "../../components/BoxButton.tsx";
import { FloatingToolbar } from "../../components/FloatingToolbar.tsx";
import { useParams } from "react-router-dom";
import { useCollection } from "../../api-client/collections.ts";
import { Collection, Image, Link } from "@common/models/collection.ts";
import LinkEditModal from "../../components/LinkEditModal.tsx";
import { ImageUploadModal } from "../../components/ImageUploadModal.tsx";
import {
  PercentagePoint,
  toPercentPoint,
  toRelativePoint,
} from "@common/models/points.ts";
import {
  buildPercentageRectangle,
  PercentageRectangle,
  toRelativeRectangle,
  ViewportRectangle,
} from "@common/models/rectangles.ts";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";
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

function CreateLinkRectangle({
  imageRef,
  image,
  start,
  onFinish,
}: {
  imageRef: HTMLImageElement | null;
  image: ViewportRectangle;
  start: PercentagePoint;
  onFinish: (rectangle: PercentageRectangle) => void;
  images: Image[];
}) {
  const mouseState = useMouseState(start, imageRef, image);
  const percentageRectangle = useMemo(() => {
    return buildPercentageRectangle(start, mouseState.point);
  }, [start, mouseState]);

  useEffect(() => {
    if (!mouseState.mouseDown || !mouseState.onImage) {
      console.log("onFinish");
      onFinish(percentageRectangle);
      return;
    }
  }, [percentageRectangle, mouseState, onFinish]);

  return (
    <PercentageBoxButton
      rectangle={percentageRectangle}
      clickable={false}
    ></PercentageBoxButton>
  );
}

function EditorLoaded(props: { collection: Collection; secret: string }) {
  const [collection, setCollection] = useState<Collection>(props.collection);
  const [imageId, setImageId] = useState<string | undefined>(
    collection.images.at(0)?.imageId
  );
  const [linkEditModalOpen, setLinkEditModalOpen] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);
  const [painting, setPainting] = useState<PaintingState | undefined>(
    undefined
  );
  const [createRectangleState, setCreateRectangleState] = useState<
    { start: PercentagePoint } | undefined
  >(undefined);
  const [imageRectangle, imageRef, setImageRef] = useImageRectangle();

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

  const image = useMemo(() => {
    const image = collection.images.find((image) => image.imageId === imageId);
    if (!image) throw new Error(`Image with id ${imageId} not found`);
    return image;
  }, [collection, imageId]);

  const createRectangle = (e: React.MouseEvent) => {
    if (painting) return;
    const relativePoint = toRelativePoint(imageRectangle, {
      viewportX: e.pageX,
      viewportY: e.pageY,
    });
    const percentagePoint = toPercentPoint(imageRectangle, relativePoint);
    setCreateRectangleState({ start: percentagePoint });
  };

  const finishRectangle = () => {
    if (!createRectangleState) return;
    setCreateRectangleState(undefined);
    // setLinkEditModalOpen(true);
  };

  const handleEditTitle = (newTitle: string) => {
    const newCollection = {
      ...collection,
      title: newTitle,
    };
    setCollection(newCollection);
    safeCollection(newCollection).then(() => console.log("saved"));
  };

  const handleCreate = () => {
    console.log("Create");
  };

  const handleEditMode = () => {
    console.log("Edit mode");
  };

  const handleUpload = () => {
    setFileUploadModalOpen(true);
  };

  const onLinkCreate = (targetImage: Image) => {
    if (!painting) return;
    console.log("onLinkCreate", targetImage);
    console.log("painting", painting.rectangle);

    const newCollection: Collection = {
      ...collection,
      images: collection.images.map((image): Image => {
        if (image.imageId !== imageId) return image;
        return {
          ...image,
          links: [
            ...image.links,
            {
              imageId: targetImage.imageId,
              rectangle: painting.rectangle,
            },
          ],
        };
      }),
    };

    setCollection(newCollection);
    safeCollection(newCollection).then(() => console.log("saved"));
    setPainting(undefined);
  };

  const onFileUploaded = (newImage: Image) => {
    setCollection((collection) => {
      const newCollection = {
        ...collection,
        images: [...collection.images, newImage],
      };
      safeCollection(newCollection).then(() => console.log("saved"));
      console.log("onFileUploaded", newImage);
      return newCollection;
    });
  };

  const editRectangle = (link: Link) => {
    setPainting({
      mode: "update",
      start: toRelativeRectangle(imageRectangle, link.rectangle),
      rectangle: link.rectangle,
      link: link,
    });
    setCollection((collection) => {
      return {
        ...collection,
        images: collection.images.map((image): Image => {
          if (image.imageId !== imageId) return image;
          return {
            ...image,
            links: image.links.filter((l) => l !== link),
          };
        }),
      };
    });
  };

  const onLinkEditCanceled = () => {
    setPainting(undefined);
  };
  return (
    <div className={"min-h-screen bg-gray-300 px-2"}>
      <div className={"grid grid-cols-[1fr_300px] grid-rows-[120px_1fr]"}>
        <div className={"col-span-2"}>
          <FloatingToolbar
            initialTitle={collection.title}
            onTitleChange={handleEditTitle}
            onCreate={handleCreate}
            onEditMode={handleEditMode}
            onUpload={handleUpload}
          />
        </div>
        <div className={""}>
          <div
            className="relative inline-block flex-1 select-none"
            draggable={false}
          >
            <img
              ref={setImageRef}
              className="block max-h-[100%] max-w-[100%] rounded"
              src={imageUrl(collection.collectionId, image.imageId)}
              alt={image.title}
              draggable={false}
              onMouseDown={createRectangle}
            />
            {image.links.map((link, index) => (
              <PercentageBoxButton
                onClick={() => editRectangle(link)}
                clickable={createRectangleState === undefined}
                key={index}
                rectangle={link.rectangle}
              ></PercentageBoxButton>
            ))}
            {createRectangleState && (
              <CreateLinkRectangle
                onFinish={finishRectangle}
                start={createRectangleState.start}
                imageRef={imageRef}
                image={imageRectangle}
                images={collection.images}
              ></CreateLinkRectangle>
            )}
          </div>
        </div>
        <div
          className={"rounded-lg border border-gray-300 bg-white p-2 shadow-md"}
        >
          {collection.images.map((image, index) => (
            <div
              onClick={() => setImageId(image.imageId)}
              key={index}
              className={"relative"}
            >
              <img
                className={"w-[100%] rounded object-cover"}
                src={imageUrl(collection.collectionId, image.imageId)}
                alt={image.title}
                loading={"lazy"}
              />
              <div
                className={
                  "absolute bottom-0 left-0 w-[100%] rounded-b-lg bg-black/50"
                }
              >
                <span className={"text-sm font-semibold text-white"}>
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {linkEditModalOpen && (
        <LinkEditModal
          onLinkCreated={onLinkCreate}
          images={collection.images}
          setOpenModal={setLinkEditModalOpen}
          onCanceled={onLinkEditCanceled}
        />
      )}
      {fileUploadModalOpen && (
        <ImageUploadModal
          secret={props.secret}
          setOpenModal={setFileUploadModalOpen}
          onFileUploaded={onFileUploaded}
          collectionId={collection.collectionId}
        />
      )}
    </div>
  );
}

export default Editor;

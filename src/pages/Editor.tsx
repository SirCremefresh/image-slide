import { MouseEvent, useCallback, useMemo, useState } from "react";
import "./Editor.css";
import {
  initialPaintingState,
  PaintingState,
} from "@common/models/painting-state.ts";
import { useImageRectangle } from "../hooks/ImageRectangle.ts";
import { PercentageBoxButton } from "../components/BoxButton.tsx";
import { FloatingToolbar } from "../components/FloatingToolbar.tsx";
import { useParams } from "react-router-dom";
import { useCollection } from "../api-client/collections.ts";
import { Collection, Image } from "@common/models/collection.ts";
import LinkEditModal from "../components/LinkEditModal.tsx";
import { ImageUploadModal } from "../components/ImageUploadModal.tsx";
import { toRelativePoint } from "@common/models/points.ts";
import {
  buildRelativeRectangle,
  toPercentRectangle,
} from "@common/models/rectangles.ts";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";

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
  const [imageRectangle, imageRef] = useImageRectangle();

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

  const createRectangle = (e: MouseEvent) => {
    const relativePoint = toRelativePoint(imageRectangle, {
      viewportX: e.pageX,
      viewportY: e.pageY,
    });
    setPainting(initialPaintingState(relativePoint));
  };

  const updateRectangle = (e: MouseEvent) => {
    if (!painting) return;
    const start = painting.start;
    const currentMousePosition = toRelativePoint(imageRectangle, {
      viewportX: e.pageX,
      viewportY: e.pageY,
    });
    const relativeRectangle = buildRelativeRectangle(
      start,
      currentMousePosition
    );
    const percentageRectangle = toPercentRectangle(
      imageRectangle,
      relativeRectangle
    );

    setPainting({
      start: start,
      rectangle: percentageRectangle,
    });
  };

  const finishRectangle = () => {
    if (!painting) return;
    setLinkEditModalOpen(true);
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
              ref={imageRef}
              className="block max-h-[100%] max-w-[100%] rounded"
              src={imageUrl(collection.collectionId, image.imageId)}
              alt={image.title}
              draggable={false}
              onMouseDown={createRectangle}
              onMouseMove={updateRectangle}
              onMouseUp={finishRectangle}
              onMouseLeave={finishRectangle}
            />
            {image.links.map((link, index) => (
              <PercentageBoxButton
                onClick={() => setImageId(link.imageId)}
                clickable={painting === undefined}
                key={index}
                rectangle={link.rectangle}
              ></PercentageBoxButton>
            ))}
            {painting && (
              <PercentageBoxButton
                rectangle={painting.rectangle}
              ></PercentageBoxButton>
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

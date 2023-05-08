import { MouseEvent, useCallback, useState } from "react";
import "./Editor.css";
import {
  buildRelativeRectangle,
  initialPaintingState,
  PaintingState,
  toPercentRectangle,
  toRelativePoint,
} from "../models/graphic.ts";
import { useImageRectangle } from "../hooks/ImageRectangle.ts";
import { PercentageBoxButton } from "../components/BoxButton.tsx";
import { FloatingToolbar } from "../components/FloatingToolbar.tsx";
import { useParams } from "react-router-dom";
import { useCollection } from "../api-client/collections.ts";
import { assertNotNull } from "../util/assert.ts";
import { Collection, Image } from "../models/image.ts";
import Modal from "../components/Modal.tsx";

function Editor() {
  const { collectionId, secret } = useParams<{
    collectionId: string;
    secret: string;
  }>();
  const { data } = useCollection(assertNotNull(collectionId));

  if (data === undefined) return <div>Loading...</div>;
  return (
    <EditorLoaded
      collection={data}
      secret={assertNotNull(secret)}
    ></EditorLoaded>
  );
}

function EditorLoaded(props: { collection: Collection; secret: string }) {
  const [collection, setCollection] = useState<Collection>(props.collection);
  const [imageId, setImageId] = useState<string>(collection.initialImageId);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
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

  const image = () => {
    const image = collection.images.find((image) => image.imageId === imageId);
    if (!image) throw new Error(`Image with id ${imageId} not found`);
    return image;
  };

  const createRectangle = (e: MouseEvent) => {
    const relativePoint = toRelativePoint(imageRectangle, {
      viewportX: e.clientX,
      viewportY: e.clientY,
    });
    setPainting(initialPaintingState(relativePoint));
  };

  const updateRectangle = (e: MouseEvent) => {
    if (!painting) return;
    const start = painting.start;
    const currentMousePosition = toRelativePoint(imageRectangle, {
      viewportX: e.clientX,
      viewportY: e.clientY,
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

    const newCollection: Collection = {
      ...collection,
      images: collection.images.map((image): Image => {
        if (image.imageId !== imageId) return image;
        return {
          ...image,
          links: [
            ...image.links,
            {
              imageId: "imageId",
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

  const handleEditTitle = () => {
    console.log("Edit title");
  };

  const handleCreate = () => {
    console.log("Create");
  };

  const handleEditMode = () => {
    console.log("Edit mode");
  };

  const handleUpload = () => {
    setUploadModalOpen(true);
  };

  return (
    <div className={"min-h-screen bg-gray-300 px-2"}>
      <div className={"flex flex-row gap-2 pt-[80px]"}>
        <div className="relative inline-block select-none" draggable={false}>
          <img
            ref={imageRef}
            className="block max-h-[100%] max-w-[100%] rounded"
            src={
              "/api/collections/" +
              collection.collectionId +
              "/images/" +
              image().imageId
            }
            alt={image().title}
            draggable={false}
            onMouseDown={createRectangle}
            onMouseMove={updateRectangle}
            onMouseUp={finishRectangle}
            onMouseLeave={finishRectangle}
          />
          {image().links.map((link, index) => (
            <PercentageBoxButton
              onClick={() => setImageId(link.imageId)}
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
        <div
          className={"rounded-lg border border-gray-300 bg-white p-2 shadow-md"}
        >
          {props.collection.images.map((image, index) => (
            <div key={index} className={"flex flex-col gap-2"}>
              <img
                className={"h-30 w-80 rounded object-cover"}
                src={
                  "/api/collections/" +
                  collection.collectionId +
                  "/images/" +
                  image.imageId
                }
                alt={image.title}
              />
              <span className={"text-sm"}>{image.title}</span>
            </div>
          ))}
        </div>
      </div>

      <FloatingToolbar
        initialTitle="Collection Title"
        onTitleChange={handleEditTitle}
        onCreate={handleCreate}
        onEditMode={handleEditMode}
        onUpload={handleUpload}
      />

      {uploadModalOpen && <Modal setOpenModal={setUploadModalOpen} />}
    </div>
  );
}

export default Editor;

import { useMemo, useState } from "react";
import "./Viewer.css";
import { useCollection } from "../api-client/collections.ts";
import { Collection } from "@common/models/image.ts";
import { PercentageBoxButton } from "../components/BoxButton.tsx";
import { useParams } from "react-router-dom";
import { assertNotNull } from "../util/assert.ts";

function Viewer() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { data } = useCollection(assertNotNull(collectionId));

  if (data === undefined) return <div>Loading...</div>;
  return <ViewerLoaded collection={data}></ViewerLoaded>;
}

function ViewerLoaded(props: { collection: Collection }) {
  const [imageId, setImageId] = useState<string>(
    props.collection.initialImageId
  );

  const image = useMemo(() => {
    const image = props.collection.images.find(
      (image) => image.imageId === imageId
    );
    if (!image) throw new Error(`Image with id ${imageId} not found`);
    return image;
  }, [props.collection, imageId]);

  const links = useMemo(
    () =>
      image.links.map((link, index) => {
        return (
          <PercentageBoxButton
            onClick={() => setImageId(link.imageId)}
            clickable={true}
            key={index}
            rectangle={link.rectangle}
          ></PercentageBoxButton>
        );
      }),
    [image]
  );

  return (
    <div className={"grid min-h-screen place-content-center"}>
      <div className="relative inline-block select-none" draggable={false}>
        <img
          className="block max-h-[100%] max-w-[100%]"
          src={
            "/api/collections/" +
            props.collection.collectionId +
            "/images/" +
            image.imageId
          }
          alt={image.title}
          draggable={false}
        />
        {links}
      </div>
    </div>
  );
}

export default Viewer;

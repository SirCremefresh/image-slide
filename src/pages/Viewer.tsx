import { useMemo, useState } from "react";
import "./Viewer.css";
import { useCollection } from "../api-client/collections.ts";
import { Collection } from "@common/models/collection.ts";
import { PercentageBoxButton } from "../components/BoxButton.tsx";
import { useParams } from "react-router-dom";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";

function Viewer() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { data } = useCollection(assertNotNullOrUndefined(collectionId));

  if (data === undefined) return <div>Loading...</div>;
  return <ViewerLoaded collection={data}></ViewerLoaded>;
}

function ViewerLoaded(props: { collection: Collection }) {
  const [imageId, setImageId] = useState<string | undefined>(
    props.collection.images.at(0)?.imageId
  );

  const current = useMemo(() => {
    if (imageId === undefined) return undefined;

    const image = props.collection.images.find(
      (image) => image.imageId === imageId
    );
    if (image === undefined) return undefined;

    const links = image.links.map((link, index) => {
      return (
        <PercentageBoxButton
          onClick={() => setImageId(link.imageId)}
          clickable={true}
          key={index}
          rectangle={link.rectangle}
        ></PercentageBoxButton>
      );
    });

    return {
      image,
      links,
    };
  }, [props.collection, imageId]);

  if (current === undefined) return <div>Loading...</div>;

  return (
    <div className={"grid min-h-screen place-content-center"}>
      <div className="relative inline-block select-none" draggable={false}>
        <img
          className="block max-h-[100%] max-w-[100%]"
          src={
            "/api/collections/" +
            props.collection.collectionId +
            "/images/" +
            current.image.imageId
          }
          alt={current.image.title}
          draggable={false}
        />
        {current.links}
      </div>
    </div>
  );
}

export default Viewer;

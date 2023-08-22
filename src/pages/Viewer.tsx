import { useEffect, useMemo } from "react";
import "./Viewer.css";
import { useCollection } from "../api-client/collections.ts";
import { PercentageBoxButton } from "../components/BoxButton.tsx";
import { Collection, Image } from "@common/models/collection.ts";
import {
  assertNotNullOrUndefined,
  isNullOrUndefined,
} from "@common/util/assert-util.ts";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { preloadImages } from "../util/preload-image.ts";

function Viewer() {
  const { collectionId, imageId } = useParams<{
    collectionId: string;
    imageId: string;
  }>();
  const { data } = useCollection(assertNotNullOrUndefined(collectionId));

  const image = data?.images.find((image) => image.imageId === imageId);

  if (data === undefined) return <div>Loading...</div>;

  if (isNullOrUndefined(image)) {
    const firstImageId = data.images.at(0)?.imageId;
    if (isNullOrUndefined(firstImageId))
      return <div>No images in collection</div>;
    return <Navigate to={"/view/" + collectionId + "/" + firstImageId} />;
  }
  return <ViewerLoaded collection={data} image={image}></ViewerLoaded>;
}

function getImageSrc(collectionId: string, imageId: string): string {
  return "/api/collections/" + collectionId + "/images/" + imageId;
}

function ViewerLoaded(props: { collection: Collection; image: Image }) {
  const navigate = useNavigate();

  const links = useMemo(() => {
    return props.image.links.map((link) => {
      return (
        <PercentageBoxButton
          onClick={() =>
            navigate(
              "/view/" +
                props.collection.collectionId +
                "/" +
                link.targetImageId,
            )
          }
          clickable={true}
          key={link.linkId}
          rectangle={link.rectangle}
        ></PercentageBoxButton>
      );
    });
  }, [navigate, props.collection.collectionId, props.image.links]);

  useEffect(() => {
    console.log("Preloading images");
    const srcs = props.image.links.map((link) =>
      getImageSrc(props.collection.collectionId, link.targetImageId),
    );
    // noinspection JSIgnoredPromiseFromCall
    preloadImages(srcs);
  }, [props.collection.collectionId, props.image.imageId, props.image.links]);

  return (
    <div className={"grid min-h-screen place-content-center"}>
      <div className="relative inline-block select-none" draggable={false}>
        <img
          className="block max-h-[100%] max-w-[100%]"
          src={getImageSrc(props.collection.collectionId, props.image.imageId)}
          alt={props.image.title}
          draggable={false}
        />
        {links}
      </div>
    </div>
  );
}

export default Viewer;

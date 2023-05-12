import {
  buildPercentageRectangle,
  ViewportRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { Image, Link } from "@common/models/collection.ts";
import { useEffect, useMemo, useState } from "react";
import { useMouseState } from "./use-mouse-state.ts";
import { PercentageBoxButton } from "../../components/BoxButton.tsx";
import LinkEditModal from "../../components/LinkEditModal.tsx";

export function CreateLinkRectangle({
  imageRef,
  image,
  start,
  onCreate: propOnCreate,
  onCancel,
  images,
}: {
  imageRef: HTMLImageElement | null;
  image: ViewportRectangle;
  start: PercentagePoint;
  onCreate: (link: Link) => void;
  onCancel: () => void;
  images: Image[];
}) {
  const [state, setState] = useState<"painting" | "link-target">("painting");
  const mouseState = useMouseState(
    start,
    imageRef,
    image,
    state === "painting"
  );
  const percentageRectangle = useMemo(() => {
    return buildPercentageRectangle(start, mouseState.point);
  }, [start, mouseState]);

  useEffect(() => {
    if (state !== "painting") return;
    if (!mouseState.mouseDown || !mouseState.onImage) {
      setState("link-target");
      return;
    }
  }, [percentageRectangle, mouseState, state]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: percentageRectangle,
    });
  };

  return (
    <>
      <PercentageBoxButton
        rectangle={percentageRectangle}
        clickable={false}
        showCorners={true}
      ></PercentageBoxButton>
      {state == "link-target" && (
        <LinkEditModal
          onLinkCreated={onCreate}
          images={images}
          onCanceled={onCancel}
        />
      )}
    </>
  );
}

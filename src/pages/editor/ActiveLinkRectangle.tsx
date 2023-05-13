import {
  buildPercentageRectangle,
  Corner,
  getOppositeCorner,
  getPercentagePointOfCorner,
  PercentageRectangle,
  ViewportRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { Image, Link } from "@common/models/collection.ts";
import { useEffect, useState } from "react";
import { useMouseState } from "./use-mouse-state.ts";
import { PercentageBoxButton } from "../../components/BoxButton.tsx";
import LinkEditModal from "../../components/LinkEditModal.tsx";

export type ActiveRectangleState =
  | { mode: "create"; start: PercentagePoint }
  | { mode: "edit"; link: Link };

export function ActiveLinkRectangle({
  imageRef,
  image,
  state,
  onCreate: propOnCreate,
  onCancel,
  images,
}: {
  imageRef: HTMLImageElement | null;
  image: ViewportRectangle;
  state: ActiveRectangleState;
  onCreate: (link: Link) => void;
  onCancel: () => void;
  images: Image[];
}) {
  const [step, setStep] = useState<
    | { name: "painting" | "viewing" | "link-target" }
    | {
        name: "painting-from";
        corner: Corner;
      }
  >({ name: state.mode === "create" ? "painting" : "viewing" });
  const [currentPercentageRectangle, setCurrentPercentageRectangle] =
    useState<PercentageRectangle>(
      state.mode === "create"
        ? {
            ...state.start,
            percentageWidth: 0,
            percentageHeight: 0,
          }
        : state.link.rectangle
    );
  const mouseState = useMouseState(
    state.mode === "create" ? state.start : state.link.rectangle,
    imageRef,
    image,
    true
  );

  useEffect(() => {
    if (
      step.name === "painting" &&
      (!mouseState.mouseDown || !mouseState.onImage)
    ) {
      setStep({ name: "link-target" });
      return;
    }
    if (
      step.name === "painting-from" &&
      (!mouseState.mouseDown || !mouseState.onImage)
    ) {
      console.log("painting-from -> viewing");
      setStep({ name: "viewing" });
      return;
    }
    if (state.mode === "create" && step.name === "painting") {
      setCurrentPercentageRectangle(
        buildPercentageRectangle(state.start, mouseState.point)
      );
      return;
    }
    if (state.mode === "edit" && step.name === "painting-from") {
      console.log("painting-from");
      setCurrentPercentageRectangle(
        buildPercentageRectangle(
          getPercentagePointOfCorner(
            state.link.rectangle,
            getOppositeCorner(step.corner)
          ),
          mouseState.point
        )
      );
      return;
    }
  }, [setStep, state, step, mouseState]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: currentPercentageRectangle,
    });
  };

  return (
    <>
      <PercentageBoxButton
        rectangle={currentPercentageRectangle}
        onCornerMouseDown={(corner) => {
          console.log("to painting-from", mouseState);
          setStep({ name: "painting-from", corner });
        }}
        clickable={step.name === "viewing"}
        showCorners={step.name === "viewing" || step.name === "painting-from"}
      ></PercentageBoxButton>
      {step.name === "link-target" && (
        <LinkEditModal
          onLinkCreated={onCreate}
          images={images}
          onCanceled={onCancel}
        />
      )}
    </>
  );
}

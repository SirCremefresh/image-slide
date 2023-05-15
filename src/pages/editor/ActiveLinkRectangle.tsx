import {
  buildPercentageRectangle,
  buildPercentageRectangleCorners,
  PercentageRectangleCorners,
  ViewportRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { Image, Link } from "@common/models/collection.ts";
import { useEffect, useState } from "react";
import { useMouseState } from "./use-mouse-state.ts";
import { PercentageBoxCornerButton } from "../../components/BoxButton.tsx";
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
        fixedCorner: PercentagePoint;
      }
  >({ name: state.mode === "create" ? "painting" : "viewing" });
  const [currentPercentageRectangle, setCurrentPercentageRectangle] =
    useState<PercentageRectangleCorners>(
      state.mode === "create"
        ? {
            point1: state.start,
            point2: state.start,
          }
        : buildPercentageRectangleCorners(state.link.rectangle)
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

    if (state.mode === "create" && step.name === "painting") {
      setCurrentPercentageRectangle({
        point1: state.start,
        point2: mouseState.point,
      });
      return;
    }
    if (state.mode === "edit" && step.name === "painting-from") {
      setCurrentPercentageRectangle({
        point1: step.fixedCorner,
        point2: mouseState.point,
      });
      return;
    }
  }, [mouseState, state, step]);
  useEffect(() => {
    if (
      state.mode === "edit" &&
      step.name === "painting-from" &&
      (!mouseState.mouseDown || !mouseState.onImage)
    ) {
      console.log("to link-target", mouseState);
      setStep({ name: "viewing" });
      // propOnCreate({
      //         ...state.link,
      //         rectangle: currentPercentageRectangle,
      //     }
      // )
      return;
    }
  }, [mouseState, state, step]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: buildPercentageRectangle(
        currentPercentageRectangle.point1,
        currentPercentageRectangle.point2
      ),
    });
  };

  return (
    <>
      <PercentageBoxCornerButton
        rectangle={currentPercentageRectangle}
        onCornerMouseDown={(corner) => {
          console.log("to painting-from", mouseState);
          setStep({ name: "painting-from", fixedCorner: corner });
        }}
        clickable={step.name === "viewing"}
        showCorners={step.name === "viewing" || step.name === "painting-from"}
      ></PercentageBoxCornerButton>
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

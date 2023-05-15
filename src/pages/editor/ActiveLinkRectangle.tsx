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

type Step =
  | { name: "viewing" | "link-target" }
  | {
      name: "painting";
      fixedCorner: PercentagePoint;
    };

function getInitialStep(state: ActiveRectangleState): Step {
  if (state.mode === "create")
    return { name: "painting", fixedCorner: state.start };
  return { name: "viewing" };
}

function getInitialRectangle(
  state: ActiveRectangleState
): PercentageRectangleCorners {
  if (state.mode === "create")
    return { point1: state.start, point2: state.start };
  return buildPercentageRectangleCorners(state.link.rectangle);
}

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
  const [step, setStep] = useState<Step>(getInitialStep(state));
  const [currentRectangle, setCurrentRectangle] =
    useState<PercentageRectangleCorners>(getInitialRectangle(state));
  const mouseState = useMouseState(
    currentRectangle.point1,
    imageRef,
    image,
    true
  );

  useEffect(() => {
    if (step.name === "painting") {
      setCurrentRectangle({
        point1: step.fixedCorner,
        point2: mouseState.point,
      });
      return;
    }
  }, [mouseState, step]);

  useEffect(() => {
    if (mouseState.active) return;

    if (state.mode === "create" && step.name === "painting") {
      setStep({ name: "link-target" });
      return;
    }
    if (state.mode === "edit" && step.name === "painting") {
      setStep({ name: "viewing" });
      propOnCreate({
        ...state.link,
        rectangle: buildPercentageRectangle(currentRectangle),
      });
      return;
    }
  }, [currentRectangle, mouseState.active, propOnCreate, state, step.name]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: buildPercentageRectangle(currentRectangle),
    });
  };

  return (
    <>
      <PercentageBoxCornerButton
        rectangle={currentRectangle}
        onCornerMouseDown={(corner) => {
          setStep({ name: "painting", fixedCorner: corner });
        }}
        clickable={step.name === "viewing"}
        showCorners={step.name === "viewing" || step.name === "painting"}
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

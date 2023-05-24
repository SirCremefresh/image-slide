import {
  addPercentagePoints,
  buildPercentageRectangle,
  buildPercentageRectangleCorners,
  getPercentagePointOfCorner,
  PercentageRectangleCorners,
  subtractPercentagePoints,
  ViewportRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import {
  fitPercentageRectangleCorners,
  Image,
  Link,
} from "@common/models/collection.ts";
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
      name: "moving";
      topLeftOffset: PercentagePoint;
    }
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
  onDelete: propOnDelete,
  onCancel,
  images,
}: {
  imageRef: HTMLImageElement | null;
  image: ViewportRectangle;
  state: ActiveRectangleState;
  onCreate: (link: Link) => void;
  onCancel: () => void;
  onDelete: (link: Link) => void;
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
      setCurrentRectangle(
        fitPercentageRectangleCorners({
          point1: step.fixedCorner,
          point2: mouseState.point,
        })
      );
      return;
    }
    if (step.name === "moving") {
      setCurrentRectangle((rectangle) => {
        const currentTopLeftCorner = getPercentagePointOfCorner(
          buildPercentageRectangle(rectangle),
          "top-left"
        );
        const currentBottomRightCorner = getPercentagePointOfCorner(
          buildPercentageRectangle(rectangle),
          "bottom-right"
        );
        const newTopLeftCorner = subtractPercentagePoints(
          mouseState.point,
          step.topLeftOffset
        );
        const topLeftCornerChange = subtractPercentagePoints(
          newTopLeftCorner,
          currentTopLeftCorner
        );
        const bottomRightCorner = addPercentagePoints(
          topLeftCornerChange,
          currentBottomRightCorner
        );
        return fitPercentageRectangleCorners({
          point1: newTopLeftCorner,
          point2: bottomRightCorner,
        });
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
    if (state.mode === "edit" && ["painting", "moving"].includes(step.name)) {
      setStep({ name: "viewing" });
      const fitted = fitPercentageRectangleCorners(currentRectangle);
      setCurrentRectangle(fitted);
      propOnCreate({
        ...state.link,
        rectangle: buildPercentageRectangle(fitted),
      });
      return;
    }
  }, [currentRectangle, mouseState.active, propOnCreate, state, step.name]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: buildPercentageRectangle(
        fitPercentageRectangleCorners(currentRectangle)
      ),
    });
  };

  const onDelete = () => {
    if (state.mode === "edit") {
      console.log("deleting");
      propOnDelete(state.link);
    }
  };

  return (
    <>
      <PercentageBoxCornerButton
        rectangle={currentRectangle}
        onCornerMouseDown={(oppositeCorner) => {
          setStep({ name: "painting", fixedCorner: oppositeCorner });
        }}
        onMouseDown={() => {
          const topLeftCorner = getPercentagePointOfCorner(
            buildPercentageRectangle(currentRectangle),
            "top-left"
          );
          const topLeftOffset = subtractPercentagePoints(
            mouseState.point,
            topLeftCorner
          );
          console.log("to moving");
          setStep({ name: "moving", topLeftOffset: topLeftOffset });
        }}
        onDeleteClick={onDelete}
        clickable={step.name === "viewing"}
        showToolbar={step.name === "viewing"}
        showCorners={true}
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

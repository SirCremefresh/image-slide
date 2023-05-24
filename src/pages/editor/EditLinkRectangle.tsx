import { MouseState } from "./use-mouse-state.ts";
import {
  fitPercentageRectangleCorners,
  Link,
} from "@common/models/collection.ts";
import { useEffect, useState } from "react";
import {
  addPercentagePoints,
  buildPercentageRectangle,
  buildPercentageRectangleCorners,
  getPercentagePointOfCorner,
  PercentageRectangleCorners,
  subtractPercentagePoints,
} from "@common/models/rectangles.ts";
import { PercentageBoxCornerButton } from "../../components/BoxButton.tsx";
import { PercentagePoint } from "@common/models/points.ts";

type Step =
  | {
      name: "viewing";
    }
  | {
      name: "moving";
      topLeftOffset: PercentagePoint;
    }
  | {
      name: "painting";
      fixedCorner: PercentagePoint;
    };

function moveRectangle(
  rectangle: PercentageRectangleCorners,
  mouseState: MouseState,
  step: {
    name: "moving";
    topLeftOffset: PercentagePoint;
  }
) {
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
  const corners: PercentageRectangleCorners = {
    point1: newTopLeftCorner,
    point2: bottomRightCorner,
  };
  return corners;
}

export function EditLinkRectangle({
  mouseState,
  link,
  onUpdate,
  onDelete,
}: {
  mouseState: MouseState;
  link: Link;
  onUpdate: (link: Link) => void;
  onDelete: (link: Link) => void;
}) {
  const [step, setStep] = useState<Step>({ name: "viewing" });
  const [currentRectangle, setCurrentRectangle] =
    useState<PercentageRectangleCorners>(
      buildPercentageRectangleCorners(link.rectangle)
    );

  useEffect(() => {
    if (step.name === "painting") {
      setCurrentRectangle({
        point1: step.fixedCorner,
        point2: mouseState.point,
      });
      return;
    }
    if (step.name === "moving") {
      setCurrentRectangle((rectangle) => {
        const corners = moveRectangle(rectangle, mouseState, step);
        return fitPercentageRectangleCorners(corners);
      });
      return;
    }
  }, [mouseState, step]);

  useEffect(() => {
    if (mouseState.active) return;

    if (["painting", "moving"].includes(step.name)) {
      setStep({ name: "viewing" });
      const fitted = fitPercentageRectangleCorners(currentRectangle);
      setCurrentRectangle(fitted);
      onUpdate({
        ...link,
        rectangle: buildPercentageRectangle(fitted),
      });
    }
  }, [currentRectangle, link, mouseState.active, onUpdate, step.name]);

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
          setStep({ name: "moving", topLeftOffset: topLeftOffset });
        }}
        onDeleteClick={() => onDelete(link)}
        clickable={step.name === "viewing"}
        showToolbar={step.name === "viewing"}
        showCorners={true}
      ></PercentageBoxCornerButton>
    </>
  );
}

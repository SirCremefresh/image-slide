import {
  buildPercentageRectangle,
  fitPercentageRectangle,
  PercentageRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { Image, Link } from "@common/models/collection.ts";
import { useEffect, useState } from "react";
import { MouseState } from "./use-mouse-state.ts";
import { PercentageBoxCornerButton } from "../../components/BoxButton.tsx";
import LinkEditModal from "../../components/LinkEditModal.tsx";

type Step =
  | { name: "viewing" | "link-target" }
  | {
      name: "painting";
      fixedCorner: PercentagePoint;
    };

export function CreateLinkRectangle({
  mouseState,
  start,
  onCreate: propOnCreate,
  onCancel,
  images,
}: {
  mouseState: MouseState;
  start: PercentagePoint;
  onCreate: (link: Link) => void;
  onCancel: () => void;
  images: Image[];
}) {
  const [step, setStep] = useState<Step>({
    name: "painting",
    fixedCorner: start,
  });
  const [currentRectangle, setCurrentRectangle] = useState<PercentageRectangle>(
    { ...start, percentageWidth: 0, percentageHeight: 0 }
  );

  useEffect(() => {
    if (step.name === "painting") {
      setCurrentRectangle(
        fitPercentageRectangle(
          buildPercentageRectangle(step.fixedCorner, mouseState.point)
        )
      );
      return;
    }
  }, [mouseState, step]);

  useEffect(() => {
    if (mouseState.active) return;

    if (step.name === "painting") {
      setStep({ name: "link-target" });
      return;
    }
  }, [mouseState.active, step.name]);

  const onCreate = (targetImage: Image) => {
    propOnCreate({
      linkId: crypto.randomUUID(),
      targetImageId: targetImage.imageId,
      rectangle: fitPercentageRectangle(currentRectangle),
    });
  };

  return (
    <>
      <PercentageBoxCornerButton
        rectangle={currentRectangle}
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

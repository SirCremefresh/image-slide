import {
  PercentagePoint,
  toPercentPoint,
  toRelativePoint,
} from "@common/models/points.ts";
import { ViewportRectangle } from "@common/models/rectangles.ts";
import { useEffect, useState } from "react";

export function useMouseState(
  start: PercentagePoint,
  imageRef: HTMLImageElement | null,
  image: ViewportRectangle
) {
  const [mouseState, setMouseState] = useState<{
    point: PercentagePoint;
    onImage: boolean;
    mouseDown: boolean;
  }>({
    point: start,
    onImage: true,
    mouseDown: true,
  });

  useEffect(() => {
    if (!imageRef) return;

    const onMouseMove = (e: MouseEvent) => {
      const currentMousePosition = toRelativePoint(image, {
        viewportX: e.pageX,
        viewportY: e.pageY,
      });
      const percentageMousePosition = toPercentPoint(
        image,
        currentMousePosition
      );
      setMouseState((mouseState) => ({
        ...mouseState,
        point: percentageMousePosition,
      }));
    };

    const onMouseUp = (e: MouseEvent) => {
      const currentMousePosition = toRelativePoint(image, {
        viewportX: e.pageX,
        viewportY: e.pageY,
      });
      const percentageMousePosition = toPercentPoint(
        image,
        currentMousePosition
      );
      setMouseState((mouseState) => ({
        ...mouseState,
        point: percentageMousePosition,
        mouseDown: false,
      }));
    };

    const onMouseLeave = (e: MouseEvent) => {
      const currentMousePosition = toRelativePoint(image, {
        viewportX: e.pageX,
        viewportY: e.pageY,
      });

      const percentageMousePosition = toPercentPoint(
        image,
        currentMousePosition
      );
      setMouseState((mouseState) => ({
        ...mouseState,
        point: percentageMousePosition,
        onImage: false,
      }));
    };

    imageRef.addEventListener("mousemove", onMouseMove);
    imageRef.addEventListener("mouseup", onMouseUp);
    imageRef.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (!imageRef) return;
      imageRef.removeEventListener("mousemove", onMouseMove);
      imageRef.removeEventListener("mouseup", onMouseUp);
      imageRef.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [image, imageRef]);
  return mouseState;
}

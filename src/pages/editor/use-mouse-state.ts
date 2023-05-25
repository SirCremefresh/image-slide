import {
  PercentagePoint,
  toPercentPoint,
  toRelativePoint,
} from "@common/models/points.ts";
import { ViewportRectangle } from "@common/models/rectangles.ts";
import { useEffect, useState } from "react";

export type MouseState = {
  point: PercentagePoint;
  onElement: boolean;
  mouseDown: boolean;
  active: boolean;
};

export function useMouseState(
  container: HTMLElement | null,
  imageRef: HTMLElement | null,
  image: ViewportRectangle
): MouseState {
  const [mouseState, setMouseState] = useState<MouseState>({
    point: { percentageX: 0, percentageY: 0 },
    onElement: true,
    mouseDown: true,
    active: true,
  });

  useEffect(() => {
    if (!imageRef || !container) return;

    const onMouseMove = (e: MouseEvent) => {
      const currentMousePosition = toRelativePoint(image, {
        viewportX: e.pageX,
        viewportY: e.pageY,
      });
      currentMousePosition.relativeY += container.scrollTop;
      currentMousePosition.relativeX += container.scrollLeft;
      const percentageMousePosition = toPercentPoint(
        image,
        currentMousePosition
      );
      console.log("scroll", container.scrollTop, container.scrollLeft);
      setMouseState((mouseState) => ({
        ...mouseState,
        point: percentageMousePosition,
      }));
    };

    const onMouseUp = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        mouseDown: false,
        active: false,
      }));
    };
    const onMouseDown = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        mouseDown: true,
        active: mouseState.onElement,
      }));
    };

    const onMouseLeave = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        onElement: false,
        active: false,
      }));
    };
    const onMouseEnter = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        onElement: true,
        active: mouseState.mouseDown,
      }));
    };

    imageRef.addEventListener("mousemove", onMouseMove);
    imageRef.addEventListener("mouseup", onMouseUp);
    imageRef.addEventListener("mouseleave", onMouseLeave);
    imageRef.addEventListener("mousedown", onMouseDown);
    imageRef.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (!imageRef) return;
      imageRef.removeEventListener("mousemove", onMouseMove);
      imageRef.removeEventListener("mouseup", onMouseUp);
      imageRef.removeEventListener("mouseleave", onMouseLeave);
      imageRef.removeEventListener("mousedown", onMouseDown);
      imageRef.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [container, image, imageRef]);
  return mouseState;
}

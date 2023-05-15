import {
  PercentagePoint,
  toPercentPoint,
  toRelativePoint,
} from "@common/models/points.ts";
import { ViewportRectangle } from "@common/models/rectangles.ts";
import { useEffect, useState } from "react";

type MouseState = {
  point: PercentagePoint;
  onImage: boolean;
  mouseDown: boolean;
};

export function useMouseState(
  start: PercentagePoint,
  imageRef: HTMLImageElement | null,
  image: ViewportRectangle,
  trackMousePosition: boolean
) {
  const [mouseState, setMouseState] = useState<MouseState>({
    point: start,
    onImage: true,
    mouseDown: true,
  });

  useEffect(() => {
    if (!imageRef || !trackMousePosition) return;

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

    const onMouseUp = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        mouseDown: false,
      }));
    };
    const onMouseDown = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        mouseDown: true,
      }));
    };

    const onMouseLeave = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        onImage: false,
      }));
    };
    const onMouseEnter = () => {
      setMouseState((mouseState) => ({
        ...mouseState,
        onImage: true,
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
  }, [image, imageRef, trackMousePosition]);
  return mouseState;
}

export function useMouseOnState(
  initial: boolean,
  elementRef: HTMLElement | null
) {
  const [mouseState, setMouseState] = useState<{
    onElement: boolean;
  }>({
    onElement: initial,
  });

  useEffect(() => {
    if (!elementRef) return;

    const onMouseEnter = () => {
      setMouseState({
        onElement: true,
      });
    };
    const onMouseLeave = () => {
      setMouseState({
        onElement: false,
      });
    };

    elementRef.addEventListener("mouseleave", onMouseLeave);
    elementRef.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (!elementRef) return;
      elementRef.addEventListener("mouseleave", onMouseLeave);
      elementRef.addEventListener("mouseenter", onMouseEnter);
    };
  }, [elementRef]);
  return mouseState;
}

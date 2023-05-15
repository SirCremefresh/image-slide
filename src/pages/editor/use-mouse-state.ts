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
  start: PercentagePoint,
  imageRef: HTMLElement | null,
  image: ViewportRectangle,
  trackMousePosition: boolean
) {
  const [mouseState, setMouseState] = useState<MouseState>({
    point: start,
    onElement: true,
    mouseDown: true,
    active: true,
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

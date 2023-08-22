import {
  PercentagePoint,
  RelativePoint,
  moveRelativePoint,
  toPercentPoint,
  toRelativePoint,
} from "@common/models/points.ts";
import { ViewportRectangle } from "@common/models/rectangles.ts";
import { useEffect, useState } from "react";

export type MouseState = {
  readonly point: PercentagePoint;
  readonly onElement: boolean;
  readonly mouseDown: boolean;
  readonly active: boolean;
};

type MouseStateInternal = MouseState & {
  readonly containerRelativeMousePoint: RelativePoint;
  readonly containerScroll: RelativePoint;
};

export function useMouseState(
  container: HTMLElement | null,
  imageRef: HTMLElement | null,
  image: ViewportRectangle,
): MouseState {
  const [mouseState, setMouseState] = useState<MouseStateInternal>({
    point: { percentageX: 0, percentageY: 0 },
    containerRelativeMousePoint: { relativeX: 0, relativeY: 0 },
    containerScroll: { relativeX: 0, relativeY: 0 },
    onElement: true,
    mouseDown: true,
    active: true,
  });

  useEffect(() => {
    if (!imageRef || !container) return;

    const onMouseMove = (e: MouseEvent) => {
      setMouseState((mouseState) => {
        const containerRelativeMousePoint = toRelativePoint(image, {
          viewportX: e.pageX,
          viewportY: e.pageY,
        });
        const offsetMousePosition = moveRelativePoint(
          containerRelativeMousePoint,
          mouseState.containerScroll,
        );
        const percentageMousePosition = toPercentPoint(
          image,
          offsetMousePosition,
        );
        return {
          ...mouseState,
          containerRelativeMousePoint,
          point: percentageMousePosition,
        };
      });
    };

    const onScroll = () => {
      setMouseState((mouseState) => {
        const containerScroll: RelativePoint = {
          relativeX: container.scrollLeft,
          relativeY: container.scrollTop,
        };
        const offsetMousePosition = moveRelativePoint(
          mouseState.containerRelativeMousePoint,
          containerScroll,
        );
        const percentageMousePosition = toPercentPoint(
          image,
          offsetMousePosition,
        );
        return {
          ...mouseState,
          containerScroll,
          point: percentageMousePosition,
        };
      });
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
    container.addEventListener("scroll", onScroll);
    onScroll();
    return () => {
      if (container) {
        container.removeEventListener("scroll", onScroll);
      }
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

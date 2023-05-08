import { useCallback, useEffect, useState } from "react";
import { ViewportRectangle } from "../models/graphic.ts";

export function useImageRectangle(): [
  ViewportRectangle,
  (node: HTMLImageElement) => void
] {
  const [imageSize, setImageSize] = useState<ViewportRectangle>({
    width: 0,
    height: 0,
    viewportX: 0,
    viewportY: 0,
  });
  const [node, setNode] = useState<HTMLImageElement | null>(null);

  const refCallback = useCallback((node: HTMLImageElement) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (!node) {
      return;
    }
    const resizeObserver = new ResizeObserver(([image]) => {
      const rect = image.target.getBoundingClientRect();
      setImageSize({
        width: image.contentRect.width,
        height: image.contentRect.height,
        viewportX: rect.x,
        viewportY: rect.y,
      });
    });
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, [node]);

  return [imageSize, refCallback];
}

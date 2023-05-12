import { useEffect, useState } from "react";

import { ViewportRectangle } from "@common/models/rectangles.ts";

export function useImageRectangle(): [
  ViewportRectangle,
  HTMLImageElement | null,
  (node: HTMLImageElement) => void
] {
  const [imageSize, setImageSize] = useState<ViewportRectangle>({
    width: 0,
    height: 0,
    viewportX: 0,
    viewportY: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef) {
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
    resizeObserver.observe(imageRef);
    return () => resizeObserver.disconnect();
  }, [imageRef]);

  return [imageSize, imageRef, setImageRef];
}

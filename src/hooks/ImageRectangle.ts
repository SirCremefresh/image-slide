import { ViewportRectangle } from "@common/models/rectangles.ts";
import { useEffect, useState } from "react";

export function useImageRectangle(): [
  ViewportRectangle,
  HTMLImageElement | null,
  (node: HTMLImageElement) => void,
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
      const newVar = {
        width: image.contentRect.width,
        height: image.contentRect.height,
        viewportX: imageRef.offsetLeft,
        viewportY: imageRef.offsetTop,
      };
      setImageSize(newVar);
    });
    resizeObserver.observe(imageRef);

    const newVar = {
      width: imageRef.naturalWidth,
      height: imageRef.naturalHeight,
      viewportX: imageRef.offsetLeft,
      viewportY: imageRef.offsetTop,
    };
    setImageSize(newVar);
    return () => resizeObserver.disconnect();
  }, [imageRef]);

  return [imageSize, imageRef, setImageRef];
}

import {MutableRefObject, useEffect, useState} from "react";
import {ViewportRectangle} from "../models/graphic.ts";


export function useImageRectangle(imageRef: MutableRefObject<HTMLImageElement | null>): ViewportRectangle {
    const [imageSize, setImageSize] = useState<ViewportRectangle>({width: 0, height: 0, viewportX: 0, viewportY: 0});

    useEffect(() => {
        if (!imageRef.current) return; // wait for the elementRef to be available
        const resizeObserver = new ResizeObserver(([image]) => {
            const rect = image.target.getBoundingClientRect();
            setImageSize({
                width: image.contentRect.width,
                height: image.contentRect.height,
                viewportX: rect.x,
                viewportY: rect.y,
            });
        });
        resizeObserver.observe(imageRef.current);
        return () => resizeObserver.disconnect(); // clean up
    }, [imageRef]);
    return imageSize;
}

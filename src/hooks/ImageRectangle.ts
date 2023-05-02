import {useCallback, useEffect, useState} from "react";
import {ViewportRectangle} from "../models/graphic.ts";


export function useImageRectangle(): [ViewportRectangle, (node: HTMLImageElement) => void] {
    const [imageSize, setImageSize] = useState<ViewportRectangle>({width: 0, height: 0, viewportX: 0, viewportY: 0});
    const [node, setNode] = useState<HTMLImageElement | null>(null);

    const refCallback = useCallback((node: HTMLImageElement) => {
        console.log('useImageRectangle callback', node);
        if (node !== null) {
            setNode(node);
            const rect = node.getBoundingClientRect();

            setImageSize({
                width: rect.width,
                height: rect.height,
                viewportX: rect.x,
                viewportY: rect.y,
            });
        }
    }, [])

    useEffect(() => {
        console.log('useImageRectangle effect', node)
        if (!node) {
            return;
        } // wait for the elementRef to be available
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
        return () => resizeObserver.disconnect(); // clean up
    }, [node]);

    return [imageSize, refCallback]

    // return { height, refCallback }
    // useEffect(() => {
    //     console.log('useImageRectangle')
    //     if (!imageRef.current) {
    //         console.log('no imageRef');
    //         return;
    //     } // wait for the elementRef to be available
    //     const resizeObserver = new ResizeObserver(([image]) => {
    //         const rect = image.target.getBoundingClientRect();
    //         setImageSize({
    //             width: image.contentRect.width,
    //             height: image.contentRect.height,
    //             viewportX: rect.x,
    //             viewportY: rect.y,
    //         });
    //     });
    //     resizeObserver.observe(imageRef.current);
    //     return () => resizeObserver.disconnect(); // clean up
    // }, [imageRef, data]);
    // return imageSize;
}

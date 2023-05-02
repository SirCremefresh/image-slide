import {MouseEvent, useState} from 'react'
import './Editor.css'
import {
    buildRelativeRectangle,
    initialPaintingState,
    PaintingState,
    PercentageRectangle,
    toPercentRectangle,
    toRelativePoint,
    toRelativeRectangle
} from "./models/graphic.ts";
import {RectangleDiv} from "./RectangleDiv.tsx";
import {useImageRectangle} from "./hooks/ImageRectangle.ts";
import {images} from "./store.ts";


function Editor() {
    const [imageId, setImageId] = useState<string>('Basis');
    const [painting, setPainting] = useState<PaintingState | undefined>(undefined);
    const [rectangles, setRectangles] = useState<PercentageRectangle[]>([]);
    const [imageRectangle, imageRef] = useImageRectangle();


    const image = () => {
        const image = images[imageId];
        if (!image) throw new Error(`Image with id ${imageId} not found`);
        return image;
    };

    const createRectangle = (e: MouseEvent) => {
        const relativePoint = toRelativePoint(imageRectangle, {viewportX: e.clientX, viewportY: e.clientY})
        setPainting(initialPaintingState(relativePoint));
    };

    const updateRectangle = (e: MouseEvent) => {
        if (!painting) return;
        const start = painting.start;
        const currentMousePosition = toRelativePoint(imageRectangle, {viewportX: e.clientX, viewportY: e.clientY})

        setPainting({
            start: start,
            rectangle: buildRelativeRectangle(start, currentMousePosition)
        });
    };

    const finishRectangle = () => {
        if (!painting) return;

        const percentageRectangle = toPercentRectangle(imageRectangle, painting.rectangle);

        setRectangles((rectangles) => [...rectangles, percentageRectangle]);
        setPainting(undefined);
    }

    const getRectangles = () => {
        return rectangles.map(
            (rectangle) => toRelativeRectangle(imageRectangle, rectangle)
        );
    }

    return (
        <div className="paintArea">
            <img ref={imageRef}
                 className="image"
                 src={image().src}
                 alt={image().title}
                 draggable={false}
                 onMouseDown={createRectangle}
                 onMouseMove={updateRectangle}
                 onMouseUp={finishRectangle}
                 onMouseLeave={finishRectangle}
            />
            {image().links.map((link, index) => (
                <RectangleDiv
                    onClick={() => setImageId(link.targetId)}
                    key={index}
                    rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
                ></RectangleDiv>
            ))}
            {getRectangles().map((rectangle, index) => (
                <RectangleDiv
                    key={index}
                    rectangle={rectangle}
                ></RectangleDiv>
            ))}
            {
                painting &&
                <RectangleDiv
                    rectangle={painting.rectangle}
                ></RectangleDiv>
            }
        </div>
    );
}


export default Editor

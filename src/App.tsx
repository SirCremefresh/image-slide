import {MouseEvent, MutableRefObject, useEffect, useRef, useState} from 'react'
import './App.css'
import useSWR from "swr";
import {
    buildRelativeRectangle,
    PercentageRectangle,
    RelativePoint,
    RelativeRectangle,
    toPercentRectangle,
    toRelativePoint,
    toRelativeRectangle,
    ViewportRectangle
} from "./model.ts";
import {RectangleDiv} from "./RectangleDiv.tsx";

const fetcher = (args: RequestInfo) => fetch(args).then(res => res.json())


function Profile() {
    const {data, error} = useSWR('/api/hello', fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div>
            <h1>{data.name}</h1>
        </div>
    )
}

type Link = {
    targetId: string,
    rectangle: PercentageRectangle,
};
type Image = {
    id: string,
    title: string,
    src: string,
    links: Array<Link>,
}

const images: Image[] = [
    {
        id: 'Basis',
        title: 'Basis',
        src: './Basis.jpg',
        links: [
            {
                targetId: 'Bedeutung',
                rectangle: {
                    percentageWidth: 9.078014184397164,
                    percentageHeight: 7.0962319151599695,
                    percentageX: 21.134751773049647,
                    percentageY: 19.55577015934331
                },
            },
        ],
    },
    {
        id: 'Bedeutung',
        title: 'Bedeutung',
        src: './Bedeutung.jpg',
        links: [],
    },
]

type PaintingState = { start: RelativePoint, rectangle: RelativeRectangle };

function initialPaintingState(start: RelativePoint): PaintingState {
    return {
        start,
        rectangle: {
            width: 0,
            height: 0,
            relativeX: start.relativeX,
            relativeY: start.relativeY,
        }
    }
}

function useImageRectangle(imageRef: MutableRefObject<HTMLImageElement | null>): ViewportRectangle {
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


function App() {
    const [imageId, setImageId] = useState<string>('Basis');

    const [painting, setPainting] = useState<PaintingState | undefined>(undefined);
    const [rectangles, setRectangles] = useState<PercentageRectangle[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageRectangle = useImageRectangle(imageRef);

    const image = () => {
        const image = images.find((image) => image.id === imageId);
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
        <div
            className="paintArea"
        >
            <img ref={imageRef}
                 className="image"
                 src={'./Basis.jpg'}
                 alt="Background"
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


export default App

import {MouseEvent, MutableRefObject, useEffect, useRef, useState} from 'react'
import './App.css'
import useSWR from "swr";
import {PercentageRectangle, Point, Rectangle, toPercentRectangle, toRectangle, ViewportRectangle} from "./model.ts";
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

const images = [
    {
        src: './Basis.jpg',
    },
    {
        src: './Bedeutung.jpg',
    },
]

type PaintingState = { start: Point, rectangle: Rectangle };

function initialPaintingState(start: Point): PaintingState {
    return {
        start,
        rectangle: {
            width: 0,
            height: 0,
            x: start.x,
            y: start.y,
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
    const [painting, setPainting] = useState<PaintingState | undefined>(undefined);
    const [rectangles, setRectangles] = useState<PercentageRectangle[]>([
        {
            percentageWidth: 9.078014184397164,
            percentageHeight: 7.0962319151599695,
            percentageX: 21.134751773049647,
            percentageY: 19.55577015934331
        },
    ]);
    const imageRef = useRef<HTMLImageElement>(null);
    const imageRectangle = useImageRectangle(imageRef);

    const createRectangle = (e: MouseEvent) => {
        const x = e.clientX - imageRectangle.viewportX;
        const y = e.clientY - imageRectangle.viewportY;

        setPainting(initialPaintingState({x, y}));
    };

    const updateRectangle = (e: MouseEvent) => {
        if (!painting) return;

        const x = e.clientX - imageRectangle.viewportX;
        const y = e.clientY - imageRectangle.viewportY;

        const width = Math.abs(x - painting.start.x);
        const height = Math.abs(y - painting.start.y);

        setPainting(
            {
                start: painting.start,
                rectangle: {
                    width: width,
                    height: height,
                    x: x < painting.start.x ? painting.start.x - width : painting.start.x,
                    y: y < painting.start.y ? painting.start.y - height : painting.start.y,
                }
            });
    };

    const finishRectangle = () => {
        if (!painting) return;

        const percentageRectangle = toPercentRectangle(imageRectangle, painting.rectangle);

        console.log(percentageRectangle);

        setRectangles((rectangles) => [...rectangles, percentageRectangle]);
        setPainting(undefined);
    }

    const getRectangles = () => {
        return rectangles.map(
            (rectangle) => toRectangle(imageRectangle, rectangle)
        );
    }

    return (
        <div
            className="paintArea"
            onMouseDown={createRectangle}
            onMouseUp={finishRectangle}
            onMouseLeave={finishRectangle}
            onMouseMove={updateRectangle}
        >
            <img ref={imageRef} className="image" src={'./Basis.jpg'} alt="Background" draggable={false}/>
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

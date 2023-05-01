import {MouseEvent, useEffect, useRef, useState} from 'react'
import './App.css'
import useSWR from "swr";

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

// function App() {
//     const [index, setIndex] = useState(0);
//     const [testDiv, setTestDiv] = useState({
//         top: '100px',
//         left: '100px',
//         width: '100px',
//         height: '200px',
//     });
//     const [imageInfo, setImageInfo] = useState<undefined | { offsetHeight: number, offsetWith: number }>(undefined)
//     const [dragInfo, setDragInfo] = useState<undefined | { startX: number, startY: number }>(undefined)
//
//     const next = () => setIndex(current => (current + 1) % images.length)
//     const currentImage = () => images[index];
//
//     const imageRef = useRef<HTMLImageElement>(null);
//
//     const onDragStart = (e: DragEvent<HTMLImageElement>) => {
//         // e.preventDefault();
//         let newVar = {
//             startX: e.clientX,
//             startY: e.clientY
//         };
//         setDragInfo(newVar);
//         console.log('drag start', newVar)
//         // return false;
//     }
//     const onDragEnd = (e: DragEvent<HTMLImageElement>) => {
//         // e.preventDefault();
//         const newVar = {
//             top: `${dragInfo!.startY}px`,
//             left: `${dragInfo!.startX}px`,
//             height: `${e.clientY - dragInfo!.startY}px`,
//             width: `${e.clientX - dragInfo!.startX}px`,
//         };
//         setTestDiv(newVar);
//         console.log('drag end', newVar)
//         // return false;
//     }
//     const onDrag = (e: DragEvent<HTMLImageElement>) => {
//         // e.preventDefault();
//         const newVar = {
//             top: `${dragInfo!.startY}px`,
//             left: `${dragInfo!.startX}px`,
//             height: `${e.clientY - dragInfo!.startY}px`,
//             width: `${e.clientX - dragInfo!.startX}px`,
//         };
//         setTestDiv(newVar);
//         console.log('drag', newVar)
//         // return false;
//     }
//
//     const onImgLoad: ReactEventHandler<HTMLImageElement> = (e: SyntheticEvent<HTMLImageElement>) => {
//         console.log('onLoad', e);
//         setImageInfo({
//             offsetHeight: e.currentTarget.offsetHeight,
//             offsetWith: e.currentTarget.offsetWidth
//         });
//     }
//
//     return (
//         <>
//             <img
//                 ref={imageRef}
//                 onDragStart={onDragStart}
//                 onDragEnd={onDragEnd}
//                 onDrag={onDrag}
//                 onDragOver={e => e.preventDefault()}
//                 onClick={next}
//                 onLoad={onImgLoad}
//                 className={'large-img'}
//                 src={currentImage().src}
//             ></img>
//             {imageRef.current?.src}
//             {JSON.stringify(imageInfo)}
//             {JSON.stringify(dragInfo)}
//             <div style={{
//                 border: '1px solid black',
//                 top: testDiv.top,
//                 left: testDiv.left,
//                 width: testDiv.width,
//                 height: testDiv.height,
//                 position: 'absolute'
//             }}>
//
//             </div>
//         </>
//     )
// }

type Point = {
    x: number;
    y: number;
}
type ScaledPoint = {
    scaledX: number;
    scaledY: number;
}

type Size = { width: number, height: number };
type ScaledSize = { scaledWith: number, scaledHeight: number };

type Rectangle = Point & Size;
type ScaledRectangle = ScaledPoint & ScaledSize;

type PaintingState = { start: Point, rectangle: Rectangle };


function initialPaintingState(x: number, y: number): PaintingState {
    return {
        start: {x, y},
        rectangle: {
            width: 0,
            height: 0,
            x,
            y,
        }
    }
}

function App() {
    const [painting, setPainting] = useState<PaintingState | undefined>(undefined);
    const [rectangles, setRectangles] = useState<ScaledRectangle[]>([
        {
            scaledWith: 9.078014184397164,
            scaledHeight: 7.0962319151599695,
            scaledX: 21.134751773049647,
            scaledY: 19.55577015934331
        },
    ]);
    const [imageSize, setImageSize] = useState<Size>({width: 0, height: 0});
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imageRef.current) return; // wait for the elementRef to be available
        const resizeObserver = new ResizeObserver(() => {
            if (!imageRef.current) return; // wait for the elementRef to be available
            setImageSize({
                width: imageRef.current.offsetWidth,
                height: imageRef.current.offsetHeight
            });
        });
        resizeObserver.observe(imageRef.current);
        return () => resizeObserver.disconnect(); // clean up
    }, []);

    const createRectangle = (e: MouseEvent) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPainting(initialPaintingState(x, y));
    };

    const updateRectangle = (e: MouseEvent) => {
        if (!painting || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

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
        if (!painting || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const scaledWith = 100 / rect.width * painting.rectangle.width;
        const scaledHeight = 100 / rect.height * painting.rectangle.height;
        const scaledX = 100 / rect.width * painting.rectangle.x;
        const scaledY = 100 / rect.height * painting.rectangle.y;

        const scaledRectangle = {
            scaledWith, scaledHeight,
            scaledX, scaledY
        }

        console.log(scaledRectangle);

        setRectangles((rectangles) => [...rectangles, scaledRectangle]);
        setPainting(undefined);
    }

    const getRectangles = () => {
        const imageWith = imageSize.width;
        const imageHeight = imageSize.height;

        return rectangles.map((rectangle) => ({
            width: imageWith / 100 * rectangle.scaledWith,
            height: imageHeight / 100 * rectangle.scaledHeight,
            x: imageWith / 100 * rectangle.scaledX,
            y: imageHeight / 100 * rectangle.scaledY,
        }))
    }

    const getRectangleStyle = (rectangle: Rectangle) => {
        return {
            top: rectangle.y + 'px',
            left: rectangle.x + 'px',
            width: rectangle.width + 'px',
            height: rectangle.height + 'px',
        }
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
                <div
                    key={index}
                    className={'square'}
                    style={getRectangleStyle(rectangle)}
                ></div>
            ))}
            {
                painting &&
                <div
                    className={'square'}
                    style={getRectangleStyle(painting.rectangle)}
                >
                </div>
            }
        </div>
    );
}


export default App

import {useEffect, useRef, useState} from 'react'
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


function App() {
    const [painting, setPainting] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const paintAreaRef = useRef<HTMLDivElement>(null);
    const rectangleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMouseUp = () => {
            setPainting(false);
            setStartPoint(null);
        };
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const createRectangle = (e: React.MouseEvent) => {
        if (!paintAreaRef.current) return;

        const rect = paintAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPoint({x, y});

        const rectangle = document.createElement('div');
        rectangle.className = 'square';
        rectangle.style.left = `${x}px`;
        rectangle.style.top = `${y}px`;
        paintAreaRef.current.appendChild(rectangle);
        rectangleRef.current = rectangle;
    };

    const updateRectangle = (e: React.MouseEvent) => {
        if (!painting || !startPoint || !rectangleRef.current || !paintAreaRef.current) return;

        const rect = paintAreaRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = Math.abs(x - startPoint.x);
        const height = Math.abs(y - startPoint.y);

        rectangleRef.current.style.width = `${width}px`;
        rectangleRef.current.style.height = `${height}px`;
        rectangleRef.current.style.left = `${x < startPoint.x ? startPoint.x - width : startPoint.x}px`;
        rectangleRef.current.style.top = `${y < startPoint.y ? startPoint.y - height : startPoint.y}px`;
    };
    return (
        <div
            className="paintArea"
            ref={paintAreaRef}
            onMouseDown={(e) => {
                setPainting(true);
                createRectangle(e);
            }}
            onMouseMove={updateRectangle}
        >
            <img className="image" src={'./Basis.jpg'} alt="Background" draggable={false}/>
        </div>
    );
}


export default App

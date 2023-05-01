import {useRef, useState} from 'react'
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

function App() {
    const [index, setIndex] = useState(0)
    const [imageInfo, setImageInfo] = useState<undefined | { offsetHeight: number, offsetWith: number }>(undefined)

    const next = () => setIndex(current => (current + 1) % images.length)
    const currentImage = () => images[index];

    const imageRef = useRef<HTMLImageElement>(null);

    const onDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
        console.log(e)
        return false;
    }

    const onImgLoad: React.ReactEventHandler<HTMLImageElement> = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.log('onLoad', e);
        setImageInfo({
            offsetHeight: e.currentTarget.offsetHeight,
            offsetWith: e.currentTarget.offsetWidth
        });
    }

    return (
        <>
            <img
                ref={imageRef}
                onDragStart={onDragStart}
                onClick={next}
                onLoad={onImgLoad}
                className={'large-img'}
                src={currentImage().src}
            ></img>
            {imageRef.current?.src}
            {JSON.stringify(imageInfo)}
            <div style={{
                border: '1px solid black',
                top: '100px',
                left: '100px',
                width: '100px',
                height: '200px',
                position: 'absolute'
            }}>

            </div>
        </>
    )
}

export default App

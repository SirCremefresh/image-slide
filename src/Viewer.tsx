import {useState} from 'react'
import './Viewer.css'
import {toRelativeRectangle} from "./models/graphic.ts";
import {RectangleDiv} from "./RectangleDiv.tsx";
import {useImageRectangle} from "./hooks/ImageRectangle.ts";
import {fetcher} from "./api-client/collections.ts";
import useSWR from "swr";
import {Images} from "./models/image.ts";


function Viewer() {
    const {data} = useSWR<Images>(`/api/collections/${'some-id'}`, fetcher);

    if (data === undefined) return <div>Loading...</div>;
    return (
        <ViewerLoaded collection={data}></ViewerLoaded>
    );
}

function ViewerLoaded(props: { collection: Images }) {
    const [imageId, setImageId] = useState<string>('Basis');
    const [imageRectangle, imageRef] = useImageRectangle();

    const image = () => {
        const image = props.collection[imageId];
        console.log(image);
        if (!image) throw new Error(`Image with id ${imageId} not found`);
        return image;
    };

    return (
        <div className="paintArea">
            <img ref={imageRef}
                 className="image"
                 src={image().src}
                 alt={image().title}
                 draggable={false}
            />
            {image().links.map((link, index) => {
                console.log("render link", imageRectangle)
                return (
                    <RectangleDiv
                        onClick={() => setImageId(link.targetId)}
                        clickable={true}
                        key={index}
                        rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
                    ></RectangleDiv>
                );
            })}
        </div>
    );
}

export default Viewer

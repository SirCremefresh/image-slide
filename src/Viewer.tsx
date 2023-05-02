import {useRef, useState} from 'react'
import './Viewer.css'
import {toRelativeRectangle} from "./models/graphic.ts";
import {RectangleDiv} from "./RectangleDiv.tsx";
import {useImageRectangle} from "./hooks/ImageRectangle.ts";
import {images} from "./store.ts";


function Viewer() {
    const [imageId, setImageId] = useState<string>('Basis');
    const imageRef = useRef<HTMLImageElement>(null);
    const imageRectangle = useImageRectangle(imageRef);

    const image = () => {
        const image = images[imageId];
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
            {image().links.map((link, index) => (
                <RectangleDiv
                    onClick={() => setImageId(link.targetId)}
                    clickable={true}
                    key={index}
                    rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
                ></RectangleDiv>
            ))}
        </div>
    );
}


export default Viewer

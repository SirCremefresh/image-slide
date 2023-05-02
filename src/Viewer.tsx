import {useMemo, useState} from 'react'
import './Viewer.css'
import {toRelativeRectangle} from "./models/graphic.ts";
import {RectangleDiv} from "./RectangleDiv.tsx";
import {useImageRectangle} from "./hooks/ImageRectangle.ts";
import {useCollection} from "./api-client/collections.ts";
import {Images} from "./models/image.ts";


function Viewer() {
    const {data} = useCollection('some-collection-id');

    if (data === undefined) return <div>Loading...</div>;
    return (
        <ViewerLoaded collection={data}></ViewerLoaded>
    );
}

function ViewerLoaded(props: { collection: Images }) {
    const [imageId, setImageId] = useState<string>('Basis');
    const [imageRectangle, imageRef] = useImageRectangle();

    const image = useMemo(() => {
        const image = props.collection[imageId];
        if (!image) throw new Error(`Image with id ${imageId} not found`);
        return image;
    }, [props.collection, imageId]);

    const links = useMemo(() => image.links.map((link, index) => {
            return (
                <RectangleDiv
                    onClick={() => setImageId(link.targetId)}
                    clickable={true}
                    key={index}
                    rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
                ></RectangleDiv>
            );
        }), [image, imageRectangle]);

    return (
        <div className="paintArea">
            <img ref={imageRef}
                 className="image"
                 src={image.src}
                 alt={image.title}
                 draggable={false}
            />
            {links}
        </div>
    );
}

export default Viewer

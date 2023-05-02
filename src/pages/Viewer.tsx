import {useMemo, useState} from 'react'
import './Viewer.css'
import {toRelativeRectangle} from "../models/graphic.ts";
import {useImageRectangle} from "../hooks/ImageRectangle.ts";
import {useCollection} from "../api-client/collections.ts";
import {Collection} from "../models/image.ts";
import {BoxButton} from "../components/BoxButton.tsx";


function Viewer() {
    const {data} = useCollection('some-collection-id');

    if (data === undefined) return <div>Loading...</div>;
    return (
        <ViewerLoaded collection={data}></ViewerLoaded>
    );
}

function ViewerLoaded(props: { collection: Collection }) {
    const [imageId, setImageId] = useState<string>('Basis');
    const [imageRectangle, imageRef] = useImageRectangle();

    const image = useMemo(() => {
        const image = props.collection.images[imageId];
        if (!image) throw new Error(`Image with id ${imageId} not found`);
        return image;
    }, [props.collection, imageId]);

    const links = useMemo(() => image.links.map((link, index) => {
        return (
            <BoxButton
                onClick={() => setImageId(link.targetId)}
                clickable={true}
                key={index}
                rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
            ></BoxButton>
        );
    }), [image, imageRectangle]);

    return (
        <div className={"min-h-screen grid place-content-center"}>
            <div className="relative inline-block select-none" draggable={false}>
                <img ref={imageRef}
                     className="block max-w-[100%] max-h-[100%]"
                     src={image.src}
                     alt={image.title}
                     draggable={false}
                />
                {links}
            </div>
        </div>
    );
}

export default Viewer

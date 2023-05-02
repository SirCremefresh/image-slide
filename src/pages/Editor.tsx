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
} from "../models/graphic.ts";
import {useImageRectangle} from "../hooks/ImageRectangle.ts";
import {images} from "../store.ts";
import {BoxButton} from "../components/BoxButton.tsx";
import {FloatingToolbar} from "../components/FloatingToolbar.tsx";


const imageList = Object.values(images);

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

    const handleEditTitle = () => {
        console.log('Edit title');
    };

    const handleCreate = () => {
        console.log('Create');
    };

    const handleEditMode = () => {
        console.log('Edit mode');
    };

    return (
        <>
            <div className={"flex flex-row gap-2"}>
                <div className="relative inline-block select-none" draggable={false}>
                    <img ref={imageRef}
                         className="block max-w-[100%] max-h-[100%] rounded"
                         src={image().src}
                         alt={image().title}
                         draggable={false}
                         onMouseDown={createRectangle}
                         onMouseMove={updateRectangle}
                         onMouseUp={finishRectangle}
                         onMouseLeave={finishRectangle}
                    />
                    {image().links.map((link, index) => (
                        <BoxButton
                            onClick={() => setImageId(link.targetId)}
                            key={index}
                            rectangle={toRelativeRectangle(imageRectangle, link.rectangle)}
                        ></BoxButton>
                    ))}
                    {getRectangles().map((rectangle, index) => (
                        <BoxButton
                            key={index}
                            rectangle={rectangle}
                        ></BoxButton>
                    ))}
                    {
                        painting &&
                        <BoxButton
                            rectangle={painting.rectangle}
                        ></BoxButton>
                    }
                </div>
                <div className={"border-2 border-solid border-amber-950"}>
                    {imageList.map((image, index) => (
                        <div key={index} className={"flex flex-row gap-2"}>
                            <img className={"w-40 h-20 rounded object-cover"} src={image.src} alt={image.title}/>
                            <div className={"flex flex-col"}>
                                <span className={"text-sm"}>{image.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <FloatingToolbar
                initialTitle="Collection Title"
                onTitleChange={handleEditTitle}
                onCreate={handleCreate}
                onEditMode={handleEditMode}
            />
        </>
    );
}


export default Editor

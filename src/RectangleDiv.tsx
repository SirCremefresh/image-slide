import {RelativeRectangle} from "./model.ts";
import './RectangleDiv.css'

export function RectangleDiv(props: { rectangle: RelativeRectangle }) {
    const getRectangleStyle = (rectangle: RelativeRectangle) => {
        return {
            top: rectangle.relativeY + 'px',
            left: rectangle.relativeX + 'px',
            width: rectangle.width + 'px',
            height: rectangle.height + 'px',
        }
    }
    return <div
        className={'rectangle'}
        style={getRectangleStyle(props.rectangle)}
    ></div>
}

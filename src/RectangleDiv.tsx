import {Rectangle} from "./model.ts";
import './RectangleDiv.css'

export function RectangleDiv(props: { rectangle: Rectangle }) {
    const getRectangleStyle = (rectangle: Rectangle) => {
        return {
            top: rectangle.y + 'px',
            left: rectangle.x + 'px',
            width: rectangle.width + 'px',
            height: rectangle.height + 'px',
        }
    }
    return <div
        className={'rectangle'}
        style={getRectangleStyle(props.rectangle)}
    ></div>
}

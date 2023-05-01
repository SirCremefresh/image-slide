import {Rectangle} from "./model.ts";

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
        className={'square'}
        style={getRectangleStyle(props.rectangle)}
    ></div>
}

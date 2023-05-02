import './RectangleDiv.css'
import {RelativeRectangle} from "./models/graphic.ts";

export function RectangleDiv(props: {
    rectangle: RelativeRectangle,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    clickable?: boolean
}) {
    const clickable = props.clickable ?? false;
    const getRectangleStyle = (rectangle: RelativeRectangle) => {
        return {
            top: rectangle.relativeY + 'px',
            left: rectangle.relativeX + 'px',
            width: rectangle.width + 'px',
            height: rectangle.height + 'px',
        }
    }
    return <div
        className={['rectangle', clickable ? 'clickable' : ''].join(' ')}
        onClick={(e) => {
            props.onClick?.(e);
        }}
        style={getRectangleStyle(props.rectangle)}
    >
    </div>
}

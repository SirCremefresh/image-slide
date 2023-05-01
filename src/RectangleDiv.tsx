import {RelativeRectangle} from "./model.ts";
import './RectangleDiv.css'

export function RectangleDiv(props: { rectangle: RelativeRectangle, onClick?: () => void }) {
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
        onClick={(e) => {
            e.preventDefault();
            console.log('click');
        }}
        style={getRectangleStyle(props.rectangle)}
    >

    </div>
}

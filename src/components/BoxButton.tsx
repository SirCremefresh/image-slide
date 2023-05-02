import {MouseEvent} from "react";
import {RelativeRectangle} from "../models/graphic.ts";
import {classNames} from "../util/classNames.ts";

export function BoxButton(props: {
    rectangle: RelativeRectangle,
    onClick?: (event: MouseEvent<HTMLDivElement>) => void,
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
        className={classNames('absolute box-border rounded-md shadow-sm hover:shadow-xl transition-shadow border-indigo-500 border-2 border-dashed bg-sky-500/50', clickable ? 'pointer-events-auto' : 'pointer-events-none')}
        onClick={(e) => {
            props.onClick?.(e);
        }}
        style={getRectangleStyle(props.rectangle)}
    >
    </div>
}

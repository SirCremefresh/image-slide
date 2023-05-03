import {MouseEvent} from "react";
import {PercentageRectangle} from "../models/graphic.ts";
import {classNames} from "../util/classNames.ts";

export function PercentageBoxButton(props: {
    rectangle: PercentageRectangle,
    onClick?: (event: MouseEvent<HTMLDivElement>) => void,
    clickable?: boolean
}) {
    const clickable = props.clickable ?? false;

    return <div
        className={classNames('absolute box-border rounded-md shadow-sm hover:shadow-xl transition-shadow border-indigo-500 border-2 border-dashed bg-sky-500/50', clickable ? 'pointer-events-auto' : 'pointer-events-none')}
        onClick={(e) => {
            props.onClick?.(e);
        }}
        style={{
            top: props.rectangle.percentageY + '%',
            left: props.rectangle.percentageX + '%',
            width: props.rectangle.percentageWidth + '%',
            height: props.rectangle.percentageHeight + '%',
        }}
    >
    </div>
}

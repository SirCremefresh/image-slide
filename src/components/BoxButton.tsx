import { MouseEvent } from "react";
import { classNames } from "../util/class-names.ts";
import {
  Corner,
  getOppositeCorner,
  getPercentagePointOfCorner,
  PercentageRectangle,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { isNullOrUndefined } from "@common/util/assert-util.ts";
import { TrashIcon } from "@heroicons/react/20/solid";

export function PercentageBoxButton(props: {
  rectangle: PercentageRectangle;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  clickable?: boolean;
}) {
  const clickable = props.clickable ?? false;

  return (
    <div
      className={classNames(
        "absolute box-border rounded-md border-2 border-dashed border-indigo-500 bg-sky-500/50 shadow-sm transition-shadow hover:shadow-xl",
        clickable ? "pointer-events-auto" : "pointer-events-none"
      )}
      onClick={(e) => {
        props.onClick?.(e);
      }}
      style={{
        top: props.rectangle.percentageY + "%",
        left: props.rectangle.percentageX + "%",
        width: props.rectangle.percentageWidth + "%",
        height: props.rectangle.percentageHeight + "%",
      }}
    ></div>
  );
}

export function PercentageBoxCornerButton(props: {
  rectangle: PercentageRectangle;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onCornerMouseDown?: (corner: PercentagePoint) => void;
  onDeleteClick?: () => void;
  onMouseDown?: () => void;
  clickable?: boolean;
  showCorners?: boolean;
  showToolbar?: boolean;
}) {
  const clickable = props.clickable ?? false;

  const onCornerMouseDown = (event: MouseEvent, corner: Corner) => {
    if (isNullOrUndefined(props.onCornerMouseDown)) return;
    event.stopPropagation();
    props.onCornerMouseDown(
      getPercentagePointOfCorner(props.rectangle, getOppositeCorner(corner))
    );
  };

  return (
    <div
      className={classNames(
        "absolute box-border rounded-md border-2 border-dashed border-indigo-500 bg-sky-500/50 shadow-sm transition-shadow hover:shadow-xl",
        clickable ? "pointer-events-auto" : "pointer-events-none"
      )}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      style={{
        top: props.rectangle.percentageY + "%",
        left: props.rectangle.percentageX + "%",
        width: props.rectangle.percentageWidth + "%",
        height: props.rectangle.percentageHeight + "%",
      }}
    >
      {props.showToolbar === true && (
        <div
          className="absolute -top-12 left-1 -ml-1.5"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            className={
              "mt-2 flex h-8 flex-row items-center space-x-4 rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-md"
            }
          >
            <TrashIcon
              onClick={props.onDeleteClick}
              className="h-4 w-4 cursor-pointer text-gray-700 transition-colors hover:text-black"
            ></TrashIcon>
          </div>
        </div>
      )}
      {props.showCorners === true && (
        <>
          <div
            onMouseDown={(e) => onCornerMouseDown(e, "top-left")}
            className="absolute left-0 top-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={(e) => onCornerMouseDown(e, "top-right")}
            className="absolute right-0 top-0 -mr-1.5 -mt-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={(e) => onCornerMouseDown(e, "bottom-left")}
            className="absolute bottom-0 left-0 -mb-1.5 -ml-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={(e) => onCornerMouseDown(e, "bottom-right")}
            className="absolute bottom-0 right-0 -mb-1.5 -mr-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
        </>
      )}
    </div>
  );
}

import { MouseEvent } from "react";
import { classNames } from "../util/class-names.ts";
import {
  buildPercentageRectangle,
  Corner,
  getOppositeCorner,
  getPercentagePointOfCorner,
  PercentageRectangle,
  PercentageRectangleCorners,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";

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
  rectangle: PercentageRectangleCorners;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onCornerMouseDown?: (corner: PercentagePoint) => void;
  clickable?: boolean;
  showCorners?: boolean;
}) {
  const clickable = props.clickable ?? false;

  const rectangle = buildPercentageRectangle(props.rectangle);

  const onCornerMouseDown = (corner: Corner) => {
    props.onCornerMouseDown?.(
      getPercentagePointOfCorner(rectangle, getOppositeCorner(corner))
    );
  };

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
        top: rectangle.percentageY + "%",
        left: rectangle.percentageX + "%",
        width: rectangle.percentageWidth + "%",
        height: rectangle.percentageHeight + "%",
      }}
    >
      {props.showCorners === true && (
        <>
          <div
            onMouseDown={() => onCornerMouseDown("top-left")}
            className="absolute left-0 top-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={() => onCornerMouseDown("top-right")}
            className="absolute right-0 top-0 -mr-1.5 -mt-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={() => onCornerMouseDown("bottom-left")}
            className="absolute bottom-0 left-0 -mb-1.5 -ml-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
          <div
            onMouseDown={() => onCornerMouseDown("bottom-right")}
            className="absolute bottom-0 right-0 -mb-1.5 -mr-1.5 h-3 w-3 rounded-full bg-blue-500"
          ></div>
        </>
      )}
    </div>
  );
}

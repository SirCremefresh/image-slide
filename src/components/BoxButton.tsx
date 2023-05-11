import { MouseEvent } from "react";
import { classNames } from "../util/class-names.ts";
import { PercentageRectangle } from "@common/models/rectangles.ts";

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

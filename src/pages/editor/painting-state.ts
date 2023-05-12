import { RelativePoint } from "@common/models/points.ts";
import { PercentageRectangle } from "@common/models/rectangles.ts";
import { Link } from "@common/models/collection.ts";

export type PaintingState =
  | {
      mode: "create";
      start: RelativePoint;
      rectangle: PercentageRectangle;
    }
  | {
      mode: "update";
      start: RelativePoint;
      rectangle: PercentageRectangle;
      link: Link;
    };

export function initialPaintingState(start: RelativePoint): PaintingState {
  return {
    mode: "create",
    start,
    rectangle: {
      percentageWidth: 0,
      percentageHeight: 0,
      percentageX: 0,
      percentageY: 0,
    },
  };
}

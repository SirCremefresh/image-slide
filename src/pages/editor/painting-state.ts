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

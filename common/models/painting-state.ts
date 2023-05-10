import z from "zod";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";
import { RelativePoint, ZRelativePoint } from "@common/models/points.ts";
import {
  PercentageRectangle,
  ZPercentageRectangle,
} from "@common/models/rectangles.ts";

export const ZPaintingState = z.object({
  start: ZRelativePoint,
  rectangle: ZPercentageRectangle,
});
export type PaintingState = {
  start: RelativePoint;
  rectangle: PercentageRectangle;
};

assertType<TypeEqualityGuard<PaintingState, z.infer<typeof ZPaintingState>>>();

export function initialPaintingState(start: RelativePoint): PaintingState {
  return {
    start,
    rectangle: {
      percentageWidth: 0,
      percentageHeight: 0,
      percentageX: 0,
      percentageY: 0,
    },
  };
}

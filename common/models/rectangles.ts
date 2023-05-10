import {
  PercentagePoint,
  RelativePoint,
  ViewportPoint,
  ZPercentagePoint,
  ZRelativePoint,
  ZViewportPoint,
} from "@common/models/points.ts";
import {
  PercentageSize,
  Size,
  ZPercentageSize,
  ZSize,
} from "@common/models/sizes.ts";
import z from "zod";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";
import { toPercentage } from "@common/util/percentage-util.ts";

export const ZRelativeRectangle = ZRelativePoint.merge(ZSize);
export type RelativeRectangle = RelativePoint & Size;
assertType<
  TypeEqualityGuard<RelativeRectangle, z.infer<typeof ZRelativeRectangle>>
>();

export const ZPercentageRectangle = ZPercentagePoint.merge(ZPercentageSize);
export type PercentageRectangle = PercentagePoint & PercentageSize;
assertType<
  TypeEqualityGuard<PercentageRectangle, z.infer<typeof ZPercentageRectangle>>
>();

export const ZViewportRectangle = ZViewportPoint.merge(ZSize);
export type ViewportRectangle = ViewportPoint & Size;
assertType<
  TypeEqualityGuard<ViewportRectangle, z.infer<typeof ZViewportRectangle>>
>();

export function toPercentRectangle(
  full: Size,
  rectangle: RelativeRectangle
): PercentageRectangle {
  return {
    percentageWidth: toPercentage(full.width, rectangle.width),
    percentageHeight: toPercentage(full.height, rectangle.height),
    percentageX: toPercentage(full.width, rectangle.relativeX),
    percentageY: toPercentage(full.height, rectangle.relativeY),
  };
}

export function buildRelativeRectangle(
  point1: RelativePoint,
  point2: RelativePoint
): RelativeRectangle {
  const width = Math.abs(point2.relativeX - point1.relativeX);
  const height = Math.abs(point2.relativeY - point1.relativeY);

  return {
    width: width,
    height: height,
    relativeX:
      point2.relativeX < point1.relativeX
        ? point1.relativeX - width
        : point1.relativeX,
    relativeY:
      point2.relativeY < point1.relativeY
        ? point1.relativeY - height
        : point1.relativeY,
  };
}

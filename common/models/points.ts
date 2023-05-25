import z from "zod";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";
import { Size } from "@common/models/sizes.ts";
import { toPercentage } from "@common/util/percentage-util.ts";
import { ViewportRectangle } from "@common/models/rectangles.ts";

export const ZRelativePoint = z.object({
  relativeX: z.number(),
  relativeY: z.number(),
});
export type RelativePoint = {
  relativeX: number;
  relativeY: number;
};
assertType<TypeEqualityGuard<RelativePoint, z.infer<typeof ZRelativePoint>>>();

export const ZPercentagePoint = z.object({
  percentageX: z.number(),
  percentageY: z.number(),
});
export type PercentagePoint = {
  percentageX: number;
  percentageY: number;
};
assertType<
  TypeEqualityGuard<PercentagePoint, z.infer<typeof ZPercentagePoint>>
>();

export const ZViewportPoint = z.object({
  viewportX: z.number(),
  viewportY: z.number(),
});
export type ViewportPoint = {
  viewportX: number;
  viewportY: number;
};
assertType<TypeEqualityGuard<ViewportPoint, z.infer<typeof ZViewportPoint>>>();

export function toRelativePoint(
  base: ViewportPoint,
  point: ViewportPoint
): RelativePoint {
  return {
    relativeX: point.viewportX - base.viewportX,
    relativeY: point.viewportY - base.viewportY,
  };
}

export function toPercentPoint(
  full: Size,
  rectangle: RelativePoint
): PercentagePoint {
  return {
    percentageX: toPercentage(full.width, rectangle.relativeX),
    percentageY: toPercentage(full.height, rectangle.relativeY),
  };
}

export function moveRelativePoint(base: RelativePoint, delta: RelativePoint) {
  return {
    relativeX: base.relativeX + delta.relativeX,
    relativeY: base.relativeY + delta.relativeY,
  };
}

export function buildPercentPointFromMouseEvent(
  base: ViewportRectangle,
  event: { pageX: number; pageY: number }
): PercentagePoint {
  const relativePoint = toRelativePoint(base, {
    viewportX: event.pageX,
    viewportY: event.pageY,
  });
  return toPercentPoint(base, relativePoint);
}

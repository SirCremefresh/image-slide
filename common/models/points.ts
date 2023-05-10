import z from "zod";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";

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

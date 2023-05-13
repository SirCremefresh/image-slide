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
import { fromPercentage, toPercentage } from "@common/util/percentage-util.ts";

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

export function toRelativeRectangle(
  full: Size,
  rectangle: PercentageRectangle
): RelativeRectangle {
  return {
    width: fromPercentage(full.width, rectangle.percentageWidth),
    height: fromPercentage(full.height, rectangle.percentageHeight),
    relativeX: fromPercentage(full.width, rectangle.percentageX),
    relativeY: fromPercentage(full.height, rectangle.percentageY),
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

export function buildPercentageRectangle(
  point1: PercentagePoint,
  point2: PercentagePoint
): PercentageRectangle {
  const width = Math.abs(point2.percentageX - point1.percentageX);
  const height = Math.abs(point2.percentageY - point1.percentageY);

  return {
    percentageWidth: width,
    percentageHeight: height,
    percentageX:
      point2.percentageX < point1.percentageX
        ? point1.percentageX - width
        : point1.percentageX,
    percentageY:
      point2.percentageY < point1.percentageY
        ? point1.percentageY - height
        : point1.percentageY,
  };
}

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function getPercentagePointOfCorner(
  rectangle: PercentageRectangle,
  corner: Corner
): PercentagePoint {
  switch (corner) {
    case "top-left":
      return {
        percentageX: rectangle.percentageX,
        percentageY: rectangle.percentageY,
      };
    case "top-right":
      return {
        percentageX: rectangle.percentageX + rectangle.percentageWidth,
        percentageY: rectangle.percentageY,
      };
    case "bottom-left":
      return {
        percentageX: rectangle.percentageX,
        percentageY: rectangle.percentageY + rectangle.percentageHeight,
      };
    case "bottom-right":
      return {
        percentageX: rectangle.percentageX + rectangle.percentageWidth,
        percentageY: rectangle.percentageY + rectangle.percentageHeight,
      };
  }
}

export function getOppositeCorner(corner: Corner): Corner {
  switch (corner) {
    case "top-left":
      return "bottom-right";
    case "top-right":
      return "bottom-left";
    case "bottom-left":
      return "top-right";
    case "bottom-right":
      return "top-left";
  }
}

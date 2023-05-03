import z from 'zod';

export const ZRelativePoint = z.object({
    relativeX: z.number(),
    relativeY: z.number(),
});
export type RelativePoint = z.infer<typeof ZRelativePoint>;

export const ZPercentagePoint = z.object({
    percentageX: z.number(),
    percentageY: z.number(),
});
export type PercentagePoint = z.infer<typeof ZPercentagePoint>;

export const ZViewportPoint = z.object({
    viewportX: z.number(),
    viewportY: z.number(),
});
export type ViewportPoint = z.infer<typeof ZViewportPoint>;

export const ZSize = z.object({
    width: z.number(),
    height: z.number(),
});
export type Size = z.infer<typeof ZSize>;

export const ZPercentageSize = z.object({
    percentageWidth: z.number(),
    percentageHeight: z.number(),
});
export type PercentageSize = z.infer<typeof ZPercentageSize>;

export const ZRelativeRectangle = ZRelativePoint.merge(ZSize);
export type RelativeRectangle = z.infer<typeof ZRelativeRectangle>;

export const ZPercentageRectangle = ZPercentagePoint.merge(ZPercentageSize);
export type PercentageRectangle = z.infer<typeof ZPercentageRectangle>;

export const ZViewportRectangle = ZViewportPoint.merge(ZSize);
export type ViewportRectangle = z.infer<typeof ZViewportRectangle>;

export const ZPaintingState = z.object({
    start: ZRelativePoint,
    rectangle: ZPercentageRectangle,
});
export type PaintingState = z.infer<typeof ZPaintingState>;

export function toPercentage(full: number, part: number): number {
    return 100 / full * part;
}

export function fromPercentage(full: number, part: number): number {
    return full / 100 * part;
}

export function toPercentRectangle(full: Size, rectangle: RelativeRectangle): PercentageRectangle {
    return {
        percentageWidth: toPercentage(full.width, rectangle.width),
        percentageHeight: toPercentage(full.height, rectangle.height),
        percentageX: toPercentage(full.width, rectangle.relativeX),
        percentageY: toPercentage(full.height, rectangle.relativeY),
    };
}

export function toRelativeRectangle(full: Size, rectangle: PercentageRectangle): RelativeRectangle {
    return {
        width: fromPercentage(full.width, rectangle.percentageWidth),
        height: fromPercentage(full.height, rectangle.percentageHeight),
        relativeX: fromPercentage(full.width, rectangle.percentageX),
        relativeY: fromPercentage(full.height, rectangle.percentageY),
    };
}

export function toRelativePoint(base: ViewportPoint, point: ViewportPoint): RelativePoint {
    return {
        relativeX: point.viewportX - base.viewportX,
        relativeY: point.viewportY - base.viewportY,
    };
}

export function buildRelativeRectangle(point1: RelativePoint, point2: RelativePoint): RelativeRectangle {
    const width = Math.abs(point2.relativeX - point1.relativeX);
    const height = Math.abs(point2.relativeY - point1.relativeY);

    return {
        width: width,
        height: height,
        relativeX: point2.relativeX < point1.relativeX ? point1.relativeX - width : point1.relativeX,
        relativeY: point2.relativeY < point1.relativeY ? point1.relativeY - height : point1.relativeY,
    };
}

export function initialPaintingState(start: RelativePoint): PaintingState {
    return {
        start,
        rectangle: {
            percentageWidth: 0,
            percentageHeight: 0,
            percentageX: 0,
            percentageY: 0,
        }
    }
}

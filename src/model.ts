export type RelativePoint = {
    relativeX: number;
    relativeY: number;
}
export type PercentagePoint = {
    percentageX: number;
    percentageY: number;
}
export type ViewportPoint = {
    viewportX: number;
    viewportY: number;
}

export type Size = { width: number, height: number };
export type PercentageSize = { percentageWidth: number, percentageHeight: number };

export type RelativeRectangle = RelativePoint & Size;
export type PercentageRectangle = PercentagePoint & PercentageSize;
export type ViewportRectangle = ViewportPoint & Size;

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

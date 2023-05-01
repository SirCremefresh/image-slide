export type Point = {
    x: number;
    y: number;
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

export type Rectangle = Point & Size;
export type ViewportRectangle = ViewportPoint & Size;
export type PercentageRectangle = PercentagePoint & PercentageSize;

export function toPercentage(full: number, part: number): number {
    return 100 / full * part;
}

export function fromPercentage(full: number, part: number): number {
    return full / 100 * part;
}

export function toPercentRectangle(full: Size, rectangle: Rectangle): PercentageRectangle {
    return {
        percentageWidth: toPercentage(full.width, rectangle.width),
        percentageHeight: toPercentage(full.height, rectangle.height),
        percentageX: toPercentage(full.width, rectangle.x),
        percentageY: toPercentage(full.height, rectangle.y),
    };
}

export function toRectangle(full: Size, rectangle: PercentageRectangle): Rectangle {
    return {
        width: fromPercentage(full.width, rectangle.percentageWidth),
        height: fromPercentage(full.height, rectangle.percentageHeight),
        x: fromPercentage(full.width, rectangle.percentageX),
        y: fromPercentage(full.height, rectangle.percentageY),
    };
}

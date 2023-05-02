import {ZPercentageRectangle} from "./graphic.ts";
import z from 'zod';

export const ZLink = z.object({
    targetId: z.string(),
    rectangle: ZPercentageRectangle,
});
export type Link = z.infer<typeof ZLink>;

export const ZImage = z.object({
    id: z.string(),
    title: z.string(),
    src: z.string(),
    links: z.array(ZLink),
});
export type Image = z.infer<typeof ZImage>;

export const ZCollection = z.object({
    id: z.string(),
    title: z.string(),
    images: z.array(ZImage),
});
export type Collection = z.infer<typeof ZCollection>;


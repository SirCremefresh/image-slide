import z from "zod";
import { ZPercentageRectangle } from "@common/models/rectangles.ts";

export const ZLink = z.object({
  imageId: z.string(),
  rectangle: ZPercentageRectangle,
});
export type Link = z.infer<typeof ZLink>;

export const ZImage = z.object({
  imageId: z.string(),
  title: z.string(),
  links: z.array(ZLink),
});
export type Image = z.infer<typeof ZImage>;

export const ZCollection = z.object({
  collectionId: z.string(),
  title: z.string(),
  initialImageId: z.string(),
  images: z.array(ZImage),
});
export type Collection = z.infer<typeof ZCollection>;

export const ZCollectionMetadata = z.object({
  hashedSecret: z.string(),
});
export type CollectionMetadata = z.infer<typeof ZCollectionMetadata>;

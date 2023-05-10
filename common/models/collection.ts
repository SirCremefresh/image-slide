import z from "zod";
import {
  PercentageRectangle,
  ZPercentageRectangle,
} from "@common/models/rectangles.ts";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";

export const ZLink = z.object({
  imageId: z.string(),
  rectangle: ZPercentageRectangle,
});
export type Link = {
  imageId: string;
  rectangle: PercentageRectangle;
};
assertType<TypeEqualityGuard<Link, z.infer<typeof ZLink>>>();

export const ZImage = z.object({
  imageId: z.string(),
  title: z.string(),
  links: z.array(ZLink),
});
export type Image = {
  imageId: string;
  title: string;
  links: Link[];
};
assertType<TypeEqualityGuard<Image, z.infer<typeof ZImage>>>();

export const ZCollection = z.object({
  collectionId: z.string(),
  title: z.string(),
  initialImageId: z.string(),
  images: z.array(ZImage),
});
export type Collection = {
  collectionId: string;
  title: string;
  initialImageId: string;
  images: Image[];
};
assertType<TypeEqualityGuard<Collection, z.infer<typeof ZCollection>>>();

export const ZCollectionMetadata = z.object({
  hashedSecret: z.string(),
});
export type CollectionMetadata = {
  hashedSecret: string;
};
assertType<
  TypeEqualityGuard<CollectionMetadata, z.infer<typeof ZCollectionMetadata>>
>();

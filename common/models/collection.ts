import z from "zod";
import {
  PercentageRectangle,
  ZPercentageRectangle,
} from "@common/models/rectangles.ts";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";
import { ZuUID } from "@common/models/uuid.ts";

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
  imageId: ZuUID,
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
  collectionId: ZuUID,
  title: z.string().min(1).max(50),
  backgroundColor: z.string().refine((s) => /^#[0-9a-fA-F]{6}$/i.test(s)),
  images: z
    .array(ZImage)
    .refine((images) => {
      const imageIds = new Set(images.map((image) => image.imageId));
      return imageIds.size === images.length;
    })
    .refine((images) => {
      const imageIds = new Set(images.map((image) => image.imageId));
      const linkIds = new Set(
        images.flatMap((image) => image.links.map((link) => link.imageId))
      );
      return Array.from(linkIds).every((linkId) => imageIds.has(linkId));
    }),
});
export type Collection = {
  collectionId: string;
  title: string;
  backgroundColor: string;
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

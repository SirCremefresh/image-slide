import z from "zod";
import {
  PercentageRectangle,
  ZPercentageRectangle,
} from "@common/models/rectangles.ts";
import { assertType, TypeEqualityGuard } from "@common/util/type-check.ts";
import { ZuUID } from "@common/models/uuid.ts";
import {
  EXISTING_LINK_REFERENCES_REFINEMENT,
  UNIQUE_IMAGE_ID_REFINEMENT,
} from "@common/models/collection-refinements.ts";

export const ZLink = z.object({
  linkId: ZuUID,
  targetImageId: z.string(),
  rectangle: ZPercentageRectangle,
});
export type Link = {
  linkId: string;
  targetImageId: string;
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
    .refine(...UNIQUE_IMAGE_ID_REFINEMENT)
    .refine(...EXISTING_LINK_REFERENCES_REFINEMENT),
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

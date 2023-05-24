import z from "zod";
import {
  addPercentagePoints,
  buildPercentageRectangle,
  getPercentagePointOfCorner,
  PercentageRectangle,
  PercentageRectangleCorners,
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

const findImageIndex = (images: Image[], imageId: string): number =>
  images.findIndex((existingImage) => existingImage.imageId === imageId);

const updateArray = <T>(arr: T[], index: number, newItem: T): T[] => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index + 1),
];

const upsertArray = <T>(
  arr: T[],
  newItem: T,
  findIndex: (item: T) => boolean
): T[] => {
  const index = arr.findIndex(findIndex);
  return index === -1 ? [...arr, newItem] : updateArray(arr, index, newItem);
};

const deleteArrayItem = <T>(arr: T[], index: number): T[] => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

export function collectionUpsertImage(
  collection: Collection,
  image: Image
): Collection {
  const images = upsertArray(
    collection.images,
    image,
    (existingImage) => existingImage.imageId === image.imageId
  );
  return { ...collection, images };
}

export function collectionUpsertLink(
  collection: Collection,
  image: Image,
  link: Link
): Collection {
  const imageIndex = findImageIndex(collection.images, image.imageId);
  if (imageIndex === -1) {
    return collection;
  }
  const existingImage = collection.images[imageIndex];
  const links = upsertArray(
    existingImage.links,
    link,
    (existingLink) => existingLink.linkId === link.linkId
  );
  const images = updateArray(collection.images, imageIndex, {
    ...existingImage,
    links,
  });
  return { ...collection, images };
}

export function collectionDeleteLink(
  collection: Collection,
  image: Image,
  link: Link
): Collection {
  const imageIndex = findImageIndex(collection.images, image.imageId);
  if (imageIndex === -1) {
    return collection;
  }
  const existingImage = collection.images[imageIndex];
  const linkIndex = existingImage.links.findIndex(
    (existingLink) => existingLink.linkId === link.linkId
  );
  if (linkIndex === -1) {
    return collection;
  }
  const links = deleteArrayItem(existingImage.links, linkIndex);
  const images = updateArray(collection.images, imageIndex, {
    ...existingImage,
    links,
  });
  return { ...collection, images };
}

export function collectionUpsertTitle(
  collection: Collection,
  title: string
): Collection {
  return { ...collection, title };
}

export function collectionDeleteImageAndRemoveDependents(
  collection: Collection,
  imageToDelete: Image
): Collection {
  const imageIndex = findImageIndex(collection.images, imageToDelete.imageId);
  if (imageIndex === -1) {
    return collection;
  }
  const images = deleteArrayItem(collection.images, imageIndex);
  const imagesWithoutLinks = images.map((image) => ({
    ...image,
    links: image.links.filter(
      (link) => link.targetImageId !== imageToDelete.imageId
    ),
  }));
  return { ...collection, images: imagesWithoutLinks };
}

export function fitPercentageRectangleCorners(
  corners: PercentageRectangleCorners
): PercentageRectangleCorners {
  const rectangle = buildPercentageRectangle(corners);
  const topLeft = getPercentagePointOfCorner(rectangle, "top-left");
  const bottomRight = getPercentagePointOfCorner(rectangle, "bottom-right");

  let offsetX = 0;
  let offsetY = 0;

  if (topLeft.percentageX < 0) offsetX = -topLeft.percentageX;
  if (topLeft.percentageY < 0) offsetY = -topLeft.percentageY;

  if (bottomRight.percentageX > 100) offsetX = 100 - bottomRight.percentageX;
  if (bottomRight.percentageY > 100) offsetY = 100 - bottomRight.percentageY;

  const offset = { percentageX: offsetX, percentageY: offsetY };
  return {
    point1: addPercentagePoints(topLeft, offset),
    point2: addPercentagePoints(bottomRight, offset),
  };
}

import { Image } from "@common/models/collection.ts";

type Refinement<T> = [(value: T) => boolean, string];

export const UNIQUE_IMAGE_ID_REFINEMENT: Refinement<Image[]> = [
  (images: Image[]): boolean => {
    const imageIds = new Set(images.map((image) => image.imageId));
    return imageIds.size === images.length;
  },
  "Image IDs must be unique",
];

export const EXISTING_LINK_REFERENCES_REFINEMENT: Refinement<Image[]> = [
  (images: Image[]) => {
    const imageIds = new Set(images.map((image) => image.imageId));
    const linkIds = new Set(
      images.flatMap((image) => image.links.map((link) => link.targetImageId))
    );
    return Array.from(linkIds).every((linkId) => imageIds.has(linkId));
  },
  "Link references must be to existing images",
];

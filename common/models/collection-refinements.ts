import { Image } from "@common/models/collection.ts";

export const UNIQUE_IMAGE_ID_REFINEMENT = [
  (images: Image[]): boolean => {
    const imageIds = new Set(images.map((image) => image.imageId));
    return imageIds.size === images.length;
  },
  {
    message: "Image IDs must be unique",
  },
] as const;

export const EXISTING_LINK_REFERENCES_REFINEMENT = [
  (images: Image[]) => {
    const imageIds = new Set(images.map((image) => image.imageId));
    const linkIds = new Set(
      images.flatMap((image) => image.links.map((link) => link.imageId))
    );
    return Array.from(linkIds).every((linkId) => imageIds.has(linkId));
  },
  {
    message: "Image IDs must be unique",
  },
] as const;

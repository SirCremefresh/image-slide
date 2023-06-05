import { describe, expect, it } from "vitest";
import {
  Link,
  collectionDeleteImageAndRemoveDependents,
  collectionDeleteLink,
  collectionUpsertImage,
  collectionUpsertLink,
  collectionUpsertTitle,
} from "./collection.ts";

// Mock data
const mockCollection = {
  collectionId: "1",
  title: "Collection 1",
  backgroundColor: "#FFFFFF",
  images: [],
};

const mockImage = {
  imageId: "1",
  title: "Image 1",
  size: { width: 200, height: 200 },
  links: [],
};

const mockLink: Link = {
  linkId: "1",
  targetImageId: "2",
  rectangle: {
    percentageX: 0.1,
    percentageY: 0.1,
    percentageWidth: 0.5,
    percentageHeight: 0.5,
  },
};

describe("Collection Management functions", () => {
  it("should upsert image correctly", () => {
    const updatedCollection = collectionUpsertImage(mockCollection, mockImage);
    expect(updatedCollection.images).toContain(mockImage);
  });

  it("should upsert link correctly", () => {
    const updatedCollectionWithImage = collectionUpsertImage(
      mockCollection,
      mockImage
    );
    const updatedCollection = collectionUpsertLink(
      updatedCollectionWithImage,
      mockImage,
      mockLink
    );
    expect(updatedCollection.images[0].links).toContain(mockLink);
  });

  it("should delete link correctly", () => {
    const updatedCollectionWithImage = collectionUpsertImage(
      mockCollection,
      mockImage
    );
    const updatedCollectionWithLink = collectionUpsertLink(
      updatedCollectionWithImage,
      mockImage,
      mockLink
    );
    const updatedCollection = collectionDeleteLink(
      updatedCollectionWithLink,
      mockImage,
      mockLink
    );
    expect(updatedCollection.images[0].links).not.toContain(mockLink);
  });

  it("should upsert title correctly", () => {
    const newTitle = "New Title";
    const updatedCollection = collectionUpsertTitle(mockCollection, newTitle);
    expect(updatedCollection.title).eq(newTitle);
  });

  it("should delete image and remove dependents correctly", () => {
    const updatedCollectionWithImage = collectionUpsertImage(
      mockCollection,
      mockImage
    );
    const updatedCollection = collectionDeleteImageAndRemoveDependents(
      updatedCollectionWithImage,
      mockImage
    );
    expect(updatedCollection.images).not.toContain(mockImage);
  });
});

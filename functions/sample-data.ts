import { Collection, Image } from "@common/models/collection.js";

const sampleImages: Image[] = [
  {
    imageId: "6b324990-7b9f-4bc3-80bd-ebc9278ef0de",
    title: "Obwaldner Taal",
    links: [
      {
        imageId: "80e7eaea-30bf-41e2-ac2a-a60dd92a11d6",
        rectangle: {
          percentageHeight: 9.4370717321537,
          percentageWidth: 10.352098437364607,
          percentageX: 36.60206233211057,
          percentageY: 39.13609159510799,
        },
      },
    ],
  },
  {
    imageId: "80e7eaea-30bf-41e2-ac2a-a60dd92a11d6",
    title: "Giswilerstock",
    links: [
      {
        imageId: "6b324990-7b9f-4bc3-80bd-ebc9278ef0de",
        rectangle: {
          percentageWidth: 8.061002178649238,
          percentageHeight: 11.154684095860567,
          percentageX: 55.773420479302835,
          percentageY: 18.823529411764707,
        },
      },
    ],
  },
];

export const localImageIds = new Set(
  sampleImages.map((image) => image.imageId)
);

export function getSampleCollection(id: string): Collection {
  return {
    collectionId: id,
    backgroundColor: "#E0E0E0",
    title: "Sample Collection",
    images: sampleImages,
  };
}

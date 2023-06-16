import { CollectionCredentials } from "../common/models/collection";

export const e2eApi = {
  async createCollection(): Promise<CollectionCredentials> {
    const response = await fetch("http://localhost:8788/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  },
};

export const e2eUrl = {
  getEditUrl(collection: CollectionCredentials): string {
    return `/edit/${collection.collectionId}/${collection.secret}`;
  },
};

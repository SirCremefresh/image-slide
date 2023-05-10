import { useQuery } from "@tanstack/react-query";
import { Collection } from "@common/models/collection.ts";

export const fetcher = (args: RequestInfo) =>
  fetch(args).then((res) => res.json());

export function useCollection(collectionId: string) {
  return useQuery<Collection>({
    queryKey: ["todos", collectionId],
    queryFn: async () => {
      const response = await fetch(`/api/collections/${collectionId}`);
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return response.json();
    },
  });
}

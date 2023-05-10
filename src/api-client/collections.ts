import useSWR from "swr";
import { Collection } from "@common/models/collection.ts";

export const fetcher = (args: RequestInfo) =>
  fetch(args).then((res) => res.json());

export function useCollection(collectionId: string) {
  return useSWR<Collection>(`/api/collections/${collectionId}`, fetcher);
}

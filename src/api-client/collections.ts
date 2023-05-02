import useSWR from "swr";
import {Images} from "../models/image.ts";

export const fetcher = (args: RequestInfo) => fetch(args).then(res => res.json())

export function useCollection(collectionId: string) {
    return useSWR<Images>(`/api/collections/${collectionId}`, fetcher)
}

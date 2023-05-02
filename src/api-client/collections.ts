import useSWR from "swr";
import {Images} from "../models/image.ts";

export const fetcher = (args: RequestInfo) => fetch(args).then(res => res.json())

export function useCollection(collectionId: string) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWR<Images>(`/api/collections/${collectionId}`, fetcher)
}

import z from "zod";
import {Env} from "../../../env.js";
import {ZCollection} from "../../../../src/models/image.js";
import {hashString} from "../../../hash.js";
import {parseOrThrow} from "../../../type-check.js";

const ZuUID = z.string().length(36);
export const ZCollectionMetadata = z.object({
    hashedSecret: z.string(),
});

// noinspection JSUnusedGlobalSymbols
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);

    const collection = await context.env.MAIN.get('COLLECTIONS:' + collectionId, 'text')
    if (collection === null) {
        return new Response('Not found', {status: 404});
    }
    return new Response(collection);
}

export async function getMetadataOrThrow<Z extends z.ZodType<any, any, any>>(kv: KVNamespace, key: string, z: Z): Promise<z.infer<Z>> {
    const object = await kv.getWithMetadata(key);
    return parseOrThrow(z, object.metadata, 'server');
}

// noinspection JSUnusedGlobalSymbols
export const onRequestPut: PagesFunction<Env> = async (context) => {
    const collection = parseOrThrow(ZCollection, await context.request.json());
    const secret = parseOrThrow(ZuUID, context.request.headers.get('Authorization'));
    const secretHash = await hashString(secret);

    const metadata = await getMetadataOrThrow(context.env.MAIN, 'COLLECTIONS:' + collection.collectionId, ZCollectionMetadata);

    if (metadata.hashedSecret !== secretHash) {
        return new Response('Unauthorized', {status: 401});
    }

    await context.env.MAIN.put(
        'COLLECTIONS:' + collection.collectionId,
        JSON.stringify(collection),
        {
            metadata: metadata
        })

    return new Response(JSON.stringify(collection));
}

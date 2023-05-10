import {Env} from "@function/util/env.js";
import {ZuUID} from "@function/util.js";
import {parseOrThrow} from "@function/type-check.js";
import {hashString} from "@function/util/hash.js";
import {getMetadataOrThrow, ZCollectionMetadata} from "../index.js";

// noinspection JSUnusedGlobalSymbols
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const secret = parseOrThrow(ZuUID, context.request.headers.get('Authorization'));
    const secretHash = await hashString(secret);

    const metadata = await getMetadataOrThrow(context.env.MAIN, 'COLLECTIONS:' + collectionId, ZCollectionMetadata);

    if (metadata.hashedSecret !== secretHash) {
        return new Response('Unauthorized', {status: 401});
    }

    const formData: FormData = await context.request.formData();
    const file = formData.get('file') as File;

    const imageId = crypto.randomUUID();

    await context.env.IMAGES.put(collectionId + '_' + imageId, file.stream())

    return new Response(JSON.stringify({imageId}), {
        headers: {
            'Content-Type': 'application/json',
            'Location': '/api/collections/' + collectionId + '/images/' + imageId,
        }
    });
}

import {Env} from "@function/util/env.js";
import {parseOrThrow} from "@function/type-check.js";
import {ZuUID} from "@function/util.js";
import {localImageIds} from "@function/sample-data.js";

// noinspection JSUnusedGlobalSymbols
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const imageId = parseOrThrow(ZuUID, context.params.imageId);

    if (localImageIds.has(imageId)) {
        return await context.env.ASSETS.fetch('http://some-host/' + imageId + '.jpg');
    }
    const image = await context.env.IMAGES.get(collectionId + '_' + imageId);
    if (image === null) {
        return new Response('Not found', {status: 404});
    }
    return new Response(image.body, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
        }
    });
}

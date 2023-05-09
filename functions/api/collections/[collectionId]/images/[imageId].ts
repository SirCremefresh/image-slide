import {Env} from "../../../../env.js";
import {parseOrThrow} from "../../../../type-check.js";
import {ZuUID} from "../../../../util.js";
import {localImageIds} from "../../../../local-images.js";

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
    return new Response(image.body);
}

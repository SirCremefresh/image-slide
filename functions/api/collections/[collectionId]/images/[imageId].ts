import {Env} from "../../../../env.js";
import {parseOrThrow} from "../../../../type-check.js";
import {ZDoubleUUID, ZuUID} from "../../../../util.js";
import {localImageIds} from "../../../../local-images.js";

// noinspection JSUnusedGlobalSymbols
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const imageId = parseOrThrow(ZDoubleUUID.startsWith(collectionId), context.params.imageId);
    const reducedImageId = imageId.slice(collectionId.length);

    if (localImageIds.has(reducedImageId)) {
        return await context.env.ASSETS.fetch('http://some-host/' + reducedImageId + '.jpg');
    }
    const image = await context.env.IMAGES.get(imageId);
    if (image === null) {
        return new Response('Not found', {status: 404});
    }
    return new Response(image.body);
}

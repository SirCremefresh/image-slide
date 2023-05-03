import {Env} from "../../../../env.js";
import {parseOrThrow} from "../../../../type-check.js";
import {ZDoubleUUID, ZuUID} from "../../../../util.js";
import {localImageIds} from "../../../../local-images.js";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const imageId = parseOrThrow(ZDoubleUUID.startsWith(collectionId), context.params.imageId);
    const reducedImageId = imageId.slice(collectionId.length);

    if (localImageIds.has(reducedImageId)) {
        return await context.env.ASSETS.fetch('http://some-host/' + reducedImageId + '.jpg');
    }
    throw new Error('Not implemented');
}

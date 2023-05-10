import {Env} from "@function/util/env.js";
import {parseOrThrow} from "@function/type-check.js";
import {ZuUID} from "@function/util.js";
import {localImageIds} from "@function/sample-data.js";

async function getImage(collectionId: string, imageId: string, env: Env & {
    ASSETS: {
        fetch: typeof fetch;
    };
}): Promise<ReadableStream> {
    if (localImageIds.has(imageId)) {
        const response = await env.ASSETS.fetch('http://some-host/' + imageId + '.jpg');
        if (response.body == null) {
            throw new NotFoundException();
        }
        return response.body
    } else {
        const image = await env.IMAGES.get(collectionId + '_' + imageId);
        if (image === null) {
            throw new NotFoundException();
        }
        return image.body;
    }
}

// noinspection JSUnusedGlobalSymbols
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const imageId = parseOrThrow(ZuUID, context.params.imageId);

    const image = await getImage(collectionId, imageId, context.env);

    return new Response(image, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
        }
    });
}

class NotFoundException extends Error {
    constructor() {
        super('Not found');
    }
}

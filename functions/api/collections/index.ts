import {Collection} from "../../../src/models/image.js";
import {Env} from "../../env.js";
import {hashString} from "../../hash.js";
import {getLocalImages} from "../../local-images.js";


function getSampleCollection(id: string): Collection {
    const localImages = getLocalImages(id);
    return {
        collectionId: id,
        initialImageId: localImages[0].imageId,
        title: 'Sample Collection',
        images: localImages,
    }
}


// noinspection JSUnusedGlobalSymbols
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const collectionId = crypto.randomUUID();
    const collection = getSampleCollection(collectionId);
    const secret = crypto.randomUUID();

    const hashedSecret = await hashString(secret);

    await context.env.MAIN.put(
        'COLLECTIONS:' + collectionId,
        JSON.stringify(collection),
        {
            metadata: {
                hashedSecret: hashedSecret,
            }
        })
    return new Response(JSON.stringify({
        collectionId: collectionId,
        secret: secret,
    }), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
            'Location': '/api/collections/' + collectionId,
        }
    });
}


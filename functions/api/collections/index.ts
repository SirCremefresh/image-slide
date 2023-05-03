import {Collection} from "../../../src/models/image.js";
import {Env} from "../../env.js";
import {hashString} from "../../hash.js";

function getSampleCollection(id: string): Collection {
    return {
        collectionId: id,
        initialImageId: 'Basis',
        title: 'Sample Collection',
        images: [
            {
                imageId: 'Basis',
                title: 'Basis',
                src: '/Basis.jpg',
                links: [
                    {
                        imageId: 'Bedeutung',
                        rectangle: {
                            percentageWidth: 9.078014184397164,
                            percentageHeight: 7.0962319151599695,
                            percentageX: 21.134751773049647,
                            percentageY: 19.55577015934331
                        },
                    },
                ],
            },
            {
                imageId: 'Bedeutung',
                title: 'Bedeutung',
                src: '/Bedeutung.jpg',
                links: [],
            },
        ],
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


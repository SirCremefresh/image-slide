import {Collection} from "../../../src/models/image.js";
import {Env} from "../../env.js";

function getSampleCollection(id: string): Collection {
    return {
        id: id,
        title: 'Sample Collection',
        images: [
            {
                id: 'Basis',
                title: 'Basis',
                src: '/Basis.jpg',
                links: [
                    {
                        targetId: 'Bedeutung',
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
                id: 'Bedeutung',
                title: 'Bedeutung',
                src: '/Bedeutung.jpg',
                links: [],
            },
        ],
    }
}


export const onRequestPost: PagesFunction<Env> = async (context) => {
    const uuid = crypto.randomUUID();
    const collection = getSampleCollection(uuid);
    const collectionJson = JSON.stringify(collection);

    await context.env.MAIN.put('COLLECTIONS:' + uuid, collectionJson)
    return new Response(collectionJson, {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
            'Location': '/api/collections/' + uuid,
        }
    });
}


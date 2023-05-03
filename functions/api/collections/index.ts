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


async function hashMessage(secret: string): Promise<string> {
    const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(secret)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    return hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const collectionId = crypto.randomUUID();
    const collection = getSampleCollection(collectionId);
    const secret = crypto.randomUUID();

    const hashedSecret = await hashMessage(secret);

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


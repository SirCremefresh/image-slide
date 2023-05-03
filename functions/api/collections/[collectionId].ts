import z from "zod";
import {Env} from "../../env.js";

const ZCollectionId = z.string().min(1).max(100);

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const result = ZCollectionId.safeParse(context.params.collectionId);
    if (!result.success) {
        return new Response(JSON.stringify(result.error), {status: 400});
    }
    const collection = await context.env.MAIN.get('COLLECTIONS:' + result.data, 'text')
    if (collection === null) {
        return new Response('Not found', {status: 404});
    }
    return new Response(collection);
}


function sleep(timeMs: number) {
    return new Promise(resolve => setTimeout(resolve, timeMs));
}

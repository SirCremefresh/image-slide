import {Env} from "../../../../env.js";
import {ZuUID} from "../../../../util.js";
import {parseOrThrow} from "../../../../type-check.js";


// noinspection JSUnusedGlobalSymbols
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);

    console.log('collectionId', collectionId);
    const formData: FormData = await context.request.formData();
    console.log('file size', (formData.get('file') as File).size);
    console.log('title', formData.get('title'));

    return new Response(JSON.stringify({}));
}

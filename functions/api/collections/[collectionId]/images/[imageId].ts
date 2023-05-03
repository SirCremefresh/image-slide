import {Env} from "../../../../env.js";
import {parseOrThrow} from "../../../../type-check.js";
import {ZuUID} from "../../../../util.js";

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
    const imageId = parseOrThrow(ZuUID, context.params.imageId);

    console.log("before")
    return await context.env.ASSETS.fetch('http://some-host/Basis.jpg');
}

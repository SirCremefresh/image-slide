import {Env} from "../env.js";

export const onRequest: PagesFunction<Env> = async (context) => {
    return new Response(JSON.stringify({pong: 'pong'}));
}

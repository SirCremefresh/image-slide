import { Env } from "@function/util/env.js";

// noinspection JSUnusedGlobalSymbols
export const onRequest: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ pong: "pong" }));
};

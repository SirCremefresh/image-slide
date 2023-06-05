import { Env } from "@function/util/env.js";

// noinspection JSUnusedGlobalSymbols
// eslint-disable-next-line import/no-unused-modules
export const onRequest: PagesFunction<Env> = async () => {
  return new Response(JSON.stringify({ pong: "pong" }));
};

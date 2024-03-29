import { Env } from "./util/env.js";
import { ResponseError } from "./type-check.js";

// eslint-disable-next-line import/no-unused-modules
export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    return await context.next();
  } catch (err) {
    console.error(err);
    if (err instanceof ResponseError) {
      return err.toResponse();
    }
    return new Response(`${err}`, { status: 500 });
  }
};

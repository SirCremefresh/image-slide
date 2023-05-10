import { Env } from "@function/util/env.js";
import { hashString } from "@function/util/hash.js";
import { getSampleCollection } from "@function/sample-data.js";

// noinspection JSUnusedGlobalSymbols
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const collectionId = crypto.randomUUID();
  const collection = getSampleCollection(collectionId);
  const secret = crypto.randomUUID();

  const hashedSecret = await hashString(secret);

  await context.env.MAIN.put(
    "COLLECTIONS:" + collectionId,
    JSON.stringify(collection),
    {
      metadata: {
        hashedSecret: hashedSecret,
      },
    }
  );
  return new Response(
    JSON.stringify({
      collectionId: collectionId,
      secret: secret,
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        Location: "/api/collections/" + collectionId,
      },
    }
  );
};

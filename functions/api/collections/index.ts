import { Env } from "@function/util/env.js";
import { hashString } from "@function/util/hash.js";
import { getSampleCollection } from "@function/sample-data.js";
import { getUtcDateTimeString } from "@function/util/utc-date.js";

// noinspection JSUnusedGlobalSymbols
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const collectionId = crypto.randomUUID();
  const collection = getSampleCollection(collectionId);
  const secret = crypto.randomUUID();

  const hashedSecret = await hashString(secret);

  await Promise.all([
    context.env.MAIN.put(
      "COLLECTIONS:" + collectionId,
      JSON.stringify(collection),
      {
        metadata: {
          hashedSecret: hashedSecret,
        },
      }
    ),
    context.env.MAIN.put(
      "COLLECTIONS_HISTORY:" + collectionId + ":" + getUtcDateTimeString(),
      JSON.stringify(collection),
      {
        metadata: {
          hashedSecret: hashedSecret,
        },
        expirationTtl: 60 * 60 * 24 * 30,
      }
    ),
  ]);

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

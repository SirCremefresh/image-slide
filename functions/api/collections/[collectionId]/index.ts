import { Env } from "@function/util/env.js";
import {
  Collection,
  ZCollection,
  ZCollectionMetadata,
} from "@common/models/collection.js";
import { hashString } from "@function/util/hash.js";
import { parseOrThrow } from "@function/type-check.js";
import { ZuUID } from "@common/models/uuid.js";
import { getUtcDateTimeString } from "@function/util/utc-date.js";
import z from "zod";

// eslint-disable-next-line import/no-unused-modules
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const collectionId = parseOrThrow(ZuUID, context.params.collectionId);

  const collection = await context.env.MAIN.get(
    "COLLECTIONS:" + collectionId,
    "text",
  );
  if (collection === null) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(collection);
};

export async function getMetadataOrThrow<Z extends z.ZodType>(
  kv: KVNamespace,
  key: string,
  z: Z,
): Promise<z.infer<Z>> {
  const object = await kv.getWithMetadata(key, "stream");
  return parseOrThrow(z, object.metadata, "server");
}

// eslint-disable-next-line import/no-unused-modules
export const onRequestPut: PagesFunction<Env> = async (context) => {
  const collection: Collection = parseOrThrow(
    ZCollection,
    await context.request.json(),
  );
  const secret = parseOrThrow(
    ZuUID,
    context.request.headers.get("Authorization"),
  );
  const secretHash = await hashString(secret);

  const metadata = await getMetadataOrThrow(
    context.env.MAIN,
    "COLLECTIONS:" + collection.collectionId,
    ZCollectionMetadata,
  );

  if (metadata.hashedSecret !== secretHash) {
    return new Response("Unauthorized", { status: 401 });
  }

  await Promise.all([
    context.env.MAIN.put(
      "COLLECTIONS:" + collection.collectionId,
      JSON.stringify(collection),
      {
        metadata,
      },
    ),
    context.env.MAIN.put(
      "COLLECTIONS_HISTORY:" +
        collection.collectionId +
        ":" +
        getUtcDateTimeString(),
      JSON.stringify(collection),
      {
        metadata,
        expirationTtl: 60 * 60 * 24 * 30,
      },
    ),
  ]);

  return new Response(JSON.stringify(collection));
};

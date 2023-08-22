import { getMetadataOrThrow } from "../index.js";
import { Env } from "@function/util/env.js";
import { parseOrThrow } from "@function/type-check.js";
import { hashString } from "@function/util/hash.js";
import { ZuUID } from "@common/models/uuid.js";
import {
  CollectionMetadata,
  ZCollectionMetadata,
} from "@common/models/collection.js";

// eslint-disable-next-line import/no-unused-modules
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
  const secret = parseOrThrow(
    ZuUID,
    context.request.headers.get("Authorization"),
  );
  const secretHash = await hashString(secret);

  const metadata: CollectionMetadata = await getMetadataOrThrow(
    context.env.MAIN,
    "COLLECTIONS:" + collectionId,
    ZCollectionMetadata,
  );

  if (metadata.hashedSecret !== secretHash) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData: FormData = await context.request.formData();
  const file = formData.get("file") as File;

  const imageId = crypto.randomUUID();

  await context.env.IMAGES.put(collectionId + "_" + imageId, file.stream());

  return new Response(JSON.stringify({ imageId }), {
    headers: {
      "Content-Type": "application/json",
      Location: "/api/collections/" + collectionId + "/images/" + imageId,
    },
  });
};

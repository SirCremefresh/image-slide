import { Env } from "@function/util/env.js";
import { parseOrThrow } from "@function/type-check.js";
import { localImageIds } from "@function/sample-data.js";
import { ZuUID } from "@common/models/uuid.js";
import { isNullOrUndefined } from "@common/util/assert-util.js";

async function getImage(
  collectionId: string,
  imageId: string,
  env: Env
): Promise<ReadableStream> {
  let stream;
  if (localImageIds.has(imageId)) {
    const response = await env.ASSETS.fetch(
      "http://some-host/" + imageId + ".jpg"
    );
    stream = response.body;
  } else {
    const image = await env.IMAGES.get(collectionId + "_" + imageId);
    stream = image?.body;
  }
  if (isNullOrUndefined(stream)) {
    throw new NotFoundException();
  }
  return stream;
}

// eslint-disable-next-line import/no-unused-modules
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const collectionId = parseOrThrow(ZuUID, context.params.collectionId);
  const imageId = parseOrThrow(ZuUID, context.params.imageId);

  const image = await getImage(collectionId, imageId, context.env);

  return new Response(image, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};

class NotFoundException extends Error {
  constructor() {
    super("Not found");
  }
}

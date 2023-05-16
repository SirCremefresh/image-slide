import { Env } from "@function/util/env.js";
import { hashString } from "@function/util/hash.js";
import { getSampleCollection } from "@function/sample-data.js";

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

function getHistoryDateTime(): string {
  const dateString = new Date().toLocaleString("en-US", { timeZone: "UTC" });
  const date = new Date(dateString);
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getHours()),
  ].join("-");
}

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
      "COLLECTIONS_HISTORY:" + collectionId + ":" + getHistoryDateTime(),
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

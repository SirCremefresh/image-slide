import { useParams } from "react-router-dom";
import { useCollection } from "../../api-client/collections.ts";
import { assertNotNullOrUndefined } from "@common/util/assert-util.ts";
import { EditorLoaded } from "./EditorLoaded.tsx";

export function Editor() {
  const { collectionId, secret } = useParams<{
    collectionId: string;
    secret: string;
  }>();
  const { data } = useCollection(assertNotNullOrUndefined(collectionId));

  if (data === undefined) return <div>Loading...</div>;
  return (
    <EditorLoaded
      collection={data}
      secret={assertNotNullOrUndefined(secret)}
    ></EditorLoaded>
  );
}

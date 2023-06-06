import { Collection } from "@common/models/collection.ts";
import { classNames } from "../../../util/class-names.ts";

export function ImageDropArea(props: {
  targetIndex: number | undefined;
  setTargetIndex: (index: number | undefined) => void;
  index: number;
  onDrop: (targetIndex: number) => void;
  collection: Collection;
}) {
  return (
    <div
      onDragEnter={(e) => {
        props.setTargetIndex(props.index);
        e.preventDefault();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => props.setTargetIndex(undefined)}
      onDrop={(e) => {
        e.preventDefault();
        props.onDrop(props.index);
      }}
      className={classNames(
        "block rounded-lg border-blue-600 bg-blue-400 transition-[height]",
        props.targetIndex === props.index
          ? "animate-wiggle border-8"
          : "border-4"
      )}
    ></div>
  );
}

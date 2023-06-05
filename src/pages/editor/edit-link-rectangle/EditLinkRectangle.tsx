import { useEditLinkRectangleState } from "./edit-link-rectangle-state.ts";
import { MouseState } from "../use-mouse-state.ts";
import { PercentageBoxCornerButton } from "../../../components/BoxButton.tsx";
import { Link } from "@common/models/collection.ts";
import { useEffect } from "react";

export function EditLinkRectangle({
  mouseState,
  link,
  onUpdate,
  onDelete,
}: {
  mouseState: MouseState;
  link: Link;
  onUpdate: (link: Link) => void;
  onDelete: (link: Link) => void;
}) {
  const [state, dispatch] = useEditLinkRectangleState(link);

  useEffect(() => {
    dispatch({
      type: "update",
      mouseStatePosition: mouseState.point,
    });
  }, [dispatch, mouseState.point]);

  useEffect(() => {
    if (mouseState.active) return;

    if (["painting", "moving"].includes(state.step.name)) {
      dispatch({ type: "view" });
      onUpdate({
        ...link,
        rectangle: state.rectangle,
      });
    }
  }, [
    dispatch,
    link,
    mouseState.active,
    onUpdate,
    state.rectangle,
    state.step.name,
  ]);

  return (
    <PercentageBoxCornerButton
      rectangle={state.rectangle}
      onCornerMouseDown={(oppositeCorner) => {
        dispatch({
          type: "start-painting",
          fixedCorner: oppositeCorner,
        });
      }}
      onMouseDown={() => {
        dispatch({
          type: "start-moving",
          mouseStatePosition: mouseState.point,
        });
      }}
      onDeleteClick={() => onDelete(link)}
      clickable={state.step.name === "viewing"}
      showToolbar={state.step.name === "viewing"}
      showCorners={true}
    ></PercentageBoxCornerButton>
  );
}

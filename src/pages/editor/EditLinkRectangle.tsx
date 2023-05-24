import { MouseState } from "./use-mouse-state.ts";
import { Link } from "@common/models/collection.ts";
import { useEffect, useReducer } from "react";
import {
  buildPercentageRectangle,
  buildPercentageRectangleCorners,
  fitPercentageRectangleCorners,
  getPercentagePointOfCorner,
  moveRectanglePercentageRectangle,
  PercentageRectangleCorners,
  subtractPercentagePoints,
} from "@common/models/rectangles.ts";
import { PercentageBoxCornerButton } from "../../components/BoxButton.tsx";
import { PercentagePoint } from "@common/models/points.ts";

type Step =
  | {
      name: "viewing";
    }
  | {
      name: "moving";
      topLeftOffset: PercentagePoint;
    }
  | {
      name: "painting";
      fixedCorner: PercentagePoint;
    };

type CurrentRectangleReducerAction =
  | {
      type: "view";
    }
  | {
      type: "start-painting";
      fixedCorner: PercentagePoint;
    }
  | {
      type: "start-moving";
      mouseStatePosition: PercentagePoint;
    }
  | {
      type: "update";
      mouseStatePosition: PercentagePoint;
    };

type State = {
  step: Step;
  currentRectangle: PercentageRectangleCorners;
};

function getInitialState(link: Link): State {
  return {
    step: { name: "viewing" },
    currentRectangle: buildPercentageRectangleCorners(link.rectangle),
  };
}

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
  const reducer = (
    rectangle: State,
    action: CurrentRectangleReducerAction
  ): State => {
    switch (action.type) {
      case "view":
        return {
          step: { name: "viewing" },
          currentRectangle: rectangle.currentRectangle,
        };
      case "start-painting":
        return {
          step: {
            name: "painting",
            fixedCorner: action.fixedCorner,
          },
          currentRectangle: rectangle.currentRectangle,
        };
      case "start-moving":
        return {
          step: {
            name: "moving",
            topLeftOffset: subtractPercentagePoints(
              action.mouseStatePosition,
              getPercentagePointOfCorner(
                buildPercentageRectangle(rectangle.currentRectangle),
                "top-left"
              )
            ),
          },
          currentRectangle: rectangle.currentRectangle,
        };
      case "update":
        if (rectangle.step.name === "painting") {
          return {
            step: rectangle.step,
            currentRectangle: fitPercentageRectangleCorners({
              point1: action.mouseStatePosition,
              point2: rectangle.step.fixedCorner,
            }),
          };
        }
        if (rectangle.step.name === "moving") {
          return {
            step: rectangle.step,
            currentRectangle: fitPercentageRectangleCorners(
              moveRectanglePercentageRectangle(
                rectangle.currentRectangle,
                rectangle.step.topLeftOffset,
                action.mouseStatePosition
              )
            ),
          };
        }
        return rectangle;
      default:
        return rectangle;
    }
  };
  const [state, dispatch] = useReducer(reducer, getInitialState(link));

  useEffect(() => {
    dispatch({
      type: "update",
      mouseStatePosition: mouseState.point,
    });
  }, [mouseState.point]);

  useEffect(() => {
    if (mouseState.active) return;

    if (["painting", "moving"].includes(state.step.name)) {
      dispatch({ type: "view" });
      onUpdate({
        ...link,
        rectangle: buildPercentageRectangle(state.currentRectangle),
      });
    }
  }, [
    state.currentRectangle,
    link,
    mouseState.active,
    onUpdate,
    state.step.name,
  ]);

  return (
    <>
      <PercentageBoxCornerButton
        rectangle={state.currentRectangle}
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
    </>
  );
}

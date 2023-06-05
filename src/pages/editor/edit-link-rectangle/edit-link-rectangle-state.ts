import {
  buildPercentageRectangle,
  fitPercentageRectangle,
  getPercentagePointOfCorner,
  movePercentageRectangle,
  PercentageRectangle,
  subtractPercentagePoints,
} from "@common/models/rectangles.ts";
import { PercentagePoint } from "@common/models/points.ts";
import { Link } from "@common/models/collection.ts";
import { Dispatch, useReducer } from "react";

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
  rectangle: PercentageRectangle;
};

function calcTopLeftOffset(
  rectangle: PercentageRectangle,
  point: PercentagePoint
): PercentagePoint {
  return subtractPercentagePoints(
    point,
    getPercentagePointOfCorner(rectangle, "top-left")
  );
}

function reducer(
  rectangle: State,
  action: CurrentRectangleReducerAction
): State {
  switch (action.type) {
    case "view":
      return {
        step: { name: "viewing" },
        rectangle: rectangle.rectangle,
      };
    case "start-painting":
      return {
        step: {
          name: "painting",
          fixedCorner: action.fixedCorner,
        },
        rectangle: rectangle.rectangle,
      };
    case "start-moving":
      return {
        step: {
          name: "moving",
          topLeftOffset: calcTopLeftOffset(
            rectangle.rectangle,
            action.mouseStatePosition
          ),
        },
        rectangle: rectangle.rectangle,
      };
    case "update":
      if (rectangle.step.name === "painting") {
        return {
          step: rectangle.step,
          rectangle: fitPercentageRectangle(
            buildPercentageRectangle(
              action.mouseStatePosition,
              rectangle.step.fixedCorner
            )
          ),
        };
      }
      if (rectangle.step.name === "moving") {
        return {
          step: rectangle.step,
          rectangle: fitPercentageRectangle(
            movePercentageRectangle(
              rectangle.rectangle,
              rectangle.step.topLeftOffset,
              action.mouseStatePosition
            )
          ),
        };
      }
  }
  return rectangle;
}

function getInitialState(link: Link): State {
  return {
    step: { name: "viewing" },
    rectangle: link.rectangle,
  };
}

export function useEditLinkRectangleState(
  link: Link
): [State, Dispatch<CurrentRectangleReducerAction>] {
  return useReducer(reducer, getInitialState(link));
}

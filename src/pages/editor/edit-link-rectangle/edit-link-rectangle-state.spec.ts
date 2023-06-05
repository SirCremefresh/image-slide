import { act, renderHook } from "@testing-library/react";
import { useEditLinkRectangleState } from "./edit-link-rectangle-state.ts";

const mockLink = {
  linkId: "1",
  targetImageId: "2",
  rectangle: {
    percentageX: 0.1,
    percentageY: 0.1,
    percentageWidth: 0.5,
    percentageHeight: 0.5,
  },
};

describe("useEditLinkRectangleState Hook", () => {
  it("should initialize with correct state", () => {
    const { result } = renderHook(() => useEditLinkRectangleState(mockLink));
    expect(result.current[0]).toEqual({
      step: { name: "viewing" },
      rectangle: mockLink.rectangle,
    });
  });

  it("should correctly transition to 'viewing' state", () => {
    const { result } = renderHook(() => useEditLinkRectangleState(mockLink));
    act(() => {
      result.current[1]({ type: "view" });
    });
    expect(result.current[0]).toEqual({
      step: { name: "viewing" },
      rectangle: mockLink.rectangle,
    });
  });

  it("should correctly transition to 'start-painting' state", () => {
    const { result } = renderHook(() => useEditLinkRectangleState(mockLink));
    const fixedCorner = { percentageX: 0.5, percentageY: 0.5 };
    act(() => {
      result.current[1]({ type: "start-painting", fixedCorner });
    });
    expect(result.current[0].step).toEqual({ name: "painting", fixedCorner });
  });

  it("should correctly transition to 'start-moving' state", () => {
    const { result } = renderHook(() => useEditLinkRectangleState(mockLink));
    const mouseStatePosition = { percentageX: 0.5, percentageY: 0.5 };
    act(() => {
      result.current[1]({ type: "start-moving", mouseStatePosition });
    });
    expect(result.current[0].step.name).toEqual("moving");
  });

  it("should correctly update state", () => {
    const { result } = renderHook(() => useEditLinkRectangleState(mockLink));
    const mouseStatePosition = { percentageX: 0.6, percentageY: 0.6 };
    act(() => {
      result.current[1]({ type: "start-moving", mouseStatePosition });
      result.current[1]({ type: "update", mouseStatePosition });
    });
    expect(result.current[0].step.name).toEqual("moving");
  });
});

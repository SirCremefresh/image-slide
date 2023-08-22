import { expect, test } from "@playwright/experimental-ct-react";
import LinkEditModal from "./LinkEditModal.tsx";
import { NOOP } from "../util/noop.ts";

test.use({ viewport: { width: 500, height: 500 } });

test("should work", async ({ mount }) => {
  const component = await mount(
    <LinkEditModal images={[]} onCanceled={NOOP} onLinkCreated={NOOP} />,
  );
  await expect(component).toContainText("Assigned to");
});

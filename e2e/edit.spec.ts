import { test } from "@playwright/test";
import { e2eApi, e2eUrl } from "./e2e-util";

test("test create rectangle", async ({ page }) => {
  const collectionCredentials = await e2eApi.createCollection();
  await page.goto(e2eUrl.getEditUrl(collectionCredentials));

  const activeSlide = await page.getByTestId("active-slide").first();
  await activeSlide.dragTo(activeSlide, {
    sourcePosition: { x: 10, y: 10 },
    targetPosition: { x: 300, y: 300 },
  });

  await page.getByTestId("link-target").fill("Giswil");
  await page.getByTestId("link-target").press("Enter");
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForResponse((response) =>
    response.url().includes("/api/collections"),
  );
});

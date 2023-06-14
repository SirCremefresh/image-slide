import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Create Collection" }).click();

  await expect(page).toHaveURL(/\/edit*./);

  const activeSlide = await page.getByTestId("active-slide").first();
  await activeSlide.dragTo(activeSlide, {
    sourcePosition: { x: 10, y: 10 },
    targetPosition: { x: 300, y: 300 },
  });

  await page.getByTestId("link-target").fill("Giswil");
  await page.getByTestId("link-target").press("Enter");
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForResponse((response) =>
    response.url().includes("/api/collections")
  );

  const collectionId = page.url().split("/").at(-2);

  console.log(page.url());
  console.log(collectionId);

  await page.goto(`/view/${collectionId}`);
  await expect(page).toHaveURL(/\/view*.\/*./);
});

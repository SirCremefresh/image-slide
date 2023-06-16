import { expect, test } from "@playwright/test";
import { Collection } from "../common/models/collection";

test("test create collection", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Create Collection" }).click();

  await expect(page).toHaveURL(/\/edit*./);

  await page.waitForResponse((response) =>
    response.url().includes("/api/collections")
  );

  const collectionId = page.url().split("/").at(-2);

  await page.goto(`/view/${collectionId}`);

  const collectionResponse = await page.waitForResponse((response) =>
    response.url().includes(`/api/collections/${collectionId}`)
  );
  const responseJson = (await collectionResponse.json()) as Collection;

  expect(responseJson.collectionId).toEqual(collectionId);
  await expect(page).toHaveURL(/\/view\/*.\/*./);
});

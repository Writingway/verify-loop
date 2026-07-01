import { test, expect } from "@playwright/test";

test("add a task, see it, complete it, counter updates", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#pending-count")).toHaveText("0");

  await page.fill("#new-task", "acheter du lait");
  await page.click("#add");

  const item = page.locator("#list li", { hasText: "acheter du lait" });
  await expect(item).toBeVisible();
  await expect(page.locator("#pending-count")).toHaveText("1");

  await item.locator("input[type=checkbox]").check();
  await expect(page.locator("#pending-count")).toHaveText("0");
});

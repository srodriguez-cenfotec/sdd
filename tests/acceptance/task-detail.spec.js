import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("Prepare lesson");
  await page.getByLabel("Description").fill("Review the daily plan");
  await page.getByRole("button", { name: "Create task" }).click();
  await page.getByRole("button", { name: /Prepare lesson/ }).click();
});

test("shows task details and toggles completion in both directions", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "Prepare lesson" }),
  ).toBeVisible();
  await expect(page.getByText("Review the daily plan")).toBeVisible();
  await expect(page.getByText("Status:")).toContainText("Pending");

  await page.getByRole("button", { name: "Mark as done" }).click();
  await expect(page.getByText("Status:")).toContainText("Done");

  await page.getByRole("button", { name: "Mark as not done" }).click();
  await expect(page.getByText("Status:")).toContainText("Pending");
});

test("allows editing and cancelling without changing saved task values", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Unsaved title");
  await page.getByLabel("Description").fill("Unsaved description");
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(
    page.getByRole("heading", { name: "Prepare lesson" }),
  ).toBeVisible();
  await expect(page.getByText("Review the daily plan")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Updated lesson");
  await page.getByLabel("Description").fill("Updated plan");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(
    page.getByRole("heading", { name: "Updated lesson" }),
  ).toBeVisible();
  await expect(page.getByText("Updated plan")).toBeVisible();
});

test("rejects a blank title while editing", async ({ page }) => {
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("alert")).toContainText("A title is required");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("displays a muted no-description placeholder", async ({ page }) => {
  await page.getByRole("button", { name: "Back to list" }).click();
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("No description task");
  await page.getByRole("button", { name: "Create task" }).click();
  await page.getByRole("button", { name: /No description task/ }).click();

  const noDescription = page.getByText("No description", { exact: true });
  await expect(noDescription).toBeVisible();
  await expect(noDescription).toHaveClass(/is-empty/);
});

test("requires delete confirmation and removes only after acceptance", async ({
  page,
}) => {
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(
    page.getByRole("heading", { name: "Prepare lesson" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Back to list" }).click();
  await expect(page.getByRole("button", { name: /Prepare lesson/ })).toBeVisible();

  await page.getByRole("button", { name: /Prepare lesson/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("No tasks yet")).toBeVisible();
});

test("keeps the detail view readable and targets usable across viewport sizes", async ({
  page,
}) => {
  const longText = "Long task information ".repeat(30);
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill(longText);
  await page.getByLabel("Description").fill(longText);
  await page.getByRole("button", { name: "Save changes" }).click();

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true);

    for (const button of await page.getByRole("button").all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    const title = page.getByRole("heading", { name: longText });
    const box = await title.boundingBox();
    expect(box).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
});

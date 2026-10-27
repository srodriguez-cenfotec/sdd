import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function addTask(page, title, description = "") {
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill(title);
  if (description) {
    await page.getByLabel("Description").fill(description);
  }
  await page.getByRole("button", { name: "Create task" }).click();
}

test("shows the application name and adds a pending task", async ({ page }) => {
  await expect(page).toHaveTitle("Curso-PSWE-07");
  await expect(
    page.getByRole("heading", { name: "Curso-PSWE-07" }),
  ).toBeVisible();

  await addTask(page, "Buy groceries", "Milk and bread");

  const taskRow = page.getByRole("button", { name: /Buy groceries/ });
  await expect(taskRow).toBeVisible();
  await expect(taskRow).toContainText("Pending");
});

test("requires a non-whitespace title when creating a task", async ({ page }) => {
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Create task" }).click();

  await expect(page.getByRole("alert")).toContainText("A title is required");
  await expect(page.getByText("No tasks yet")).toBeVisible();
});

test("filters tasks and highlights the selected filter", async ({ page }) => {
  await addTask(page, "Write report");
  await addTask(page, "Book appointment");

  await page.getByRole("button", { name: /Write report/ }).click();
  await page.getByRole("button", { name: "Mark as done" }).click();
  await page.getByRole("button", { name: "Back to list" }).click();

  const doneFilter = page.getByRole("button", { name: "Done", exact: true });
  await doneFilter.click();
  await expect(doneFilter).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Write report/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Book appointment/ })).toHaveCount(0);

  const pendingFilter = page.getByRole("button", { name: "Pending", exact: true });
  await pendingFilter.click();
  await expect(pendingFilter).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Book appointment/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Write report/ })).toHaveCount(0);

  const allFilter = page.getByRole("button", { name: "All", exact: true });
  await allFilter.click();
  await expect(allFilter).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Write report/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Book appointment/ })).toBeVisible();
});

test("shows an empty message for a list with no tasks or filter matches", async ({
  page,
}) => {
  await expect(page.getByText("No tasks yet")).toBeVisible();

  await addTask(page, "Pending task");
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByText("No done tasks yet")).toBeVisible();
});

test("retains saved tasks after reloading the application", async ({ page }) => {
  await addTask(page, "Prepare slides", "Draft agenda");
  await page.reload();

  const taskRow = page.getByRole("button", { name: /Prepare slides/ });
  await expect(taskRow).toBeVisible();
  await expect(taskRow).toContainText("Pending");
});

test("reports a storage read failure instead of presenting an empty list", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("storage access denied");
      },
    });
  });
  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("Unable to read saved tasks");
  await expect(page.getByText("No tasks yet")).toHaveCount(0);
});

test("reports a storage write failure without claiming the task was saved", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function setItem() {
      throw new Error("storage writes disabled");
    };
  });
  await page.goto("/");
  await addTask(page, "Unsaved task");

  await expect(page.getByRole("alert")).toContainText("Unable to save tasks");
  await expect(page.getByRole("button", { name: /Unsaved task/ })).toHaveCount(0);
});

test("keeps list controls at least 44 pixels tall on mobile and desktop", async ({
  page,
}) => {
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

    const buttons = page.getByRole("button");
    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
});

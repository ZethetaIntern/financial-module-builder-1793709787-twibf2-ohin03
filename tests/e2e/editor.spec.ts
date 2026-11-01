import { test, expect } from "@playwright/test";

const blockLabels = [
  "Heading",
  "Rich Text",
  "Callout",
  "Divider",
  "Accordion",
  "Image",
  "Video",
  "Multiple Choice Quiz",
  "True / False Quiz",
  "Financial Calculator",
  "Interactive Example",
  "Progress Tracker",
  "Achievement Badge",
  "Concept Explainer",
];

test.describe("FinanceLab Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("should support browser UUID generation", async ({ page }) => {
    await page.goto("/editor");

    const uuid = await page.evaluate(() => {
      return typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "UNAVAILABLE";
    });

    expect(uuid).not.toBe("UNAVAILABLE");
  });

  test("should load the editor page", async ({ page }) => {
    await page.goto("/editor");

    await expect(page).toHaveURL(/\/editor/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display the editor content", async ({ page }) => {
    await page.goto("/editor");

    await expect(page.locator("body")).not.toBeEmpty();
    await expect(
      page.getByRole("heading", { name: "Module Canvas" })
    ).toBeVisible();
  });

  test("should display all 14 block buttons", async ({ page }) => {
    await page.goto("/editor");

    for (const label of blockLabels) {
      await expect(
        page.getByRole("button", { name: label, exact: true })
      ).toBeVisible();
    }
  });

  test("should add all 14 blocks to the canvas", async ({ page }) => {
    await page.goto("/editor");

    await expect(page.getByText("0 Blocks", { exact: true })).toBeVisible();

    for (let i = 0; i < blockLabels.length; i++) {
      await page.getByRole("button", {
        name: blockLabels[i],
        exact: true,
      }).click();

      const count = i + 1;
      const countText = count === 1 ? "1 Block" : `${count} Blocks`;

      await expect(
        page.getByText(countText, { exact: true })
      ).toBeVisible();
    }

    await expect(page.getByText(/Component coming soon/)).toHaveCount(0);
  });

  test("should select and delete blocks from the canvas", async ({ page }) => {
    await page.goto("/editor");

    await page.getByRole("button", {
      name: "Heading",
      exact: true,
    }).click();

    await expect(page.getByText("1 Block", { exact: true })).toBeVisible();

    await page.getByRole("button", {
      name: "Rich Text",
      exact: true,
    }).click();

    await expect(page.getByText("2 Blocks", { exact: true })).toBeVisible();

    const headingHeader = page
      .getByRole("button", { name: "1. Heading" })
      .locator("..");
    const richTextHeader = page
      .getByRole("button", { name: "2. Rich Text" })
      .locator("..");

    await headingHeader.getByRole("button", { name: "1. Heading" }).click();
    await expect(headingHeader.getByText("SELECTED")).toBeVisible();
    await expect(richTextHeader.getByText("SELECTED")).toHaveCount(0);

    await page.getByRole("button", {
      name: "Delete Heading",
    }).click();

    await expect(page.getByText("1 Block", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "1. Rich Text" })
    ).toBeVisible();

    await page.getByRole("button", {
      name: "Delete Rich Text",
    }).click();

    await expect(page.getByText("0 Blocks", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Your canvas is empty", { exact: true })
    ).toBeVisible();
  });
});

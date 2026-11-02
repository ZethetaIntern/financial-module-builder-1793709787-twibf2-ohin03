import { expect, test } from "@playwright/test";

const modules = [
  {
    id: 170001,
    title: "Module to remove",
    description: "This module will be deleted during the test.",
    category: "Personal Finance",
    blocks: 1,
    progress: 25,
    updated: "Today",
    color: "violet",
    icon: "book",
  },
  {
    id: 170002,
    title: "Module to preserve",
    description: "This module should remain saved.",
    category: "Investing",
    blocks: 2,
    progress: 50,
    updated: "Yesterday",
    color: "cyan",
    icon: "chart",
  },
];

test.describe("Dashboard module deletion", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((savedModules) => {
      if (localStorage.getItem("__financelab_test_seeded") === "true") {
        return;
      }

      localStorage.clear();
      localStorage.setItem("financelab-modules", JSON.stringify(savedModules));
      localStorage.setItem("__financelab_test_seeded", "true");
    }, modules);
  });

  test("canceling deletion leaves the module saved", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: "Delete module Module to remove" })
      .click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toContainText("Module to remove");
    await dialog.getByRole("button", { name: "Cancel" }).click();

    await expect(
      page.getByRole("heading", { name: "Module to remove" })
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(localStorage.getItem("financelab-modules") ?? "[]")
        )
      )
      .toHaveLength(2);
  });

  test("deletion persists, preserves other modules, and supports an empty-state create", async ({
    page,
  }) => {
    page.on("console", (message) => console.log("BROWSER:", message.text()));
    page.on("framenavigated", (frame) => console.log("NAV:", frame.url()));
    await page.goto("/");

    await page
      .getByRole("button", { name: "Delete module Module to remove" })
      .click();
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete Module" })
      .click();

    await expect
      .poll(() =>
        page.evaluate(() =>
          JSON.parse(localStorage.getItem("financelab-modules") ?? "[]")
        )
      )
      .toHaveLength(1);
    await expect(
      page.getByRole("heading", { name: "Module to remove" })
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Module to preserve" })
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Module to preserve" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Module to remove" })
    ).toHaveCount(0);

    await page
      .getByRole("button", { name: "Delete module Module to preserve" })
      .click();
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Delete Module" })
      .click();

    await expect(
      page.getByText("No modules yet. Create one to get started.")
    ).toBeVisible();
    await page.getByRole("button", { name: "Create Module" }).first().click();
    await page.getByLabel("Module title").fill("Fresh module");
    await page.locator("form").getByRole("button", { name: "Create Module" }).click();

    await expect(page).toHaveURL(/\/editor$/);
    await expect(page.getByLabel("Module Title")).toHaveValue("Fresh module");
  });
});

import { expect, test } from "@playwright/test";

const modules = [
  {
    id: 170101,
    title: "hdg",
    description: "First progress test module",
    category: "New Module",
    blocks: 3,
    progress: 0,
    updated: "Today",
    color: "violet",
    icon: "book",
  },
  {
    id: 170102,
    title: "Database",
    description: "Second progress test module",
    category: "New Module",
    blocks: 1,
    progress: 0,
    updated: "Today",
    color: "cyan",
    icon: "book",
  },
];

test.describe("Dashboard module progress synchronization", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((savedModules) => {
      localStorage.clear();

      localStorage.setItem(
        "financelab-modules",
        JSON.stringify(savedModules)
      );

      localStorage.setItem(
        "financelab-content-170101",
        JSON.stringify({
          metadata: {
            id: "170101",
            title: "hdg",
            description: "First progress test module",
            status: "draft",
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
          },
          blocks: [
            makeSeedBlock("heading-1", "heading"),
            makeSeedBlock("rich-text-1", "rich-text"),
            makeSeedBlock("tracker-1", "progress-tracker", {
              completed: 4,
              total: 5,
            }),
          ],
        })
      );

      localStorage.setItem(
        "financelab-content-170102",
        JSON.stringify({
          metadata: {
            id: "170102",
            title: "Database",
            description: "Second progress test module",
            status: "draft",
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
          },
          blocks: [
            makeSeedBlock("tracker-2", "progress-tracker", {
              completed: 3,
              total: 5,
            }),
          ],
        })
      );

      function makeSeedBlock(id: string, type: string, content: Record<string, unknown> = {}) {
        return {
          id,
          type,
          category: "learning",
          title: type,
          visible: true,
          content,
          createdAt: 1700000000000,
          updatedAt: 1700000000000,
        };
      }
    }, modules);
  });

  test("shows each module's own progress and block count", async ({ page }) => {
    await page.goto("/");

    const hdgCard = page.locator("article").filter({
      has: page.getByRole("heading", { name: "hdg", exact: true }),
    });

    const databaseCard = page.locator("article").filter({
      has: page.getByRole("heading", { name: "Database", exact: true }),
    });

    await expect(hdgCard).toContainText("3 blocks");
    await expect(hdgCard).toContainText("80%");

    await expect(databaseCard).toContainText("1 blocks");
    await expect(databaseCard).toContainText("60%");

    await expect(hdgCard).not.toContainText("COMPLETED");
    await expect(databaseCard).not.toContainText("COMPLETED");
  });
});

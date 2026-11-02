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
        page.getByRole("button", {
          name: label,
          exact: true,
        })
      ).toBeVisible();
    }
  });

  test("should add all 14 blocks to the canvas", async ({ page }) => {
    await page.goto("/editor");

    const blockCount = page.getByTestId("block-count");

    await expect(blockCount).toHaveText("0 Blocks");

    for (let i = 0; i < blockLabels.length; i++) {
      await page.getByRole("button", {
        name: blockLabels[i],
        exact: true,
      }).click();

      const count = i + 1;
      const countText =
        count === 1 ? "1 Block" : `${count} Blocks`;

      await expect(blockCount).toHaveText(countText);
    }

    await expect(
      page.getByText(/Component coming soon/)
    ).toHaveCount(0);
  });

  test("should select and delete blocks from the canvas", async ({
    page,
  }) => {
    await page.goto("/editor");

    const blockCount = page.getByTestId("block-count");

    // Add Heading
    await page.getByRole("button", {
      name: "Heading",
      exact: true,
    }).click();

    await expect(blockCount).toHaveText("1 Block");

    // Add Rich Text
    await page.getByRole("button", {
      name: "Rich Text",
      exact: true,
    }).click();

    await expect(blockCount).toHaveText("2 Blocks");

    // Locate both blocks
    const headingBlock = page.getByTestId(/sortable-block-/).filter({
      has: page.getByRole("button", {
        name: "1. Heading",
        exact: true,
      }),
    });

    const richTextBlock = page.getByTestId(/sortable-block-/).filter({
      has: page.getByRole("button", {
        name: "2. Rich Text",
        exact: true,
      }),
    });

    await expect(headingBlock).toHaveCount(1);
    await expect(richTextBlock).toHaveCount(1);

    // Select Heading
    await headingBlock
      .getByRole("button", {
        name: "1. Heading",
        exact: true,
      })
      .click();

    await expect(
      headingBlock.getByText("SELECTED")
    ).toBeVisible();

    await expect(
      richTextBlock.getByText("SELECTED")
    ).toHaveCount(0);

    // Delete Heading
    await page.getByRole("button", {
      name: "Delete Heading",
    }).click();

    await expect(blockCount).toHaveText("1 Block");

    await expect(
      page.getByRole("button", {
        name: "1. Rich Text",
      })
    ).toBeVisible();

    // Delete Rich Text
    await page.getByRole("button", {
      name: "Delete Rich Text",
    }).click();

    await expect(blockCount).toHaveText("0 Blocks");

    await expect(
      page.getByText("Your canvas is empty", {
        exact: true,
      })
    ).toBeVisible();
  });

  // Integration Test 1: Undo and Redo

  test("should support undo and redo operations", async ({ page }) => {
    await page.goto("/editor");

    const blockCount = page.getByTestId("block-count");

    await page.getByRole("button", {
      name: "Heading",
      exact: true,
    }).click();

    await expect(blockCount).toHaveText("1 Block");

    await page.getByRole("button", {
      name: "Undo",
    }).click();

    await expect(blockCount).toHaveText("0 Blocks");

    await page.getByRole("button", {
      name: "Redo",
    }).click();

    await expect(blockCount).toHaveText("1 Block");
  });

  // Integration Test 2: Learner Preview

  test("should switch between edit and learner preview modes", async ({
    page,
  }) => {
    await page.goto("/editor");

    await page.getByRole("button", {
      name: "Heading",
      exact: true,
    }).click();

    await page.getByRole("button", {
      name: "Preview",
      exact: true,
    }).click();

    await expect(
      page.getByRole("heading", {
        name: "Module Preview",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Heading",
        exact: true,
      })
    ).toHaveCount(0);

    await expect(
      page.getByTestId(/preview-block-/)
    ).toHaveCount(1);

    await page.getByRole("button", {
      name: "Edit",
      exact: true,
    }).click();

    await expect(
      page.getByRole("heading", {
        name: "Module Canvas",
      })
    ).toBeVisible();
  });

  // Integration Test 3: Responsive Preview Devices

  test("should switch between desktop, tablet and mobile preview widths", async ({
    page,
  }) => {
    await page.goto("/editor");

    await page.getByRole("button", {
      name: "Preview",
      exact: true,
    }).click();

    const previewContainer = page
      .getByTestId("module-preview")
      .locator("..");

    // Tablet
    await page.getByRole("button", {
      name: "Tablet preview",
    }).click();

    await expect(previewContainer).toHaveCSS(
      "max-width",
      "768px"
    );

    // Mobile
    await page.getByRole("button", {
      name: "Mobile preview",
    }).click();

    await expect(previewContainer).toHaveCSS(
      "max-width",
      "375px"
    );

    // Desktop
    await page.getByRole("button", {
      name: "Desktop preview",
    }).click();

    await expect(previewContainer).toHaveCSS(
      "max-width",
      "100%"
    );
  });

  // Integration Test 4: Module Metadata

  test("should update and display module metadata in preview", async ({
    page,
  }) => {
    await page.goto("/editor");

    const titleInput = page.getByLabel("Module Title");
    const descriptionInput = page.getByLabel(
      "Module Description"
    );

    await titleInput.fill("Financial Education Basics");

    await descriptionInput.fill(
      "Learn essential financial concepts interactively."
    );

    await page.getByRole("button", {
      name: "Preview",
      exact: true,
    }).click();

    await expect(
      page.getByRole("heading", {
        name: "Financial Education Basics",
      })
    ).toBeVisible();

    await expect(
      page.getByText(
        "Learn essential financial concepts interactively."
      )
    ).toBeVisible();
  });

  // Integration Test 5: JSON Export

  test("should export the current module as JSON", async ({
    page,
  }) => {
    await page.goto("/editor");

    await page.getByRole("button", {
      name: "Heading",
      exact: true,
    }).click();

    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("button", {
      name: "Export JSON",
    }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.json$/);

    const downloadPath = await download.path();

    expect(downloadPath).not.toBeNull();
  });
});
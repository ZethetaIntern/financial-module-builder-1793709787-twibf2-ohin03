import { describe, it, expect } from "vitest";
import {
  BLOCK_REGISTRY,
  getBlockDefinition,
  getBlocksByCategory,
} from "@/data/block-registry";

describe("Block Registry", () => {
  it("should contain exactly 14 block definitions", () => {
    expect(BLOCK_REGISTRY).toHaveLength(14);
  });

  it("should contain all 14 unique block types", () => {
    const types = BLOCK_REGISTRY.map((block) => block.type);

    expect(new Set(types).size).toBe(14);

    expect(types).toEqual(
      expect.arrayContaining([
        "heading",
        "rich-text",
        "callout",
        "divider",
        "accordion",
        "image",
        "video",
        "multiple-choice",
        "true-false",
        "financial-calculator",
        "interactive-example",
        "progress-tracker",
        "achievement-badge",
        "concept-explainer",
      ])
    );
  });

  it("should have the correct number of blocks in each category", () => {
    expect(getBlocksByCategory("text")).toHaveLength(5);
    expect(getBlocksByCategory("media")).toHaveLength(2);
    expect(getBlocksByCategory("quiz")).toHaveLength(2);
    expect(getBlocksByCategory("finance")).toHaveLength(2);
    expect(getBlocksByCategory("learning")).toHaveLength(3);
  });

  it("should return the correct definition for a block type", () => {
    const heading = getBlockDefinition("heading");

    expect(heading).toBeDefined();
    expect(heading?.label).toBe("Heading");
    expect(heading?.category).toBe("text");
  });

  it("should return undefined for an unknown block type", () => {
    expect(getBlockDefinition("unknown-block")).toBeUndefined();
  });

  it("should return an empty array for an unknown category", () => {
    expect(getBlocksByCategory("unknown-category")).toEqual([]);
  });

  it("should have valid metadata for every block", () => {
    BLOCK_REGISTRY.forEach((block) => {
      expect(block.label.trim()).not.toBe("");
      expect(block.description.trim()).not.toBe("");
      expect(block.icon.trim()).not.toBe("");
    });
  });
});

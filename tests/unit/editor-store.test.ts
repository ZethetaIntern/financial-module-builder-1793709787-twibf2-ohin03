import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "@/store/editor-store";

describe("Editor Store", () => {
  beforeEach(() => {
    useEditorStore.getState().resetModule();
  });

  it("should add a new block", () => {
    const store = useEditorStore.getState();

    store.addBlock("heading");

    const updated = useEditorStore.getState();

    expect(updated.module.blocks).toHaveLength(1);
    expect(updated.module.blocks[0].type).toBe("heading");
    expect(updated.selectedBlockId).toBe(
      updated.module.blocks[0].id
    );
  });

  it("should update an existing block", () => {
    const store = useEditorStore.getState();

    store.addBlock("heading");

    const blockId = useEditorStore.getState().module.blocks[0].id;

    useEditorStore.getState().updateBlock(blockId, {
      title: "Updated Heading",
    });

    expect(
      useEditorStore.getState().module.blocks[0].title
    ).toBe("Updated Heading");
  });

  it("should delete a block", () => {
    const store = useEditorStore.getState();

    store.addBlock("heading");

    const blockId = useEditorStore.getState().module.blocks[0].id;

    useEditorStore.getState().deleteBlock(blockId);

    expect(useEditorStore.getState().module.blocks).toHaveLength(0);
    expect(useEditorStore.getState().selectedBlockId).toBeNull();
  });

  it("should reorder blocks", () => {
    const store = useEditorStore.getState();

    store.addBlock("heading");
    store.addBlock("rich-text");

    const blocks = useEditorStore.getState().module.blocks;

    const firstId = blocks[0].id;
    const secondId = blocks[1].id;

    useEditorStore.getState().reorderBlocks(firstId, secondId);

    const reordered = useEditorStore.getState().module.blocks;

    expect(reordered[0].id).toBe(secondId);
    expect(reordered[1].id).toBe(firstId);
  });
});

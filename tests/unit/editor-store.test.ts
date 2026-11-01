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
  it("should undo the most recent block addition", () => {
    useEditorStore.getState().addBlock("heading");

    expect(useEditorStore.getState().module.blocks).toHaveLength(1);

    useEditorStore.getState().undo();

    expect(useEditorStore.getState().module.blocks).toHaveLength(0);
    expect(useEditorStore.getState().canUndo).toBe(false);
    expect(useEditorStore.getState().canRedo).toBe(true);
  });

  it("should redo an undone block addition", () => {
    useEditorStore.getState().addBlock("heading");
    useEditorStore.getState().undo();
    useEditorStore.getState().redo();

    expect(useEditorStore.getState().module.blocks).toHaveLength(1);
    expect(useEditorStore.getState().canUndo).toBe(true);
    expect(useEditorStore.getState().canRedo).toBe(false);
  });

  it("should support multiple consecutive undo and redo operations", () => {
    const store = useEditorStore.getState();

    store.addBlock("heading");
    useEditorStore.getState().addBlock("rich-text");
    useEditorStore.getState().addBlock("callout");

    useEditorStore.getState().undo();
    useEditorStore.getState().undo();

    expect(useEditorStore.getState().module.blocks).toHaveLength(1);

    useEditorStore.getState().redo();
    useEditorStore.getState().redo();

    expect(useEditorStore.getState().module.blocks).toHaveLength(3);
  });

  it("should clear redo history after a new action", () => {
    useEditorStore.getState().addBlock("heading");
    useEditorStore.getState().undo();

    expect(useEditorStore.getState().canRedo).toBe(true);

    useEditorStore.getState().addBlock("rich-text");

    expect(useEditorStore.getState().canRedo).toBe(false);
    expect(useEditorStore.getState().module.blocks).toHaveLength(1);
  });

  it("should keep a maximum of 50 undo history states", () => {
    for (let index = 0; index < 55; index += 1) {
      useEditorStore.getState().addBlock("heading");
    }

    expect(useEditorStore.getState().history.past).toHaveLength(50);
    expect(useEditorStore.getState().module.blocks).toHaveLength(55);
  });

  it("should not change the module when undo or redo history is empty", () => {
    const initialModule = useEditorStore.getState().module;

    useEditorStore.getState().undo();
    useEditorStore.getState().redo();

    expect(useEditorStore.getState().module).toBe(initialModule);
    expect(useEditorStore.getState().canUndo).toBe(false);
    expect(useEditorStore.getState().canRedo).toBe(false);
  });

  it("should reset undo and redo history when resetting the module", () => {
    useEditorStore.getState().addBlock("heading");

    useEditorStore.getState().resetModule();

    expect(useEditorStore.getState().history.past).toHaveLength(0);
    expect(useEditorStore.getState().history.future).toHaveLength(0);
    expect(useEditorStore.getState().canUndo).toBe(false);
    expect(useEditorStore.getState().canRedo).toBe(false);
  });

});

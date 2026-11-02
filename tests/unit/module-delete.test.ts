import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEditorStore } from "@/store/editor-store";

describe("Module deletion", () => {
  const storage = new Map<string, string>();
  const localStorageMock = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  };

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    useEditorStore.getState().resetModule();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("deletes only the selected module and preserves others", () => {
    storage.set(
      "financelab-modules",
      JSON.stringify([{ id: 1 }, { id: 2 }])
    );
    storage.set("financelab-content-1", "deleted content");
    storage.set("financelab-content-2", "preserved content");

    useEditorStore.getState().deleteModule("1");

    expect(JSON.parse(storage.get("financelab-modules") ?? "[]")).toEqual([
      { id: 2 },
    ]);
    expect(storage.has("financelab-content-1")).toBe(false);
    expect(storage.get("financelab-content-2")).toBe("preserved content");
  });

  it("clears the active module and undo history when it is deleted", () => {
    storage.set("financelab-modules", JSON.stringify([{ id: "active" }]));
    useEditorStore.getState().loadModule("active", "Active module", "");
    useEditorStore.getState().addBlock("heading");

    expect(useEditorStore.getState().canUndo).toBe(true);

    useEditorStore.getState().deleteModule("active");

    const state = useEditorStore.getState();
    expect(state.activeModuleId).toBeNull();
    expect(state.module.blocks).toHaveLength(0);
    expect(state.history.past).toHaveLength(0);
    expect(state.history.future).toHaveLength(0);
    expect(state.canUndo).toBe(false);
    expect(state.canRedo).toBe(false);
    expect(storage.has("financelab-active-module-id")).toBe(false);
    expect(storage.has("financelab-content-active")).toBe(false);
  });

  it("persists an empty catalog when the last module is deleted", () => {
    storage.set("financelab-modules", JSON.stringify([{ id: "only" }]));

    useEditorStore.getState().deleteModule("only");

    expect(storage.get("financelab-modules")).toBe("[]");
  });

  it("does not restore deleted module content after reload", () => {
    storage.set("financelab-modules", JSON.stringify([{ id: "removed" }]));
    useEditorStore.getState().loadModule("removed", "Removed module", "");
    useEditorStore.getState().addBlock("heading");

    useEditorStore.getState().deleteModule("removed");
    useEditorStore.getState().resetModule();
    useEditorStore.getState().loadModule("removed", "Removed module", "");

    expect(useEditorStore.getState().module.blocks).toHaveLength(0);
    expect(JSON.parse(storage.get("financelab-modules") ?? "[]")).toEqual([]);
    expect(storage.has("financelab-content-removed")).toBe(false);
  });
});

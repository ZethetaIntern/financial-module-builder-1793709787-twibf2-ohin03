import { create } from "zustand";
import type {
  BaseBlock,
  BlockType,
  EditorMode,
  LearningModule,
  ModuleMetadata,
  PreviewDevice,
} from "@/types";
import { getBlockDefinition } from "@/data/block-registry";

const MAX_HISTORY = 50;

interface EditorHistory {
  past: LearningModule[];
  future: LearningModule[];
}

interface EditorStore {
  module: LearningModule;
  activeModuleId: string | null;
  selectedBlockId: string | null;
  activeMode: EditorMode;
  previewDevice: PreviewDevice;
  isDragging: boolean;

  history: EditorHistory;
  canUndo: boolean;
  canRedo: boolean;

  loadModule: (id: string, title: string, description: string) => void;
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, updates: Partial<BaseBlock>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;

  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  selectBlock: (id: string | null) => void;
  setActiveMode: (mode: EditorMode) => void;
  setPreviewDevice: (device: PreviewDevice) => void;
  setIsDragging: (value: boolean) => void;

  updateModuleMetadata: (updates: Partial<ModuleMetadata>) => void;
  resetModule: () => void;
}

const createInitialModule = (
  id = "module-1",
  title = "Untitled Financial Module",
  description = "Create an interactive financial education experience."
): LearningModule => {
  const now = Date.now();

  return {
    metadata: {
      id,
      title,
      description,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    },
    blocks: [],
  };
};

const saveModule = (module: LearningModule) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `financelab-content-${module.metadata.id}`,
      JSON.stringify(module)
    );
  } catch (error) {
    console.error("Failed to save module:", error);
  }
};

const createHistoryUpdate = (
  current: LearningModule,
  next: LearningModule,
  history: EditorHistory
) => {
  const past = [...history.past, current].slice(-MAX_HISTORY);

  return {
    module: next,
    history: {
      past,
      future: [],
    },
    canUndo: past.length > 0,
    canRedo: false,
  };
};

export const useEditorStore = create<EditorStore>((set) => ({
  module: createInitialModule(),
  activeModuleId: null,
  selectedBlockId: null,
  activeMode: "edit",
  previewDevice: "desktop",
  isDragging: false,

  history: {
    past: [],
    future: [],
  },
  canUndo: false,
  canRedo: false,

  loadModule: (id, title, description) => {
    localStorage.setItem("financelab-active-module-id", id);

    let moduleData = createInitialModule(id, title, description);

    try {
      const saved = localStorage.getItem(`financelab-content-${id}`);

      if (saved) {
        const parsed = JSON.parse(saved) as LearningModule;

        if (
          parsed &&
          parsed.metadata?.id === id &&
          Array.isArray(parsed.blocks)
        ) {
          moduleData = parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load module content:", error);
    }

    set({
      module: moduleData,
      activeModuleId: id,
      selectedBlockId: null,
      activeMode: "edit",
      isDragging: false,
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false,
    });
  },

  addBlock: (type, index) => {
    const definition = getBlockDefinition(type);

    if (!definition) return;

    const now = Date.now();

    const newBlock: BaseBlock = {
      id: crypto.randomUUID(),
      type: definition.type,
      category: definition.category,
      title: definition.label,
      visible: true,
      content: {},
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const blocks = [...state.module.blocks];

      if (index !== undefined && index >= 0 && index <= blocks.length) {
        blocks.splice(index, 0, newBlock);
      } else {
        blocks.push(newBlock);
      }

      const nextModule: LearningModule = {
        ...state.module,
        blocks,
        metadata: {
          ...state.module.metadata,
          updatedAt: now,
        },
      };

      saveModule(nextModule);

      return {
        ...createHistoryUpdate(nextModule === state.module ? state.module : state.module, nextModule, state.history),
        selectedBlockId: newBlock.id,
      };
    });
  },

  updateBlock: (id, updates) =>
    set((state) => {
      const existingBlock = state.module.blocks.find(
        (block) => block.id === id
      );

      if (!existingBlock) return state;

      const now = Date.now();

      const nextModule: LearningModule = {
        ...state.module,
        blocks: state.module.blocks.map((block) =>
          block.id === id
            ? { ...block, ...updates, updatedAt: now }
            : block
        ),
        metadata: {
          ...state.module.metadata,
          updatedAt: now,
        },
      };

      if (JSON.stringify(existingBlock) === JSON.stringify({
        ...existingBlock,
        ...updates,
        updatedAt: now,
      })) {
        return state;
      }

      saveModule(nextModule);

      return createHistoryUpdate(state.module, nextModule, state.history);
    }),

  deleteBlock: (id) =>
    set((state) => {
      const blocks = state.module.blocks.filter((block) => block.id !== id);

      if (blocks.length === state.module.blocks.length) return state;

      const nextModule: LearningModule = {
        ...state.module,
        blocks,
        metadata: {
          ...state.module.metadata,
          updatedAt: Date.now(),
        },
      };

      saveModule(nextModule);

      return {
        ...createHistoryUpdate(state.module, nextModule, state.history),
        selectedBlockId:
          state.selectedBlockId === id ? null : state.selectedBlockId,
      };
    }),

  reorderBlocks: (activeId, overId) =>
    set((state) => {
      const blocks = [...state.module.blocks];

      const oldIndex = blocks.findIndex((block) => block.id === activeId);
      const newIndex = blocks.findIndex((block) => block.id === overId);

      if (
        oldIndex === -1 ||
        newIndex === -1 ||
        oldIndex === newIndex
      ) {
        return state;
      }

      const [movedBlock] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, movedBlock);

      const nextModule: LearningModule = {
        ...state.module,
        blocks,
        metadata: {
          ...state.module.metadata,
          updatedAt: Date.now(),
        },
      };

      saveModule(nextModule);

      return createHistoryUpdate(state.module, nextModule, state.history);
    }),

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state;

      const previous = state.history.past[state.history.past.length - 1];
      const past = state.history.past.slice(0, -1);
      const future = [state.module, ...state.history.future].slice(
        0,
        MAX_HISTORY
      );

      saveModule(previous);

      return {
        module: previous,
        history: { past, future },
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];
      const future = state.history.future.slice(1);
      const past = [...state.history.past, state.module].slice(
        -MAX_HISTORY
      );

      saveModule(next);

      return {
        module: next,
        history: { past, future },
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      };
    }),

  clearHistory: () =>
    set({
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false,
    }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  setActiveMode: (mode) => set({ activeMode: mode }),

  setPreviewDevice: (device) => set({ previewDevice: device }),

  setIsDragging: (value) => set({ isDragging: value }),

  updateModuleMetadata: (updates) =>
    set((state) => {
      const nextModule: LearningModule = {
        ...state.module,
        metadata: {
          ...state.module.metadata,
          ...updates,
          updatedAt: Date.now(),
        },
      };

      saveModule(nextModule);

      return createHistoryUpdate(state.module, nextModule, state.history);
    }),

  resetModule: () =>
    set({
      module: createInitialModule(),
      activeModuleId: null,
      selectedBlockId: null,
      activeMode: "edit",
      previewDevice: "desktop",
      isDragging: false,
      history: { past: [], future: [] },
      canUndo: false,
      canRedo: false,
    }),
}));

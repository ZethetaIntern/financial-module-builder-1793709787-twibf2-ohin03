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

interface EditorStore {
  module: LearningModule;
  activeModuleId: string | null;
  selectedBlockId: string | null;
  activeMode: EditorMode;
  previewDevice: PreviewDevice;
  isDragging: boolean;

  loadModule: (id: string, title: string, description: string) => void;
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, updates: Partial<BaseBlock>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;

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

export const useEditorStore = create<EditorStore>((set) => ({
  module: createInitialModule(),
  activeModuleId: null,
  selectedBlockId: null,
  activeMode: "edit",
  previewDevice: "desktop",
  isDragging: false,

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

      return {
        module: {
          ...state.module,
          blocks,
          metadata: {
            ...state.module.metadata,
            updatedAt: now,
          },
        },
        selectedBlockId: newBlock.id,
      };
    });
  },

  updateBlock: (id, updates) =>
    set((state) => ({
      module: {
        ...state.module,
        blocks: state.module.blocks.map((block) =>
          block.id === id
            ? { ...block, ...updates, updatedAt: Date.now() }
            : block
        ),
        metadata: {
          ...state.module.metadata,
          updatedAt: Date.now(),
        },
      },
    })),

  deleteBlock: (id) =>
    set((state) => ({
      module: {
        ...state.module,
        blocks: state.module.blocks.filter((block) => block.id !== id),
        metadata: {
          ...state.module.metadata,
          updatedAt: Date.now(),
        },
      },
      selectedBlockId:
        state.selectedBlockId === id ? null : state.selectedBlockId,
    })),

  reorderBlocks: (activeId, overId) =>
    set((state) => {
      const blocks = [...state.module.blocks];

      const oldIndex = blocks.findIndex((block) => block.id === activeId);
      const newIndex = blocks.findIndex((block) => block.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return state;
      }

      const [movedBlock] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, movedBlock);

      return {
        module: {
          ...state.module,
          blocks,
          metadata: {
            ...state.module.metadata,
            updatedAt: Date.now(),
          },
        },
      };
    }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  setActiveMode: (mode) => set({ activeMode: mode }),

  setPreviewDevice: (device) => set({ previewDevice: device }),

  setIsDragging: (value) => set({ isDragging: value }),

  updateModuleMetadata: (updates) =>
    set((state) => ({
      module: {
        ...state.module,
        metadata: {
          ...state.module.metadata,
          ...updates,
          updatedAt: Date.now(),
        },
      },
    })),

  resetModule: () =>
    set({
      module: createInitialModule(),
      activeModuleId: null,
      selectedBlockId: null,
      activeMode: "edit",
      previewDevice: "desktop",
      isDragging: false,
    }),
}));

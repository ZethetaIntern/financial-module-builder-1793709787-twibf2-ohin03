import type { BlockType } from "./block";

export type EditorMode = "edit" | "preview";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

export interface EditorState {
  selectedBlockId: string | null;
  activeMode: EditorMode;
  previewDevice: PreviewDevice;
  isDragging: boolean;
}

export interface BlockHistory {
  past: string[];
  future: string[];
  limit: number;
}

export interface DragResult {
  activeId: string;
  overId: string;
}

export interface BlockAction {
  type: "add" | "update" | "delete" | "reorder";
  blockType?: BlockType;
  blockId?: string;
}

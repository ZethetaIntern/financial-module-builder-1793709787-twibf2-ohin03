export type BlockCategory =
  | "text"
  | "media"
  | "quiz"
  | "finance"
  | "learning";

export type BlockType =
  | "heading"
  | "rich-text"
  | "image"
  | "video"
  | "multiple-choice"
  | "true-false"
  | "financial-calculator"
  | "interactive-example"
  | "callout"
  | "divider"
  | "accordion"
  | "progress-tracker"
  | "achievement-badge"
  | "concept-explainer";

export interface BaseBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  title: string;
  visible: boolean;
  content: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface ModuleMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

export interface LearningModule {
  metadata: ModuleMetadata;
  blocks: BaseBlock[];
}

export interface BlockDefinition {
  type: BlockType;
  category: BlockCategory;
  label: string;
  description: string;
  icon: string;
}

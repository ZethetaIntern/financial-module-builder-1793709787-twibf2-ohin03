import { z } from "zod";
import { BLOCK_REGISTRY } from "@/data/block-registry";
import type { LearningModule } from "@/types";

const supportedBlockTypes = BLOCK_REGISTRY.map(
  (block) => block.type
) as [string, ...string[]];

const moduleSchema = z.object({
  metadata: z.object({
    id: z.string().min(1),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().optional(),
    status: z.enum(["draft", "published"]),
    createdAt: z.number().finite(),
    updatedAt: z.number().finite(),
  }).strict(),

  blocks: z.array(
    z.object({
      id: z.string().min(1),
      type: z.enum(supportedBlockTypes),
      category: z.enum([
        "text",
        "media",
        "quiz",
        "finance",
        "learning",
      ]),
      title: z.string(),
      visible: z.boolean(),
      content: z.record(z.string(), z.unknown()),
      createdAt: z.number().finite(),
      updatedAt: z.number().finite(),
    }).strict()
  ),
}).strict().superRefine((module, context) => {
  const blockIds = new Set<string>();

  module.blocks.forEach((block, index) => {
    if (blockIds.has(block.id)) {
      context.addIssue({
        code: "custom",
        path: ["blocks", index, "id"],
        message: `Duplicate block ID: ${block.id}`,
      });
    }

    blockIds.add(block.id);

    const definition = BLOCK_REGISTRY.find(
      (item) => item.type === block.type
    );

    if (definition && definition.category !== block.category) {
      context.addIssue({
        code: "custom",
        path: ["blocks", index, "category"],
        message: `Invalid category for block type: ${block.type}`,
      });
    }
  });
});

export function exportModuleToJson(module: LearningModule): string {
  return JSON.stringify(module, null, 2);
}

export function validateImportedModule(
  input: unknown
):
  | { success: true; data: LearningModule }
  | { success: false; error: string } {
  const result = moduleSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return `${path || "module"}: ${issue.message}`;
        })
        .join("; "),
    };
  }

  return {
    success: true,
    data: result.data as LearningModule,
  };
}

export function importModuleFromJson(
  json: string
):
  | { success: true; data: LearningModule }
  | { success: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(json);
    return validateImportedModule(parsed);
  } catch {
    return {
      success: false,
      error: "Invalid JSON file. Please select a valid FinanceLab module export.",
    };
  }
}

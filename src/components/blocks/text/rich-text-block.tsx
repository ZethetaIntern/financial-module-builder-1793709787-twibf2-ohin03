"use client";

import type { BaseBlock } from "@/types";
import RichTextEditor from "@/components/editor/rich-text-editor";
import { useEditorStore } from "@/store/editor-store";

export default function RichTextBlock({ block }: { block: BaseBlock }) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const html =
    typeof block.content.html === "string"
      ? block.content.html
      : "<p>Start writing your financial education content...</p>";

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Rich Text Block
      </div>

      <RichTextEditor
        content={html}
        onChange={(updatedHTML) =>
          updateBlock(block.id, {
            content: { ...block.content, html: updatedHTML },
          })
        }
      />
    </div>
  );
}

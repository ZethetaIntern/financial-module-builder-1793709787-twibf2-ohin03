"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Heading1, Type } from "lucide-react";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];
type HeadingTagName = `h${HeadingLevel}`;

const HEADING_TAGS: Record<HeadingLevel, HeadingTagName> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const HEADING_TEXT_SIZES: Record<HeadingLevel, string> = {
  1: "text-3xl",
  2: "text-2xl",
  3: "text-xl",
  4: "text-lg",
  5: "text-base",
  6: "text-sm",
};

function isHeadingLevel(value: unknown): value is HeadingLevel {
  return (
    typeof value === "number" &&
    HEADING_LEVELS.some((headingLevel) => headingLevel === value)
  );
}

export default function HeadingBlock({ block }: { block: BaseBlock }) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const text =
    typeof block.content.text === "string"
      ? block.content.text
      : "Your heading";

  const level = isHeadingLevel(block.content.level)
    ? block.content.level
    : 1;
  const HeadingTag = HEADING_TAGS[level];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
        <Heading1 size={16} />
        Heading Block
      </div>

      <label
        htmlFor={`heading-${block.id}`}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
      >
        <Type size={15} />
        Heading Text
      </label>

      <input
        id={`heading-${block.id}`}
        type="text"
        value={text}
        onChange={(event) =>
          updateBlock(block.id, {
            content: { ...block.content, text: event.target.value },
          })
        }
        className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        placeholder="Enter your heading..."
      />

      <div className="mt-4">
        <label
          htmlFor={`heading-level-${block.id}`}
          className="mb-2 block text-xs font-medium text-slate-400"
        >
          Heading Level
        </label>

        <select
          id={`heading-level-${block.id}`}
          value={level}
          onChange={(event) =>
            updateBlock(block.id, {
              content: {
                ...block.content,
                level: Number(event.target.value),
              },
            })
          }
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value={1}>Heading 1 (H1)</option>
          <option value={2}>Heading 2 (H2)</option>
          <option value={3}>Heading 3 (H3)</option>
          <option value={4}>Heading 4 (H4)</option>
          <option value={5}>Heading 5 (H5)</option>
          <option value={6}>Heading 6 (H6)</option>
        </select>
      </div>

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <div className="mb-2 text-xs font-medium text-slate-400">
          Live Preview
        </div>
        <HeadingTag
          className={`break-words font-bold text-white ${HEADING_TEXT_SIZES[level]}`}
        >
          {text}
        </HeadingTag>
      </div>
    </div>
  );
}

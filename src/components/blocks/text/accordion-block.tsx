"use client";

import { useState } from "react";
import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { ChevronDown } from "lucide-react";

export default function AccordionBlock({ block }: { block: BaseBlock }) {
  const [isOpen, setIsOpen] = useState(true);
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const title =
    typeof block.content.title === "string"
      ? block.content.title
      : "Expandable section";

  const body =
    typeof block.content.body === "string"
      ? block.content.body
      : "Add detailed learning information here.";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="font-semibold text-white">{title}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-slate-700 p-4">
          <input
            value={title}
            onChange={(event) =>
              updateBlock(block.id, {
                content: { ...block.content, title: event.target.value },
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            placeholder="Accordion title"
          />

          <textarea
            value={body}
            onChange={(event) =>
              updateBlock(block.id, {
                content: { ...block.content, body: event.target.value },
              })
            }
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm leading-6 text-slate-300 outline-none focus:border-indigo-500"
            placeholder="Write expandable content..."
          />
        </div>
      )}
    </div>
  );
}

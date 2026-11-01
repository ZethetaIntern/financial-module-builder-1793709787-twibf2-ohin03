"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Lightbulb, RotateCcw } from "lucide-react";

interface InteractiveExampleBlockProps {
  block: BaseBlock;
}

export default function InteractiveExampleBlock({
  block,
}: InteractiveExampleBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const title = String(block.content.title ?? "Financial Example");
  const scenario = String(block.content.scenario ?? "");
  const inputLabel = String(block.content.inputLabel ?? "Your Answer");
  const inputValue = String(block.content.inputValue ?? "");
  const expectedAnswer = String(block.content.expectedAnswer ?? "");
  const explanation = String(block.content.explanation ?? "");

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  function resetExample() {
    updateContent({ inputValue: "" });
  }

  return (
    <div className="space-y-5 rounded-xl border border-indigo-500/20 bg-slate-900/50 p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="text-amber-400" size={20} />
        <h3 className="font-semibold text-white">Interactive Example</h3>
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Example Title
        <input
          value={title}
          onChange={(event) =>
            updateContent({ title: event.target.value })
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-300">
        Financial Scenario
        <textarea
          value={scenario}
          onChange={(event) =>
            updateContent({ scenario: event.target.value })
          }
          placeholder="Describe a financial situation for learners..."
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-4">
        <label className="block text-sm font-medium text-slate-300">
          {inputLabel}
          <input
            value={inputValue}
            onChange={(event) =>
              updateContent({ inputValue: event.target.value })
            }
            placeholder="Enter your answer..."
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <button
          type="button"
          onClick={resetExample}
          className="mt-3 flex items-center gap-2 text-xs text-slate-400 transition hover:text-white"
        >
          <RotateCcw size={14} />
          Reset Answer
        </button>
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Expected Answer
        <input
          value={expectedAnswer}
          onChange={(event) =>
            updateContent({ expectedAnswer: event.target.value })
          }
          placeholder="Enter the expected answer..."
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-300">
        Explanation
        <textarea
          value={explanation}
          onChange={(event) =>
            updateContent({ explanation: event.target.value })
          }
          placeholder="Explain the solution..."
          rows={3}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>
    </div>
  );
}

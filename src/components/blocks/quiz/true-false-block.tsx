"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Check, X } from "lucide-react";

interface TrueFalseBlockProps {
  block: BaseBlock;
}

export default function TrueFalseBlock({ block }: TrueFalseBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const statement = String(block.content.statement ?? "");
  const correctAnswer = block.content.correctAnswer;
  const explanation = String(block.content.explanation ?? "");

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Statement
        </label>

        <textarea
          value={statement}
          onChange={(event) =>
            updateContent({ statement: event.target.value })
          }
          placeholder="Enter a statement for learners to evaluate..."
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-300">
          Correct Answer
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateContent({ correctAnswer: true })}
            aria-pressed={correctAnswer === true}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
              correctAnswer === true
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            <Check size={17} />
            True
          </button>

          <button
            type="button"
            onClick={() => updateContent({ correctAnswer: false })}
            aria-pressed={correctAnswer === false}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
              correctAnswer === false
                ? "border-rose-500 bg-rose-500/10 text-rose-400"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            <X size={17} />
            False
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Explanation
        </label>

        <textarea
          value={explanation}
          onChange={(event) =>
            updateContent({ explanation: event.target.value })
          }
          placeholder="Explain why the statement is true or false..."
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

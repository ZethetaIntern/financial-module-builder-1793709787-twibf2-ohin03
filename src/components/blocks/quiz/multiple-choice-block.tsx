"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Plus, Trash2, CircleCheck } from "lucide-react";

interface MultipleChoiceBlockProps {
  block: BaseBlock;
}

interface Option {
  id: string;
  text: string;
}

export default function MultipleChoiceBlock({
  block,
}: MultipleChoiceBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const question = String(block.content.question ?? "");

  const options: Option[] = Array.isArray(block.content.options)
    ? (block.content.options as Option[])
    : [
        { id: "option-1", text: "Option 1" },
        { id: "option-2", text: "Option 2" },
      ];

  const correctAnswer = String(block.content.correctAnswer ?? "");
  const explanation = String(block.content.explanation ?? "");

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  function updateOption(id: string, text: string) {
    updateContent({
      options: options.map((option) =>
        option.id === id ? { ...option, text } : option
      ),
    });
  }

  function addOption() {
    updateContent({
      options: [
        ...options,
        {
          id: crypto.randomUUID(),
          text: `Option ${options.length + 1}`,
        },
      ],
    });
  }

  function removeOption(id: string) {
    if (options.length <= 2) return;

    updateContent({
      options: options.filter((option) => option.id !== id),
      correctAnswer: correctAnswer === id ? "" : correctAnswer,
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Question
        </label>

        <textarea
          value={question}
          onChange={(event) =>
            updateContent({ question: event.target.value })
          }
          placeholder="Enter your question..."
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-200">
            Answer Options
          </h4>

          <span className="text-xs text-slate-500">
            Select the correct answer
          </span>
        </div>

        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateContent({ correctAnswer: option.id })}
              aria-label={`Mark option ${index + 1} as correct`}
              aria-pressed={correctAnswer === option.id}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                correctAnswer === option.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 text-slate-500"
              }`}
            >
              <CircleCheck size={17} />
            </button>

            <input
              value={option.text}
              onChange={(event) =>
                updateOption(option.id, event.target.value)
              }
              aria-label={`Option ${index + 1}`}
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={() => removeOption(option.id)}
              disabled={options.length <= 2}
              aria-label={`Remove option ${index + 1}`}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-700 px-3 py-2 text-sm text-indigo-400 transition hover:border-indigo-500 hover:bg-indigo-500/5"
        >
          <Plus size={16} />
          Add Option
        </button>
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
          placeholder="Explain why the answer is correct..."
          rows={2}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

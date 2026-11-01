"use client";

import { useEditorStore } from "@/store/editor-store";
import type { BaseBlock } from "@/types";
import { BookOpen, Lightbulb, Target } from "lucide-react";

interface ConceptExplainerBlockProps {
  block: BaseBlock;
}

export default function ConceptExplainerBlock({
  block,
}: ConceptExplainerBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const title = String(block.content.title ?? "Understanding the Concept");
  const explanation = String(
    block.content.explanation ?? "Explain the concept in simple language."
  );
  const analogy = String(
    block.content.analogy ?? "Add a relatable real-life analogy."
  );
  const example = String(
    block.content.example ?? "Add a practical example."
  );
  const takeaway = String(
    block.content.takeaway ?? "Summarize the most important lesson."
  );

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  const fields = [
    {
      key: "explanation",
      label: "Concept Explanation",
      value: explanation,
      placeholder: "Explain this concept clearly...",
      rows: 4,
    },
    {
      key: "analogy",
      label: "Real-life Analogy",
      value: analogy,
      placeholder: "Compare this concept with something familiar...",
      rows: 3,
    },
    {
      key: "example",
      label: "Practical Example",
      value: example,
      placeholder: "Provide a practical example...",
      rows: 3,
    },
    {
      key: "takeaway",
      label: "Key Takeaway",
      value: takeaway,
      placeholder: "What should learners remember?",
      rows: 2,
    },
  ];

  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <div className="flex items-center gap-2">
        <BookOpen className="text-indigo-400" size={21} />
        <h3 className="font-semibold text-white">Concept Explainer</h3>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Concept
        </span>
        <h4 className="mt-2 text-xl font-bold text-white">{title}</h4>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
          {explanation}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-400">
              <Lightbulb size={17} />
              <span className="text-sm font-semibold">Real-life Analogy</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {analogy}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-400">
              <BookOpen size={17} />
              <span className="text-sm font-semibold">Practical Example</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {example}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <Target className="mt-0.5 shrink-0 text-indigo-400" size={19} />
          <div>
            <p className="text-sm font-semibold text-indigo-300">
              Key Takeaway
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {takeaway}
            </p>
          </div>
        </div>
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Concept Title
        <input
          value={title}
          onChange={(event) => updateContent({ title: event.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        />
      </label>

      {fields.map((field) => (
        <label key={field.key} className="block text-sm font-medium text-slate-300">
          {field.label}
          <textarea
            value={field.value}
            rows={field.rows}
            placeholder={field.placeholder}
            onChange={(event) =>
              updateContent({ [field.key]: event.target.value })
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
          />
        </label>
      ))}
    </div>
  );
}

"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Target, CheckCircle2 } from "lucide-react";

interface ProgressTrackerBlockProps {
  block: BaseBlock;
}

export default function ProgressTrackerBlock({
  block,
}: ProgressTrackerBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const goal = String(block.content.goal ?? "Complete your learning journey");
  const completed = Math.max(
    0,
    Math.floor(Number(block.content.completed ?? 2) || 0)
  );
  const total = Math.max(
    1,
    Math.floor(Number(block.content.total ?? 5) || 1)
  );

  const progress = Math.min(100, Math.round((completed / total) * 100));

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-indigo-500/20 bg-slate-900/50 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
          <Target size={21} />
        </div>
        <div>
          <h3 className="font-semibold text-white">Learning Progress</h3>
          <p className="text-xs text-slate-500">Track learning milestones</p>
        </div>
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Learning Goal
        <input
          value={goal}
          onChange={(event) => updateContent({ goal: event.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          Completed Lessons
          <input
            type="number"
            min="0"
            value={completed}
            onChange={(event) =>
              updateContent({
                completed: Math.max(0, Number(event.target.value) || 0),
              })
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="text-sm text-slate-300">
          Total Lessons
          <input
            type="number"
            min="1"
            value={total}
            onChange={(event) =>
              updateContent({
                total: Math.max(1, Number(event.target.value) || 1),
              })
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-slate-400">{goal}</span>
          <span className="text-lg font-bold text-indigo-400">
            {progress}%
          </span>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-label="Learning progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 size={15} className="text-emerald-400" />
          {completed} of {total} lessons completed
        </div>

        {progress === 100 && (
          <p className="mt-3 text-sm font-medium text-emerald-400">
            Learning goal completed!
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import {
  Award,
  Star,
  Trophy,
  Medal,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface AchievementBadgeBlockProps {
  block: BaseBlock;
}

const badgeIcons = {
  award: Award,
  star: Star,
  trophy: Trophy,
  medal: Medal,
  shield: ShieldCheck,
};

type BadgeIcon = keyof typeof badgeIcons;

export default function AchievementBadgeBlock({
  block,
}: AchievementBadgeBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const name = String(block.content.name ?? "Learning Champion");
  const description = String(
    block.content.description ?? "Complete your learning milestones."
  );
  const icon = String(block.content.icon ?? "award") as BadgeIcon;
  const color = String(block.content.color ?? "indigo");
  const unlocked = block.content.unlocked === true;

  const Icon = badgeIcons[icon] ?? Award;

  const colors: Record<string, string> = {
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  };

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
      <h3 className="font-semibold text-white">Achievement Badge</h3>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-6 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full border ${
            unlocked
              ? colors[color] ?? colors.indigo
              : "border-slate-700 bg-slate-800 text-slate-500"
          }`}
        >
          {unlocked ? <Icon size={36} /> : <Lock size={30} />}
        </div>

        <div>
          <h4 className="text-lg font-bold text-white">{name}</h4>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            {description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            unlocked
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Badge Name
        <input
          value={name}
          onChange={(event) => updateContent({ name: event.target.value })}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-300">
        Description
        <textarea
          value={description}
          onChange={(event) =>
            updateContent({ description: event.target.value })
          }
          rows={2}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-300">
          Badge Icon
          <select
            value={icon}
            onChange={(event) => updateContent({ icon: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          >
            <option value="award">Award</option>
            <option value="star">Star</option>
            <option value="trophy">Trophy</option>
            <option value="medal">Medal</option>
            <option value="shield">Shield</option>
          </select>
        </label>

        <label className="text-sm text-slate-300">
          Badge Color
          <select
            value={color}
            onChange={(event) => updateContent({ color: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
          >
            <option value="indigo">Indigo</option>
            <option value="amber">Amber</option>
            <option value="emerald">Emerald</option>
            <option value="rose">Rose</option>
            <option value="cyan">Cyan</option>
          </select>
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-3">
        <input
          type="checkbox"
          checked={unlocked}
          onChange={(event) =>
            updateContent({ unlocked: event.target.checked })
          }
          className="h-4 w-4 accent-indigo-500"
        />
        <span className="text-sm text-slate-300">
          Mark this achievement as unlocked
        </span>
      </label>
    </div>
  );
}

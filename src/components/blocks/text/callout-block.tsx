"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

const tones = {
  info: {
    label: "Information",
    icon: Info,
    style: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  },
  warning: {
    label: "Important",
    icon: AlertTriangle,
    style: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  success: {
    label: "Key Takeaway",
    icon: CheckCircle2,
    style: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
};

export default function CalloutBlock({ block }: { block: BaseBlock }) {
  const updateBlock = useEditorStore((state) => state.updateBlock);

  const tone =
    block.content.tone === "warning" || block.content.tone === "success"
      ? block.content.tone
      : "info";

  const message =
    typeof block.content.message === "string"
      ? block.content.message
      : "Add an important financial learning note here.";

  const config = tones[tone];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-5 ${config.style}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon size={18} />
        {config.label}
      </div>

      <select
        value={tone}
        onChange={(event) =>
          updateBlock(block.id, {
            content: {
              ...block.content,
              tone: event.target.value,
            },
          })
        }
        className="mb-3 rounded-lg border border-current/20 bg-slate-900 px-3 py-2 text-xs"
        aria-label="Callout type"
      >
        <option value="info">Information</option>
        <option value="warning">Important</option>
        <option value="success">Key Takeaway</option>
      </select>

      <textarea
        value={message}
        onChange={(event) =>
          updateBlock(block.id, {
            content: { ...block.content, message: event.target.value },
          })
        }
        rows={3}
        className="w-full resize-y bg-transparent text-sm leading-7 outline-none placeholder:text-slate-500"
        placeholder="Write your callout message..."
      />
    </div>
  );
}

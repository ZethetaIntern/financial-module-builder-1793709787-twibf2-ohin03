"use client";

export default function DividerBlock() {
  return (
    <div className="py-5" aria-label="Content section divider">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Section Break
        </span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>
    </div>
  );
}

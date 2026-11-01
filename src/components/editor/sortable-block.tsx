"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { BaseBlock } from "@/types";
import BlockRenderer from "@/components/editor/block-renderer";

interface SortableBlockProps {
  block: BaseBlock;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SortableBlock({
  block,
  index,
  isSelected,
  onSelect,
  onDelete,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      data-testid={`sortable-block-${block.id}`}
      style={style}
      onClick={() => onSelect(block.id)}
      className={`group relative rounded-xl border p-3 transition ${
        isDragging
          ? "z-10 border-indigo-500 bg-slate-800 opacity-60 shadow-xl"
          : isSelected
            ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30"
            : "border-transparent hover:border-slate-700"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder ${block.title}`}
            title="Drag to reorder"
            onClick={(event) => event.stopPropagation()}
            className="touch-none cursor-grab rounded-lg p-2 text-slate-500 transition hover:bg-slate-700 hover:text-white active:cursor-grabbing"
          >
            <GripVertical size={17} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(block.id);
            }}
            className="truncate text-left text-xs font-medium text-slate-400 hover:text-indigo-400"
          >
            {index + 1}. {block.title}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isSelected && (
            <span className="rounded-md bg-indigo-500/15 px-2 py-1 text-[10px] font-semibold text-indigo-400">
              SELECTED
            </span>
          )}

          <button
            type="button"
            aria-label={`Delete ${block.title}`}
            title="Delete block"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(block.id);
            }}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <BlockRenderer block={block} />
    </div>
  );
}

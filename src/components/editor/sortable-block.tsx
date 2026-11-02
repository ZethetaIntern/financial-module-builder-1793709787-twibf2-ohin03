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
  isPreview?: boolean;
}

export default function SortableBlock({
  block,
  index,
  isSelected,
  onSelect,
  onDelete,
  isPreview = false,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: isPreview,
  });

  const style = isPreview
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      };

  if (isPreview) {
    return (
      <article
        data-testid={`preview-block-${block.id}`}
        className="w-full"
      >
        <BlockRenderer block={block} />
      </article>
    );
  }

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
      {/* Block Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag to reorder ${block.title}`}
            title="Drag to reorder"
            onClick={(event) => event.stopPropagation()}
            className="flex h-10 w-10 shrink-0 touch-none cursor-grab items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-white active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </button>

          {/* Block Title */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(block.id);
            }}
            className="min-w-0 truncate text-left text-xs font-medium text-slate-300 transition hover:text-indigo-400"
          >
            {index + 1}. {block.title}
          </button>
        </div>

        {/* Block Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {isSelected && (
            <span className="hidden rounded-md bg-indigo-500/15 px-2 py-1 text-[10px] font-semibold text-indigo-400 sm:inline-flex">
              SELECTED
            </span>
          )}

          {/* Delete Button */}
          <button
            type="button"
            aria-label={`Delete ${block.title}`}
            title={`Delete ${block.title}`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(block.id);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <BlockRenderer block={block} />
    </div>
  );
}
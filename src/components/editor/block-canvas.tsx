"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { useEditorStore } from "@/store/editor-store";
import { BLOCK_REGISTRY } from "@/data/block-registry";
import SortableBlock from "@/components/editor/sortable-block";
import {
  Plus,
  FileText,
  MousePointerClick,
} from "lucide-react";

export default function BlockCanvas() {
  const blocks = useEditorStore((state) => state.module.blocks);
  const activeMode = useEditorStore((state) => state.activeMode);
  const isPreview = activeMode === "preview";
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const addBlock = useEditorStore((state) => state.addBlock);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const deleteBlock = useEditorStore((state) => state.deleteBlock);
  const reorderBlocks = useEditorStore((state) => state.reorderBlocks);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: { active: { id: string | number } }) {
    setActiveId(String(event.active.id));
    useEditorStore.getState().setIsDragging(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }

    setActiveId(null);
    useEditorStore.getState().setIsDragging(false);
  }

  function handleDragCancel() {
    setActiveId(null);
    useEditorStore.getState().setIsDragging(false);
  }

  if (isPreview) {
    const visibleBlocks = blocks.filter((block) => block.visible);

    return (
      <div data-testid="module-preview" className="space-y-6">
        {visibleBlocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-sm text-slate-400">
              No visible content blocks to preview.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {visibleBlocks.map((block, index) => (
              <SortableBlock
                key={block.id}
                block={block}
                index={index}
                isSelected={false}
                onSelect={() => {}}
                onDelete={() => {}}
                isPreview
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Canvas Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Module Canvas
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Build your financial education module.
          </p>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
          {blocks.length} {blocks.length === 1 ? "Block" : "Blocks"}
        </div>
      </div>

      {/* Block Toolbar */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Plus size={17} className="text-indigo-400" />
          Add Content Block
        </div>

        <div className="flex flex-wrap gap-2">
          {BLOCK_REGISTRY.map((definition) => (
            <button
              key={definition.type}
              type="button"
              onClick={() => addBlock(definition.type)}
              title={definition.description}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Plus size={13} />
                {definition.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Content */}
      <div className="min-h-[400px] rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 sm:p-6">
        {blocks.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
              <FileText size={28} className="text-indigo-400" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              Your canvas is empty
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Start building your learning module by adding a content block.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-indigo-400">
              <MousePointerClick size={15} />
              Choose a block from the toolbar above.
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={blocks.map((block) => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    isSelected={selectedBlockId === block.id}
                    onSelect={selectBlock}
                    onDelete={deleteBlock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

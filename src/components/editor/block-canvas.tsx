"use client";

import { useEditorStore } from "@/store/editor-store";
import { BLOCK_REGISTRY } from "@/data/block-registry";
import BlockRenderer from "@/components/editor/block-renderer";
import {
  Plus,
  Trash2,
  FileText,
  MousePointerClick,
} from "lucide-react";

export default function BlockCanvas() {
  const blocks = useEditorStore((state) => state.module.blocks);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const addBlock = useEditorStore((state) => state.addBlock);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const deleteBlock = useEditorStore((state) => state.deleteBlock);

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
          <div className="space-y-4">
            {blocks.map((block, index) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => selectBlock(block.id)}
                  className={`group relative rounded-xl border p-3 transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30"
                      : "border-transparent hover:border-slate-700"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        selectBlock(block.id);
                      }}
                      className="text-xs font-medium text-slate-400 hover:text-indigo-400"
                    >
                      {index + 1}. {block.title}
                    </button>

                    <div className="flex items-center gap-2">
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
                          deleteBlock(block.id);
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

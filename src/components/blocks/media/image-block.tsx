"use client";

import { useState } from "react";
import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";

interface ImageBlockProps {
  block: BaseBlock;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const [imageError, setImageError] = useState(false);

  const src = String(block.content.src ?? "");
  const alt = String(block.content.alt ?? "");
  const caption = String(block.content.caption ?? "");

  function updateContent(updates: Record<string, unknown>) {
    updateBlock(block.id, {
      content: { ...block.content, ...updates },
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <label className="block text-sm font-medium text-slate-300">
        Image URL
        <input
          value={src}
          onChange={(event) => {
            setImageError(false);
            updateContent({ src: event.target.value });
          }}
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-300">
        Alt text
        <input
          value={alt}
          onChange={(event) => updateContent({ alt: event.target.value })}
          placeholder="Describe the image"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="max-h-80 w-full rounded-lg object-contain"
        />
      )}

      {imageError && (
        <p className="text-sm text-rose-400">
          Image could not be loaded. Check the URL.
        </p>
      )}

      <label className="block text-sm font-medium text-slate-300">
        Caption
        <input
          value={caption}
          onChange={(event) => updateContent({ caption: event.target.value })}
          placeholder="Add an image caption"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>
    </div>
  );
}

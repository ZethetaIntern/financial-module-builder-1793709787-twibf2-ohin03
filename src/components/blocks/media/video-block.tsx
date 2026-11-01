"use client";

import type { BaseBlock } from "@/types";
import { useEditorStore } from "@/store/editor-store";

interface VideoBlockProps {
  block: BaseBlock;
}

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com"
    ) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }
  } catch {
    return "";
  }

  return "";
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const url = String(block.content.url ?? "");
  const title = String(block.content.title ?? "Educational video");
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/50 p-4">
      <label className="block text-sm font-medium text-slate-300">
        YouTube URL
        <input
          value={url}
          onChange={(event) =>
            updateBlock(block.id, {
              content: { ...block.content, url: event.target.value },
            })
          }
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-300">
        Video title
        <input
          value={title}
          onChange={(event) =>
            updateBlock(block.id, {
              content: { ...block.content, title: event.target.value },
            })
          }
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
        />
      </label>

      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Enter a valid YouTube URL to preview the video.
        </p>
      )}
    </div>
  );
}

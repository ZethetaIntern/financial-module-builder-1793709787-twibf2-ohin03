"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import {
  exportModuleToJson,
  importModuleFromJson,
} from "@/lib/module-io";

export default function ModuleIOControls() {
  const module = useEditorStore((state) => state.module);
  const importModule = useEditorStore((state) => state.importModule);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleExport() {
    try {
      const json = exportModuleToJson(module);
      const blob = new Blob([json], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = module.metadata.title
        .trim()
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase() || "financial-module";

      link.href = url;
      link.download = `${safeName}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setIsError(false);
      setMessage("Module exported successfully.");
    } catch {
      setIsError(true);
      setMessage("Failed to export module.");
    }
  }

  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        setIsError(true);
        setMessage("File is too large. Maximum size is 5 MB.");
        return;
      }

      const content = await file.text();
      const result = importModuleFromJson(content);

      if (!result.success) {
        setIsError(true);
        setMessage(result.error);
        return;
      }

      importModule(result.data);
      setIsError(false);
      setMessage("Module imported successfully.");
    } catch {
      setIsError(true);
      setMessage("Unable to read the selected JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import FinanceLab JSON module"
      />

      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-500 hover:text-white"
      >
        <Download size={16} />
        Export JSON
      </button>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-indigo-500 hover:text-white"
      >
        <Upload size={16} />
        Import JSON
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`w-full text-xs ${
            isError ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";
import BlockCanvas from "@/components/editor/block-canvas";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Pencil,
  BookOpen,
  Save,
  Undo2,
  Redo2,
} from "lucide-react";

export default function ModuleEditorPage() {
  // Restore the previously active module after page refresh.
  useEffect(() => {
    const activeId = localStorage.getItem("financelab-active-module-id");

    if (!activeId) return;

    try {
      const savedContent = localStorage.getItem(
        `financelab-content-${activeId}`
      );

      if (!savedContent) return;

      const parsed = JSON.parse(savedContent);

      if (
        parsed?.metadata?.id !== activeId ||
        !Array.isArray(parsed.blocks)
      ) {
        return;
      }

      useEditorStore.setState({
        module: parsed,
        activeModuleId: activeId,
        selectedBlockId: null,
        activeMode: "edit",
        isDragging: false,
      });
    } catch (error) {
      console.error("Failed to restore active module:", error);
    }
  }, []);
  // Global Undo / Redo keyboard shortcuts.
  useEffect(() => {
    function handleKeyboardShortcuts(event: KeyboardEvent) {
      const target = event.target;

      // Preserve native undo/redo inside inputs and rich-text editors.
      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          target.closest("input, textarea, select, [contenteditable='true']")
        )
      ) {
        return;
      }

      const isModifierPressed = event.ctrlKey || event.metaKey;

      if (!isModifierPressed || event.altKey) return;

      const key = event.key.toLowerCase();
      const store = useEditorStore.getState();

      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        store.redo();
      } else if (key === "z") {
        event.preventDefault();
        store.undo();
      } else if (key === "y" && !event.shiftKey) {
        event.preventDefault();
        store.redo();
      }
    }

    window.addEventListener("keydown", handleKeyboardShortcuts);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, []);

  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const canUndo = useEditorStore((state) => state.canUndo);
  const canRedo = useEditorStore((state) => state.canRedo);

  const module = useEditorStore((state) => state.module);
  const activeModuleId = useEditorStore((state) => state.activeModuleId);
  const updateModuleMetadata = useEditorStore(
    (state) => state.updateModuleMetadata
  );
  const activeMode = useEditorStore((state) => state.activeMode);
  const setActiveMode = useEditorStore((state) => state.setActiveMode);
  const previewDevice = useEditorStore((state) => state.previewDevice);
  const setPreviewDevice = useEditorStore(
    (state) => state.setPreviewDevice
  );

  // Automatically save the active module's content.
  useEffect(() => {
    if (!activeModuleId) return;

    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(
          `financelab-content-${activeModuleId}`,
          JSON.stringify(module)
        );

        const savedModules = localStorage.getItem("financelab-modules");

        if (savedModules) {
          const modules = JSON.parse(savedModules);

          const updatedModules = modules.map((item: {
            id: number;
            title: string;
            description?: string;
          }) =>
            String(item.id) === activeModuleId
              ? {
                  ...item,
                  title: module.metadata.title,
                  description: module.metadata.description,
                  updated: "Just now",
                }
              : item
          );

          localStorage.setItem(
            "financelab-modules",
            JSON.stringify(updatedModules)
          );
        }
      } catch (error) {
        console.error("Failed to save module content:", error);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [module, activeModuleId]);

  const devices = [
    { id: "desktop" as const, label: "Desktop", icon: Monitor },
    { id: "tablet" as const, label: "Tablet", icon: Tablet },
    { id: "mobile" as const, label: "Mobile", icon: Smartphone },
  ];

  const deviceWidth = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <main className="min-h-screen bg-[#090d18] text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0c1220]/95 backdrop-blur-xl">
        <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-indigo-500 hover:text-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </a>

            <div>
              <div className="flex items-center gap-2">
                <BookOpen size={17} className="text-indigo-400" />
                <span className="font-semibold text-white">
                  FinanceLab Editor
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Interactive Module Builder
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl + Z)"
                aria-label="Undo"
                className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:text-slate-500 disabled:opacity-100"
              >
                <Undo2 size={17} /><span>Undo</span>
              </button>

              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl + Shift + Z)"
                aria-label="Redo"
                className="flex items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:text-slate-500 disabled:opacity-100"
              >
                <Redo2 size={17} /><span>Redo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveMode("edit")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                activeMode === "edit"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("preview")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                activeMode === "preview"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Eye size={15} />
              Preview
            </button>

            <div className="mx-1 hidden h-7 w-px bg-slate-700 sm:block" />

            <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
              {devices.map((device) => {
                const Icon = device.icon;

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => setPreviewDevice(device.id)}
                    title={device.label}
                    aria-label={`${device.label} preview`}
                    className={`rounded-md p-2 transition ${
                      previewDevice === device.id
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">

        {/* Module Information */}
        <section
          className={`mb-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6 ${
            activeMode === "preview" ? "text-center sm:p-10" : ""
          }`}
        >
          {activeMode === "edit" ? (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Module Information
                  </span>
                  <h1 className="mt-1 text-xl font-bold text-white">
                    Edit Your Learning Module
                  </h1>
                </div>

                <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
                  Draft
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="module-title"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Module Title
                  </label>

                  <input
                    id="module-title"
                    value={module.metadata.title}
                    onChange={(event) =>
                      updateModuleMetadata({ title: event.target.value })
                    }
                    placeholder="Enter module title..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="module-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Module Description
                  </label>

                  <input
                    id="module-description"
                    value={module.metadata.description}
                    onChange={(event) =>
                      updateModuleMetadata({
                        description: event.target.value,
                      })
                    }
                    placeholder="Describe your learning module..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-3xl py-4">
              <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Learning Module
              </span>

              <h1 className="mt-5 break-words text-3xl font-bold leading-tight text-white sm:text-4xl">
                {module.metadata.title.trim() || "Untitled Learning Module"}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-7 text-slate-400 sm:text-base">
                {module.metadata.description.trim() ||
                  "No description has been added to this learning module yet."}
              </p>
            </div>
          )}
        </section>

        {/* Editor Workspace */}
        <section className="rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-semibold text-white">
                {activeMode === "edit" ? "Content Editor" : "Module Preview"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {activeMode === "edit"
                  ? "Add and customize your learning blocks."
                  : "Preview your module layout."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Save size={15} className="text-emerald-400" />
              Auto-save enabled
            </div>
          </div>

          <div className="mx-auto transition-all duration-300">
            <div
              className="mx-auto w-full"
              style={{
                maxWidth:
                  activeMode === "preview"
                    ? deviceWidth[previewDevice]
                    : "100%",
              }}
            >
              <BlockCanvas />
            </div>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-slate-600">
          FinanceLab Interactive Financial Education Module Builder
        </footer>
      </div>
    </main>
  );
}

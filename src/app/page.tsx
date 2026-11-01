"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/store/editor-store";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

type Module = {
  id: number;
  title: string;
  description?: string;
  category: string;
  blocks: number;
  progress: number;
  updated: string;
  color: string;
  icon: "book" | "chart" | "file";
};

const initialModules: Module[] = [
  {
    id: 1,
    title: "Introduction to Personal Finance",
    description: "Learn the fundamentals of personal finance, including income, expenses, saving, and financial planning.",
    category: "Personal Finance",
    blocks: 12,
    progress: 85,
    updated: "2 hours ago",
    color: "violet",
    icon: "book",
  },
  {
    id: 2,
    title: "Understanding Compound Interest",
    description: "Explore how compound interest works and how money can grow over time through investing.",
    category: "Investing",
    blocks: 8,
    progress: 60,
    updated: "Yesterday",
    color: "cyan",
    icon: "chart",
  },
  {
    id: 3,
    title: "Building Your First Budget",
    description: "Create a practical budget to manage income, track expenses, and build healthy money habits.",
    category: "Money Management",
    blocks: 15,
    progress: 100,
    updated: "2 days ago",
    color: "emerald",
    icon: "file",
  },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Modules", icon: Layers3 },
  { label: "Templates", icon: FileText },
  { label: "Analytics", icon: ChartNoAxesCombined },
];

const secondaryNavigation = [
  { label: "Settings", icon: Settings },
  { label: "Help & Support", icon: CircleHelp },
];

function ModuleIcon({ module }: { module: Module }) {
  const Icon =
    module.icon === "chart"
      ? TrendingUp
      : module.icon === "file"
        ? FileText
        : BookOpen;

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
        module.color === "violet"
          ? "bg-violet-500/15 text-violet-400"
          : module.color === "cyan"
            ? "bg-cyan-500/15 text-cyan-400"
            : "bg-emerald-500/15 text-emerald-400"
      }`}
    >
      <Icon size={20} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const loadModule = useEditorStore((state) => state.loadModule);

  const [activeNav, setActiveNav] = useState("Overview");
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [search, setSearch] = useState("");

  // Load saved modules after the component mounts.
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem("financelab-modules");

      if (savedModules) {
        const parsedModules: unknown = JSON.parse(savedModules);

        if (Array.isArray(parsedModules)) {
          const mergedModules = (parsedModules as Module[]).map((savedModule) => {
            const defaultModule = initialModules.find(
              (item) => item.id === savedModule.id
            );

            return {
              ...defaultModule,
              ...savedModule,
              description:
                savedModule.description?.trim() ||
                defaultModule?.description ||
                "",
            };
          });

          setModules(mergedModules);
        }
      }
    } catch (error) {
      console.error("Failed to load saved modules:", error);
    } finally {
      setModulesLoaded(true);
    }
  }, []);

  // Save modules whenever the list changes.
  useEffect(() => {
    if (!modulesLoaded) return;

    try {
      localStorage.setItem("financelab-modules", JSON.stringify(modules));
    } catch (error) {
      console.error("Failed to save modules:", error);
    }
  }, [modules, modulesLoaded]);

  // Sync actual block counts from each module's saved content.
  useEffect(() => {
    if (!modulesLoaded) return;

    setModules((currentModules) =>
      currentModules.map((module) => {
        try {
          const savedContent = localStorage.getItem(
            `financelab-content-${module.id}`
          );

          if (!savedContent) {
            return { ...module, blocks: 0 };
          }

          const parsed = JSON.parse(savedContent);

          return {
            ...module,
            blocks: Array.isArray(parsed?.blocks)
              ? parsed.blocks.length
              : 0,
          };
        } catch (error) {
          console.error(
            `Failed to sync blocks for module ${module.id}:`,
            error
          );
          return module;
        }
      })
    );
  }, [modulesLoaded]);
  const [modalOpen, setModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredModules = useMemo(
    () =>
      modules.filter((module) =>
        module.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [modules, search],
  );

  function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!moduleTitle.trim()) return;

    const newModule: Module = {
      id: Date.now(),
      title: moduleTitle.trim(),
      description: "Create an interactive learning experience for your learners.",
      category: "New Module",
      blocks: 0,
      progress: 0,
      updated: "Just now",
      color: "violet",
      icon: "book",
    };

    setModules((current) => [newModule, ...current]);

    loadModule(
      String(newModule.id),
      newModule.title,
      newModule.description || "Create an interactive learning experience for your learners."
    );

    setModuleTitle("");
    setModalOpen(false);
    setActiveNav("My Modules");
    router.push("/editor");
  }

  function openModule(module: Module) {
    loadModule(
      String(module.id),
      module.title,
      `Create an interactive ${module.category.toLowerCase()} learning experience.`
    );

    router.push("/editor");
  }

  return (
    <div className="min-h-screen bg-[#090d18] text-slate-100">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0d1220] transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <GraduationCap size={23} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">
                FINANCE<span className="text-indigo-400">LAB</span>
              </h1>
              <p className="mt-0.5 text-[10px] tracking-[0.18em] text-slate-500">
                MODULE BUILDER
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activeNav === label;

              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveNav(label);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-indigo-500/15 font-semibold text-indigo-300"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                  {label === "My Modules" && (
                    <span className="ml-auto rounded-md bg-white/[0.07] px-2 py-0.5 text-[10px] text-slate-400">
                      {modules.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preferences
          </p>

          <nav className="space-y-1">
            {secondaryNavigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  activeNav === label
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 to-violet-500/[0.04] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Create something great
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-400">
              Build engaging financial learning experiences.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400"
            >
              <Plus size={15} />
              New Module
            </button>
          </div>

          <p className="mt-5 text-center text-[10px] text-slate-600">
            FinanceLab v1.0.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-[260px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#090d18]/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-400 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs text-slate-500">Workspace / Dashboard</p>
              <h2 className="mt-0.5 text-sm font-semibold text-white">
                {activeNav}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search modules..."
                className="h-10 w-56 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
              />
            </div>

            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </button>

            <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3 sm:pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                N
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white">Creator</p>
                <p className="text-[10px] text-slate-500">Workspace</p>
              </div>
              <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8">
          {/* Welcome */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Your learning workspace
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back, Creator
                <span className="text-indigo-400">.</span>
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Build, manage and deliver engaging financial education modules.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              <Plus size={17} />
              Create New Module
            </button>
          </section>

          {/* Stats */}
          <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Modules",
                value: modules.length.toString().padStart(2, "0"),
                change: "Your learning content",
                icon: Layers3,
                color: "indigo",
              },
              {
                label: "Total Blocks",
                value: modules
                  .reduce((total, module) => total + module.blocks, 0)
                  .toString(),
                change: "Across all modules",
                icon: FileText,
                color: "cyan",
              },
              {
                label: "Completed Modules",
                value: modules
                  .filter((module) => module.progress === 100)
                  .length.toString(),
                change: "Ready for publishing",
                icon: CheckCircle2,
                color: "emerald",
              },
              {
                label: "Average Progress",
                value: `${
                  modules.length
                    ? Math.round(
                        modules.reduce(
                          (total, module) => total + module.progress,
                          0,
                        ) / modules.length,
                      )
                    : 0
                }%`,
                change: "Overall completion",
                icon: Activity,
                color: "violet",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.07] bg-[#101727] p-5 transition hover:border-white/[0.13]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-400">
                      {stat.label}
                    </p>
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        stat.color === "indigo"
                          ? "bg-indigo-500/15 text-indigo-400"
                          : stat.color === "cyan"
                            ? "bg-cyan-500/15 text-cyan-400"
                            : stat.color === "emerald"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-violet-500/15 text-violet-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {stat.change}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Main grid */}
          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Recent Modules
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Continue working on your learning content.
                  </p>
                </div>

                <button
                  onClick={() => setActiveNav("My Modules")}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                  View all <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {filteredModules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
                    <FolderOpen
                      size={28}
                      className="mx-auto text-slate-600"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      No matching modules found.
                    </p>
                  </div>
                ) : (
                  filteredModules.map((module) => (
                    <article
                      key={module.id}
                      className="group rounded-2xl border border-white/[0.07] bg-[#101727] p-4 transition hover:border-indigo-500/30 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <ModuleIcon module={module} />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-white transition group-hover:text-indigo-300">
                              {module.title}
                            </h3>
                            {module.progress === 100 && (
                              <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-400">
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {module.description && (
                            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-400">
                              {module.description}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span>{module.category}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                            <span>{module.blocks} blocks</span>
                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                            <span className="flex items-center gap-1">
                              <Clock3 size={12} />
                              {module.updated}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 transition-all"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {module.progress}%
                            </span>
                          </div>
                        </div>

                        <button
                          aria-label={`Open ${module.title}`}
                          onClick={() => openModule(module)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-slate-500 transition hover:border-indigo-500/30 hover:text-indigo-300 sm:flex"
                        >
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Right panel */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-white/[0.07] bg-[#101727] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    Quick Actions
                  </h2>
                  <Sparkles size={16} className="text-indigo-400" />
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                      <Plus size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        New Module
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Start from scratch
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveNav("Templates")}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                      <FileText size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Browse Templates
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Explore starting points
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveNav("Analytics")}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] p-3 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <ChartNoAxesCombined size={17} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        View Analytics
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Track your progress
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/20 via-[#171c38] to-[#11182a] p-5">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-300">
                    <Users size={19} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-white">
                    Learning Experience
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Combine quizzes, interactive examples and financial
                    calculators to create engaging lessons.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-indigo-300">
                    <Sparkles size={13} />
                    Make learning interactive
                  </div>
                </div>
              </div>
            </aside>
          </section>

          <footer className="mt-12 border-t border-white/[0.06] py-6 text-center text-[10px] text-slate-600">
            FinanceLab Module Builder · Built for better financial learning
          </footer>
        </main>
      </div>

      {/* Create module modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create New Module
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Give your learning module a name.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createModule} className="mt-6">
              <label
                htmlFor="module-title"
                className="mb-2 block text-xs font-medium text-slate-300"
              >
                Module title
              </label>

              <input
                id="module-title"
                autoFocus
                required
                value={moduleTitle}
                onChange={(event) => setModuleTitle(event.target.value)}
                placeholder="e.g. Introduction to Investing"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400"
                >
                  <Plus size={14} />
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

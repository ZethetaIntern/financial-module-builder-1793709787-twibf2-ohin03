"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export default function RichTextEditor({
  content = "<p>Start writing your learning content...</p>",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] px-5 py-4 text-sm leading-7 text-slate-200 outline-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-400">
        Loading editor...
      </div>
    );
  }

  const toolbarButton =
    "flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

  const isActive = (name: string) =>
    editor.isActive(name)
      ? "bg-indigo-500/20 text-indigo-400"
      : "";

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-700 bg-slate-800/80 p-2">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Bold"
          aria-label="Bold"
          className={`${toolbarButton} ${isActive("bold")}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Italic"
          aria-label="Italic"
          className={`${toolbarButton} ${isActive("italic")}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Underline"
          aria-label="Underline"
          className={`${toolbarButton} ${isActive("underline")}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700" />

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Heading 1"
          aria-label="Heading 1"
          className={`${toolbarButton} ${isActive("heading") && editor.isActive("heading", { level: 1 }) ? "bg-indigo-500/20 text-indigo-400" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={18} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Heading 2"
          aria-label="Heading 2"
          className={`${toolbarButton} ${editor.isActive("heading", { level: 2 }) ? "bg-indigo-500/20 text-indigo-400" : ""}`}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={18} />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700" />

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Bullet List"
          aria-label="Bullet List"
          className={`${toolbarButton} ${isActive("bulletList")}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Numbered List"
          aria-label="Numbered List"
          className={`${toolbarButton} ${isActive("orderedList")}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Blockquote"
          aria-label="Blockquote"
          className={`${toolbarButton} ${isActive("blockquote")}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700" />

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Add Link"
          aria-label="Add Link"
          className={`${toolbarButton} ${isActive("link")}`}
          onClick={addLink}
        >
          <LinkIcon size={17} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Remove Link"
          aria-label="Remove Link"
          className={toolbarButton}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <Unlink size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700" />

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Undo"
          aria-label="Undo"
          disabled={!editor.can().undo()}
          className={toolbarButton}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          title="Redo"
          aria-label="Redo"
          disabled={!editor.can().redo()}
          className={toolbarButton}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </button>
      </div>

      <EditorContent editor={editor} className="rich-text-content" />

      <div className="flex items-center justify-between border-t border-slate-700 px-4 py-2 text-xs text-slate-500">
        <span>Rich Text Editor</span>
        <span>Powered by TipTap</span>
      </div>
    </div>
  );
}

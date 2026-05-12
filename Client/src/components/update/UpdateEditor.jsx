import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import  EditorToolbar  from "../../components/ui/EditorToolbar";

export default function UpdateEditor({
  value,
  onChange,
  placeholder = "Write your update…",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  // Sync external value resets (e.g. form reset)
  useEffect(() => {
    if (editor && value === "") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  return (
    <div
      className="tiptap-editor"
      style={{
        border: "1px solid var(--rule)",
        borderRadius: "4px",
        overflow: "hidden",
        background: "var(--paper)",
        transition: "border-color var(--transition)",
      }}
      onFocusCapture={(e) => {
        e.currentTarget.style.borderColor = "var(--ink-4)";
      }}
      onBlurCapture={(e) => {
        e.currentTarget.style.borderColor = "var(--rule)";
      }}>
      <EditorToolbar editor={editor} />
      <div style={{ padding: "16px" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

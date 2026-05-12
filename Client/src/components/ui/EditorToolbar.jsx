import {
  Bold,
  Italic,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const tools = [
    {
      group: [
        {
          icon: <Heading2 size={14} />,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editor.isActive("heading", { level: 2 }),
          title: "Heading 2",
        },
        {
          icon: <Heading3 size={14} />,
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          active: editor.isActive("heading", { level: 3 }),
          title: "Heading 3",
        },
      ],
    },
    {
      group: [
        {
          icon: <Bold size={14} />,
          action: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
          title: "Bold",
        },
        {
          icon: <Italic size={14} />,
          action: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
          title: "Italic",
        },
        {
          icon: <Code size={14} />,
          action: () => editor.chain().focus().toggleCode().run(),
          active: editor.isActive("code"),
          title: "Inline code",
        },
        {
          icon: <LinkIcon size={14} />,
          action: setLink,
          active: editor.isActive("link"),
          title: "Add link",
        },
      ],
    },
    {
      group: [
        {
          icon: <List size={14} />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive("bulletList"),
          title: "Bullet list",
        },
        {
          icon: <ListOrdered size={14} />,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive("orderedList"),
          title: "Ordered list",
        },
        {
          icon: <Quote size={14} />,
          action: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive("blockquote"),
          title: "Blockquote",
        },
        {
          icon: <Minus size={14} />,
          action: () => editor.chain().focus().setHorizontalRule().run(),
          active: false,
          title: "Divider",
        },
      ],
    },
    {
      group: [
        {
          icon: <Undo size={14} />,
          action: () => editor.chain().focus().undo().run(),
          active: false,
          title: "Undo",
          disabled: !editor.can().undo(),
        },
        {
          icon: <Redo size={14} />,
          action: () => editor.chain().focus().redo().run(),
          active: false,
          title: "Redo",
          disabled: !editor.can().redo(),
        },
      ],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "8px 12px",
        borderBottom: "1px solid var(--rule)",
        background: "var(--paper-2)",
        borderRadius: "4px 4px 0 0",
        flexWrap: "wrap",
      }}>
      {tools.map((group, gi) => (
        <div
          key={gi}
          style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          {gi > 0 && (
            <div
              style={{
                width: "1px",
                height: "18px",
                background: "var(--rule)",
                margin: "0 4px",
              }}
            />
          )}
          {group.group.map((tool, ti) => (
            <button
              key={ti}
              type="button"
              title={tool.title}
              onClick={tool.action}
              disabled={tool.disabled}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                border: "none",
                borderRadius: "3px",
                cursor: tool.disabled ? "not-allowed" : "pointer",
                color: tool.active ? "var(--ink)" : "var(--ink-4)",
                background: tool.active ? "var(--paper-3)" : "transparent",
                opacity: tool.disabled ? 0.4 : 1,
                transition: "all var(--transition)",
              }}
              onMouseEnter={(e) => {
                if (!tool.disabled && !tool.active) {
                  e.currentTarget.style.background = "var(--paper-3)";
                  e.currentTarget.style.color = "var(--ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!tool.active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--ink-4)";
                }
              }}>
              {tool.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

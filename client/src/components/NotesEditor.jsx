import { useEffect } from "react";
import {
  useEditor,
  EditorContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const NotesEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
        autolink: false,
      }),
    ],

    content: content || "",

    editorProps: {
      handleClick(view, pos, event) {
        const target = event.target;

        if (target instanceof HTMLElement && target.closest("a")) {
          event.preventDefault();

          // Put the cursor where the user clicked
          const coordinates = {
            left: event.clientX,
            top: event.clientY,
          };

          const position = view.posAtCoords(coordinates);

          if (position) {
            view.dispatch(
              view.state.tr.setSelection(
                view.state.selection.constructor.near(
                  view.state.doc.resolve(position.pos)
                )
              )
            );
          }

          return true;
        }

        return false;
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();
    const newContent = content || "";

    if (currentContent !== newContent) {
      editor.commands.setContent(newContent, false);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          style={{
            fontWeight: editor.isActive("bold")
              ? "bold"
              : "normal",
          }}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          style={{
            fontStyle: editor.isActive("italic")
              ? "italic"
              : "normal",
          }}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          Numbered List
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
        >
          Code Block
        </button>

        <button
          type="button"
          onClick={addLink}
        >
          Link
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default NotesEditor;
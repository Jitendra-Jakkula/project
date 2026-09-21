import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import LinkDialog from "./LinkDialog";
import api from "../services/api";

/*
 * Custom Tiptap Image extension
 *
 * Adds Cloudinary publicId to the image node.
 */
const CustomImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },

      alt: {
        default: null,
      },

      title: {
        default: null,
      },

      width: {
        default: null,
      },

      height: {
        default: null,
      },

      loading: {
        default: null,
      },

      publicId: {
        default: null,

        parseHTML: (element) => {
          return element.getAttribute("data-public-id");
        },

        renderHTML: (attributes) => {
          if (!attributes.publicId) {
            return {};
          }

          return {
            "data-public-id": attributes.publicId,
          };
        },
      },
    };
  },
});

const NotesEditor = ({ content, onChange }) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const savedLinkPosition = useRef(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
        autolink: false,
      }),

      CustomImage.configure({
        allowBase64: false,
      }),
    ],

    content:
      content || {
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      },

    /*
     * V1 LINK BEHAVIOR
     *
     * Clicking an existing link while editing
     * does NOT redirect the user.
     */
    editorProps: {
      handleClick(view, pos, event) {
        const target = event.target;

        if (
          target instanceof HTMLElement &&
          target.closest("a")
        ) {
          event.preventDefault();

          const coordinates = {
            left: event.clientX,
            top: event.clientY,
          };

          const position = view.posAtCoords(coordinates);

          if (position) {
            view.dispatch(
              view.state.tr.setSelection(
                view.state.selection.constructor.near(
                  view.state.doc.resolve(position.pos),
                ),
              ),
            );
          }

          return true;
        }

        return false;
      },
    },

    /*
     * Save Tiptap JSON
     */
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    onTransaction: ({ transaction, editor }) => {
  if (!transaction.docChanged) {
    return;
  }

  const oldDoc = transaction.before;
  const newDoc = transaction.doc;

  oldDoc.descendants((node, pos) => {
    if (node.type.name !== "image") {
      return;
    }

    const publicId = node.attrs.publicId;

    if (!publicId) {
      return;
    }

    /*
     * Check whether this image still exists
     * in the new document.
     */
    let stillExists = false;

    newDoc.descendants((newNode) => {
      if (
        newNode.type.name === "image" &&
        newNode.attrs.publicId === publicId
      ) {
        stillExists = true;
      }
    });

    /*
     * Image existed before but doesn't exist now.
     */
    if (!stillExists) {
      api
        .delete("/uploads/image", {
          data: {
            publicId,
          },
        })
        .catch((error) => {
          console.error(
            "Failed to delete image from Cloudinary:",
            error,
          );
        });
    }
  });
},
  });

  /*
   * Update editor when content comes from backend
   */
  useEffect(() => {
    if (!editor || !content) {
      return;
    }

    const currentContent = editor.getJSON();

    if (
      JSON.stringify(currentContent) !==
      JSON.stringify(content)
    ) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  /*
   * ============================
   * LINK DIALOG
   * ============================
   */

  const openLinkDialog = () => {
    if (!editor) {
      return;
    }

    savedLinkPosition.current = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };

    setLinkDialogOpen(true);
  };

  const handleAddLink = (linkName, url) => {
    if (!editor || !savedLinkPosition.current) {
      return;
    }

    const { from, to } = savedLinkPosition.current;

    const text = linkName.trim();
    const href = url.trim();

    editor.commands.focus();

    editor.commands.insertContentAt(
      {
        from,
        to,
      },
      text,
    );

    editor
      .chain()
      .focus()
      .setTextSelection({
        from,
        to: from + text.length,
      })
      .setLink({
        href,
      })
      .run();

    editor.commands.setTextSelection(
      from + text.length,
    );

    setLinkDialogOpen(false);
    savedLinkPosition.current = null;
  };

  const handleCancelLink = () => {
    setLinkDialogOpen(false);
    savedLinkPosition.current = null;
  };

  /*
   * ============================
   * IMAGE
   * ============================
   */

  const handleImageClick = () => {
    if (isUploadingImage) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    /*
     * Allow selecting the same file again.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    /*
     * Validate file type.
     */
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    /*
     * 5 MB limit.
     */
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setIsUploadingImage(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await api.post(
        "/uploads/image",
        formData,
      );

      const imageUrl = response.data.image.url;
      const publicId =
        response.data.image.publicId;

      /*
       * Insert image at the current editor
       * cursor position.
       */
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: file.name,
          loading: "lazy",
          publicId,
        })
        .run();

    } catch (error) {
      console.error(
        "Image upload failed:",
        error,
      );

      alert(
        error.response?.data?.message ||
        "Failed to upload image.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  /*
   * ============================
   * REMOVE LINK
   * ============================
   */

  const removeLink = () => {
    editor
      .chain()
      .focus()
      .unsetLink()
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="notes-editor">

      {/* ================= TOOLBAR ================= */}

      <div className="notes-toolbar">

        {/* H1 */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          className={
            editor.isActive("heading", {
              level: 1,
            })
              ? "active"
              : ""
          }
        >
          H1
        </button>

        {/* H2 */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={
            editor.isActive("heading", {
              level: 2,
            })
              ? "active"
              : ""
          }
        >
          H2
        </button>

        {/* H3 */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
          className={
            editor.isActive("heading", {
              level: 3,
            })
              ? "active"
              : ""
          }
        >
          H3
        </button>

        <span className="toolbar-divider" />

        {/* BOLD */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={
            editor.isActive("bold")
              ? "active"
              : ""
          }
        >
          B
        </button>

        {/* ITALIC */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={
            editor.isActive("italic")
              ? "active"
              : ""
          }
        >
          I
        </button>

        <span className="toolbar-divider" />

        {/* BULLET LIST */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={
            editor.isActive("bulletList")
              ? "active"
              : ""
          }
        >
          •
        </button>

        {/* ORDERED LIST */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={
            editor.isActive("orderedList")
              ? "active"
              : ""
          }
        >
          1.
        </button>

        <span className="toolbar-divider" />

        {/* INLINE CODE */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={
            editor.isActive("code")
              ? "active"
              : ""
          }
        >
          `code`
        </button>

        {/* CODE BLOCK */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          className={
            editor.isActive("codeBlock")
              ? "active"
              : ""
          }
        >
          Code Block
        </button>

        <span className="toolbar-divider" />

        {/* IMAGE */}
        <button
          type="button"
          disabled={isUploadingImage}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={handleImageClick}
        >
          {isUploadingImage
            ? "Uploading..."
            : "Image"}
        </button>

        {/* LINK */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={openLinkDialog}
          className={
            editor.isActive("link")
              ? "active"
              : ""
          }
        >
          🔗
        </button>

        {/* UNLINK */}
        {editor.isActive("link") && (
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={removeLink}
          >
            Unlink
          </button>
        )}

        {/* BLOCKQUOTE */}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className={
            editor.isActive("blockquote")
              ? "active"
              : ""
          }
        >
          ❝
        </button>
      </div>

      {/* ================= IMAGE FILE INPUT ================= */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      {/* ================= EDITOR ================= */}

      <EditorContent editor={editor} />

      {/* ================= LINK DIALOG ================= */}

      <LinkDialog
        open={linkDialogOpen}
        onConfirm={handleAddLink}
        onCancel={handleCancelLink}
      />

    </div>
  );
};

export default NotesEditor;
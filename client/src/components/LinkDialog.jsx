import { useEffect, useState } from "react";

const LinkDialog = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const [linkName, setLinkName] = useState("");
  const [url, setUrl] = useState("");

  /*
   * Reset fields only when dialog opens.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setLinkName("");
    setUrl("");
  }, [open]);

  /*
   * Escape closes the dialog.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    const name = linkName.trim();
    const link = url.trim();

    if (!name || !link) {
      return;
    }

    onConfirm(name, link);
  };

  return (
    <div className="dialog-overlay">
      <div className="confirm-dialog link-dialog">

        <h3>Add Link</h3>

        {/* Link Name */}

        <div className="dialog-field">
          <label htmlFor="link-name">
            Link name
          </label>

          <input
            id="link-name"
            type="text"
            value={linkName}
            onChange={(event) => {
              setLinkName(event.target.value);
            }}
            placeholder="e.g. Binary Search"
            autoFocus
          />
        </div>

        {/* URL */}

        <div className="dialog-field">
          <label htmlFor="link-url">
            URL
          </label>

          <input
            id="link-url"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            placeholder="https://..."
          />
        </div>

        {/* Actions */}

        <div className="dialog-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={
              !linkName.trim() ||
              !url.trim()
            }
          >
            Add Link
          </button>

        </div>
      </div>
    </div>
  );
};

export default LinkDialog;

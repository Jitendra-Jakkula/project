const Toast = ({ message, type = "success", onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="toast-close"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
const Popup = ({ open, onClose, title, children, footer, wide }) => {
  // If popup is closed, show nothing
  if (!open) {
    return null;
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div
        className={wide ? "modal-card modal-wide" : "modal-card"}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Popup heading */}
        <div className="modal-head">
          <h3>{title}</h3>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Popup content */}
        <div className="modal-body">{children}</div>

        {/* Popup buttons */}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

export default Popup;

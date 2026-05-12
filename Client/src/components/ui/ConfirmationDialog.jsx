import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  isLoading = false,
  variant = "danger",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="400px">
      {description && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--ink-3)",
            marginBottom: "24px",
            fontWeight: 300,
            lineHeight: 1.6,
          }}>
          {description}
        </p>
      )}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

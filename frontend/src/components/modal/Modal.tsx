"use client";
import styles from "./modal.module.scss";
import { useModal } from "@/contexts/ModalContext";

export default function Modal() {
  const { isConfirmModal, message, title, isVisible, callback, hideModal } =
    useModal();
  if (!isVisible) return null;

  const handleConfirmClick = () => {
    if (callback) callback();
    hideModal();
  };
  const handleCancelClick = () => {
    if (!isConfirmModal && callback) callback();
    hideModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper}>
        {title && (
          <div className={styles.modalTitleWrapper}>
            <h3 className={styles.modalTitle}>{title}</h3>
          </div>
        )}
        <div className={styles.modalContentWrapper}>
          <p className={styles.modalContent}>{message}</p>
        </div>
        <div className={styles.modalButtonWrapper}>
          <button
            className={styles.modalCancelButton}
            onClick={handleCancelClick}
          >
            Close
          </button>
          {isConfirmModal && (
            <button
              className={styles.modalConfirmButton}
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

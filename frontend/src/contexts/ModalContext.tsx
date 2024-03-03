"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextType {
  isVisible: boolean;
  title: string | null;
  message: string | null;
  isConfirmModal: boolean;
  callback?: () => void;
  showModal: (
    title: string | null,
    message: string,
    isConfirmModal: boolean,
    callback?: () => void,
  ) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    title: string | null,
    message: string,
    isConfirmModal: boolean,
    callback?: () => void,
  ) => {
    setTitle(title);
    setMessage(message);
    setIsConfirmModal(isConfirmModal);
    setCallback(() => callback);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setTitle(null);
    setMessage(null);
    setIsConfirmModal(false);
    setCallback(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isVisible,
        title,
        message,
        isConfirmModal,
        callback,
        showModal,
        hideModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

import { useState, useCallback } from 'react';
import { IUseModalReturn } from '../interfaces/IModal';

export const useModal = (): IUseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsClosing(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    closeModal();
  }, [closeModal]);

  return {
    isOpen,
    isClosing,
    openModal,
    closeModal,
    handleClose,
  };
};

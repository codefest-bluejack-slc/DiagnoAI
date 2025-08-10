export interface IUseModalReturn {
  isOpen: boolean;
  isClosing: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleClose: () => void;
}

export interface IUseKeyboardNavigationReturn {
  handleKeyDown: (event: KeyboardEvent, filteredResults: any[], selectedIndex: number, setSelectedIndex: (index: number) => void, onSelectResult: () => void, onClose: () => void) => void;
}

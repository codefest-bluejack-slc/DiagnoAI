import { useCallback } from 'react';
import { IUseKeyboardNavigationReturn } from '../interfaces/IModal';

export const useKeyboardNavigation = (): IUseKeyboardNavigationReturn => {
  const handleKeyDown = useCallback(
    (
      event: KeyboardEvent,
      filteredResults: any[],
      selectedIndex: number,
      setSelectedIndex: (index: number) => void,
      onSelectResult: () => void,
      onClose: () => void,
    ) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((selectedIndex + 1) % filteredResults.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(
            (selectedIndex - 1 + filteredResults.length) %
              filteredResults.length,
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredResults[selectedIndex]) {
            onSelectResult();
          }
          break;
      }
    },
    [],
  );

  return {
    handleKeyDown,
  };
};

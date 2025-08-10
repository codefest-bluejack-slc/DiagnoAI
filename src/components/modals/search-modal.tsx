import React, { useEffect, useRef } from 'react';
import { Search, Command } from 'lucide-react';
import { useSearch } from '../../hooks/use-search';
import { useKeyboardNavigation } from '../../hooks/use-keyboard-navigation';
import { ISearchModalProps, ISearchResult } from '../../interfaces/ISearch';
import '../../styles/search-modal.css';

interface SearchModalComponentProps extends ISearchModalProps {
  isClosing: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose, onNavigateHome, isClosing }: SearchModalComponentProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    hoveredIndex,
    setHoveredIndex,
    handleSelectResult: selectResult,
    resetSearch
  } = useSearch({ onNavigateHome, onClose });

  const { handleKeyDown } = useKeyboardNavigation();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      resetSearch();
    }
  }, [isOpen, resetSearch]);

  useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      handleKeyDown(
        event,
        filteredResults,
        selectedIndex,
        setSelectedIndex,
        () => {
          if (filteredResults[selectedIndex]) {
            selectResult(filteredResults[selectedIndex]);
          }
        },
        onClose
      );
    };

    document.addEventListener('keydown', handleKeyDownEvent);
    return () => document.removeEventListener('keydown', handleKeyDownEvent);
  }, [isOpen, selectedIndex, filteredResults, handleKeyDown, selectResult, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
    setHoveredIndex(null);
  }, [searchQuery, setSelectedIndex, setHoveredIndex]);

  const handleSelectResult = (result: ISearchResult) => {
    selectResult(result);
    resetSearch();
  };

  const handleClose = () => {
    onClose();
    resetSearch();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`search-modal-backdrop fixed inset-0 flex items-center justify-center p-4 z-50 ${
        isClosing ? 'closing' : ''
      }`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`search-modal-content bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100/50 ${
          isClosing ? 'closing' : ''
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <Search className="text-gray-400 mr-3 flex-shrink-0" size={20} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-base text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none font-medium"
          />
          <div className="flex items-center gap-2 text-xs text-gray-400 ml-4">
            <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-mono shadow-sm">ESC</kbd>
            <span className="hidden sm:inline">to close</span>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="py-3">
              {filteredResults.map((result, index) => {
                const isActive = index === selectedIndex || hoveredIndex === index;
                return (
                  <div
                    key={result.id}
                    className={`mx-3 px-4 py-3 cursor-pointer flex items-center space-x-4 rounded-xl border transition-colors duration-150 ${
                      isActive
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className={`flex-shrink-0 p-2.5 rounded-xl transition-colors duration-150 ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate mb-1 ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {result.title}
                      </p>
                      <p className={`text-sm truncate ${
                        isActive ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {result.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 text-base font-semibold mb-2">
                {searchQuery ? 'No results found' : 'Start typing to search...'}
              </p>
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'Try a different search term' : 'Find anything quickly with our smart search'}
              </p>
            </div>
          )}
        </div>

        {filteredResults.length > 0 && (
          <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-mono shadow-sm">↑↓</kbd>
                <span className="font-medium">navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-mono shadow-sm">↵</kbd>
                <span className="font-medium">select</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Command size={14} />
              <span className="font-medium">DiagnoAI Search</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Command } from 'lucide-react';
import { useSearch } from '../../hooks/use-search';
import { useKeyboardNavigation } from '../../hooks/use-keyboard-navigation';
import { useTransition } from '../../hooks/use-transition';
import { ISearchModalProps, ISearchResult } from '../../interfaces/ISearch';

interface SearchModalComponentProps extends ISearchModalProps {
  isClosing: boolean;
  onClose: () => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  isClosing,
}: SearchModalComponentProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { isTransitioning } = useTransition();

  const {
    filteredResults,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    hoveredIndex,
    setHoveredIndex,
    handleSelectResult: selectResult,
    resetSearch,
  } = useSearch({ onClose });

  const { handleKeyDown } = useKeyboardNavigation();

  useEffect(() => {
    if (isTransitioning && isOpen) {
      onClose();
    }
  }, [isTransitioning, isOpen, onClose]);

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
        onClose,
      );
    };

    document.addEventListener('keydown', handleKeyDownEvent);
    return () => document.removeEventListener('keydown', handleKeyDownEvent);
  }, [
    isOpen,
    selectedIndex,
    filteredResults,
    handleKeyDown,
    selectResult,
    onClose,
  ]);

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

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleOverlayClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/80 to-indigo-950/80 backdrop-blur-md"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-pink-500/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-56 h-56 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`w-full max-w-2xl overflow-hidden bg-slate-900/95 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-2xl transform transition-all duration-300 ${
            isClosing
              ? 'scale-95 opacity-0 translate-y-2'
              : 'scale-100 opacity-100 translate-y-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center px-6 py-4 border-b border-purple-500/20 bg-slate-800/90 backdrop-blur-sm">
            <Search className="mr-3 flex-shrink-0 text-purple-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-medium text-sm text-purple-100 placeholder:text-purple-300"
            />
            <div className="flex items-center gap-2 ml-4 text-xs text-purple-300">
              <kbd className="px-2 py-1 rounded text-xs font-mono shadow-sm bg-slate-800/80 border border-purple-500/30 text-purple-200">
                ESC
              </kbd>
              <span className="hidden sm:inline">to close</span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredResults.length > 0 ? (
              <div className="py-3">
                {filteredResults.map((result, index) => {
                  const isActive =
                    index === selectedIndex || hoveredIndex === index;
                  return (
                    <div
                      key={result.id}
                      className={`mx-3 px-4 py-3 cursor-pointer flex items-center space-x-4 transition-all duration-150 rounded-lg border ${
                        isActive
                          ? 'bg-purple-500/30 border-purple-400/50 shadow-sm'
                          : 'border-transparent hover:bg-slate-800/60 hover:border-purple-500/30'
                      }`}
                      onClick={() => handleSelectResult(result)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div
                        className={`flex-shrink-0 p-2.5 rounded-lg transition-colors duration-150 ${
                          isActive
                            ? 'bg-purple-400/40 text-purple-200'
                            : 'bg-slate-800/70 text-purple-300'
                        }`}
                      >
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate mb-1 ${
                            isActive ? 'text-purple-200' : 'text-purple-100'
                          }`}
                        >
                          {result.title}
                        </p>
                        <p
                          className={`text-sm truncate ${
                            isActive ? 'text-purple-300' : 'text-purple-300/80'
                          }`}
                        >
                          {result.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto mb-4 text-purple-400" size={64} />
                <p className="text-base font-semibold mb-2 text-purple-200">
                  {searchQuery
                    ? 'No results found'
                    : 'Start typing to search...'}
                </p>
                <p className="text-sm text-purple-300">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Find anything quickly with our smart search'}
                </p>
              </div>
            )}
          </div>

          {filteredResults.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between text-xs bg-slate-800/90 backdrop-blur-sm border-t border-purple-500/20 text-purple-300">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded text-xs font-mono shadow-sm bg-slate-800/80 border border-purple-500/30 text-purple-200">
                    ↑↓
                  </kbd>
                  <span className="font-medium">navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded text-xs font-mono shadow-sm bg-slate-800/80 border border-purple-500/30 text-purple-200">
                    ↵
                  </kbd>
                  <span className="font-medium">select</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <Command size={14} />
                <span className="font-medium">DiagnoAI Search</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

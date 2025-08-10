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
        className={`search-modal-content w-full max-w-2xl overflow-hidden ${
          isClosing ? 'closing' : ''
        }`}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '0.5rem',
          border: '1px solid #475569',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <div 
          className="flex items-center px-6 py-4"
          style={{
            borderBottom: '1px solid #475569',
            backgroundColor: '#334155'
          }}
        >
          <Search className="mr-3 flex-shrink-0" size={20} style={{ color: '#94a3b8' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-medium search-modal-input"
            style={{
              fontSize: '0.875rem',
              color: '#f8fafc'
            }}
          />
          <div className="flex items-center gap-2 ml-4" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <kbd 
              className="px-2 py-1 rounded text-xs font-mono shadow-sm"
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                color: '#cbd5e1'
              }}
            >
              ESC
            </kbd>
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
                    className="mx-3 px-4 py-3 cursor-pointer flex items-center space-x-4 transition-colors duration-150"
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid transparent',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      borderColor: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#334155';
                        e.currentTarget.style.borderColor = '#475569';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <div 
                      className="flex-shrink-0 p-2.5 transition-colors duration-150"
                      style={{
                        borderRadius: '0.5rem',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : '#334155',
                        color: isActive ? '#3b82f6' : '#94a3b8'
                      }}
                    >
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm font-semibold truncate mb-1"
                        style={{
                          color: isActive ? '#3b82f6' : '#f8fafc'
                        }}
                      >
                        {result.title}
                      </p>
                      <p 
                        className="text-sm truncate"
                        style={{
                          color: isActive ? '#60a5fa' : '#cbd5e1'
                        }}
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
              <Search className="mx-auto mb-4" size={64} style={{ color: '#94a3b8' }} />
              <p className="text-base font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                {searchQuery ? 'No results found' : 'Start typing to search...'}
              </p>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                {searchQuery ? 'Try a different search term' : 'Find anything quickly with our smart search'}
              </p>
            </div>
          )}
        </div>

        {filteredResults.length > 0 && (
          <div 
            className="px-6 py-3 flex items-center justify-between text-xs"
            style={{
              backgroundColor: '#334155',
              borderTop: '1px solid #475569',
              color: '#94a3b8'
            }}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <kbd 
                  className="px-2 py-1 rounded text-xs font-mono shadow-sm"
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    color: '#cbd5e1'
                  }}
                >
                  ↑↓
                </kbd>
                <span className="font-medium">navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd 
                  className="px-2 py-1 rounded text-xs font-mono shadow-sm"
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    color: '#cbd5e1'
                  }}
                >
                  ↵
                </kbd>
                <span className="font-medium">select</span>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
              <Command size={14} />
              <span className="font-medium">DiagnoAI Search</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

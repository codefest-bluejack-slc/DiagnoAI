import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Activity, Store, Settings, LogIn } from 'lucide-react';
import diagnoaiLogo from '../../assets/diagnoai_logo.png';
import Tooltip from './tooltip';
import SearchModal from '../modals/search-modal';
import { useModal } from '../../hooks/use-modal';

interface NavbarProps {
  onNavigateHome: () => void;
}

export default function Navbar({ onNavigateHome }: NavbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isSearchModalOpen,
    isClosing,
    openModal: openSearchModal,
    handleClose: closeSearchModal,
  } = useModal();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        openSearchModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openSearchModal]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchClick = () => {
    openSearchModal();
  };

  const handleCloseSearchModal = () => {
    closeSearchModal();
    setIsSearchFocused(false);
  };

  const handleDiagnosticsClick = () => {
    console.log('Diagnostics clicked');
  };

  const handleMarketplaceClick = () => {
    console.log('Marketplace clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto h-16">
        <div className="flex items-center">
          <Tooltip content="DiagnoAI" position="bottom">
            <div className="flex items-center cursor-pointer">
              <img
                src={diagnoaiLogo}
                alt="DiagnoAI Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Tooltip>
        </div>

        <div className="flex-1 flex justify-center px-8">
          <div
            className={`relative flex items-center w-full max-w-2xl bg-white/10 border border-white/20 rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm ${
              isSearchFocused
                ? 'bg-white/20 border-purple-300/50 ring-2 ring-purple-400/30'
                : 'hover:bg-white/15 hover:border-white/30'
            }`}
            onClick={handleSearchClick}
          >
            <Search
              className="absolute left-3 text-purple-200 pointer-events-none"
              size={16}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search... (Ctrl+K)"
              className="w-full py-2 pl-10 pr-4 bg-transparent border-none outline-none text-white text-sm font-medium cursor-pointer placeholder:text-purple-200"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onClick={handleSearchClick}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="Home" position="bottom">
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-lg text-purple-200 bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <Home size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Diagnostics" position="bottom">
            <button
              onClick={handleDiagnosticsClick}
              className="p-2 rounded-lg text-purple-200 bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <Activity size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Marketplace" position="bottom">
            <button
              onClick={handleMarketplaceClick}
              className="p-2 rounded-lg text-purple-200 bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <Store size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Settings" position="bottom">
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-lg text-purple-200 bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <Settings size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Login" position="bottom">
            <button
              onClick={handleLoginClick}
              className="p-2 rounded-lg text-purple-200 bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            >
              <LogIn size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onNavigateHome={onNavigateHome}
        isClosing={isClosing}
      />
    </nav>
  );
}

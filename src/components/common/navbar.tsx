import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Activity, Store, Settings, LogIn } from 'lucide-react';
import diagnoaiLogo from '../../assets/diagnoai_logo.png';
import Tooltip from './tooltip';
import SearchModal from '../modals/search-modal';
import { useModal } from '../../hooks/use-modal';
import { useTransition } from '../../hooks/use-transition';

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const { navigateTo } = useTransition();
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

  const handleHomeClick = () => {
    navigateTo('/');
  };

  const handleDiagnosticsClick = () => {
    navigateTo('/diagnostic');
  };

  const handleMarketplaceClick = () => {
    navigateTo('/marketplace');
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
            <div className="flex items-center cursor-pointer group" onClick={handleHomeClick}>
              <div className="logo-container relative p-2 transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-purple-200/10 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                <img
                  src={diagnoaiLogo}
                  alt="DiagnoAI Logo"
                  className="logo-image relative h-8 w-auto object-contain filter brightness-125 contrast-125 drop-shadow-lg group-hover:brightness-150 group-hover:drop-shadow-2xl transition-all duration-300"
                />
              </div>
              <span className="logo-text ml-3 text-white font-bold text-xl tracking-tight bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-purple-200 transition-all duration-300 hidden sm:block drop-shadow-sm">
                DiagnoAI
              </span>
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
              onClick={handleHomeClick}
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
        isClosing={isClosing}
      />
    </nav>
  );
}

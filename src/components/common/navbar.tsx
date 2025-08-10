import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Activity, Store } from 'lucide-react';
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
  
  const { isOpen: isSearchModalOpen, isClosing, openModal: openSearchModal, handleClose: closeSearchModal } = useModal();

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Tooltip content="DiagnoAI" position="bottom">
            <div className="navbar-logo">
              <img src={diagnoaiLogo} alt="DiagnoAI Logo" className="logo-image" />
            </div>
          </Tooltip>
        </div>

        <div className="navbar-center">
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`} onClick={handleSearchClick}>
            <Search className="search-icon" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search... (Ctrl+K)"
              className="search-input"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onClick={handleSearchClick}
              readOnly
            />
          </div>
        </div>

        <div className="navbar-right">
          <Tooltip content="Home" position="bottom">
            <button onClick={onNavigateHome} className="nav-icon-button">
              <Home size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Diagnostics" position="bottom">
            <button onClick={handleDiagnosticsClick} className="nav-icon-button">
              <Activity size={20} />
            </button>
          </Tooltip>

          <Tooltip content="Marketplace" position="bottom">
            <button onClick={handleMarketplaceClick} className="nav-icon-button">
              <Store size={20} />
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

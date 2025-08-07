import { useState } from 'react';
import './App.css';
import LandingPage from './pages/landing-page';
import HomePage from './pages/home-page';
import DiagonalTransition from './components/animations/diagonal-transition';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'home'>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPage, setNextPage] = useState<'landing' | 'home'>('landing');

  const handleNavigation = (page: 'landing' | 'home') => {
    if (page !== currentPage && !isTransitioning) {
      setNextPage(page);
      setIsTransitioning(true);
    }
  };

  const handleTransitionComplete = () => {
    setCurrentPage(nextPage);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="App">
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigation} />}
      {currentPage === 'home' && <HomePage onNavigate={handleNavigation} />}
      <DiagonalTransition 
        isTransitioning={isTransitioning} 
        onTransitionComplete={handleTransitionComplete}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}

export default App;

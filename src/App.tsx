import { useState } from 'react';
import './App.css';
import LandingPage from './pages/landing-page';
import HomePage from './pages/home-page';
import { TransitionProvider } from './components/animations/diagonal-transition';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'home'>('landing');

  const handlePageChange = (page: string) => {
    setCurrentPage(page as 'landing' | 'home');
  };

  return (
    <TransitionProvider currentPage={currentPage} onPageChange={handlePageChange}>
      <div className="App">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'home' && <HomePage />}
      </div>
    </TransitionProvider>
  );
}

export default App;

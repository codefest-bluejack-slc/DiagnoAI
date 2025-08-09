import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/landing-page';
import HomePage from './pages/home-page';
import { TransitionProvider } from './components/animations/diagonal-transition';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<'landing' | 'home'>(() => {
    return location.pathname === '/home' ? 'home' : 'landing';
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    const newPage = location.pathname === '/home' ? 'home' : 'landing';
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [location.pathname, currentPage, isInitialized]);

  const handlePageChange = (page: string) => {
    const path = page === 'home' ? '/home' : '/';
    navigate(path);
  };

  const getCurrentPageComponent = () => {
    if (currentPage === 'home') {
      return <HomePage />;
    }
    return <LandingPage />;
  };

  return (
    <TransitionProvider currentPage={currentPage} onPageChange={handlePageChange}>
      <div className="App">
        {getCurrentPageComponent()}
      </div>
    </TransitionProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

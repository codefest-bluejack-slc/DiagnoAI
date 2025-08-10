import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home-page';
import { TransitionProvider } from './components/animations/diagonal-transition';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home'>('home');

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
    }
  };

  return (
    <TransitionProvider
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      <div className="App bg-dark-bg text-dark-text-primary">
        <HomePage />
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

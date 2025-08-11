import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/home-page';
import DiagnosticPage from './pages/diagnostic-page';
import MarketPage from './pages/market-page';
import { TransitionProvider } from './components/animations/diagonal-transition';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(location.pathname);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case '/':
        return <HomePage />;
      case '/diagnostic':
        return <DiagnosticPage />;
      case '/marketplace':
        return <MarketPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <TransitionProvider
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      <div className="App bg-dark-bg text-dark-text-primary">
        {renderCurrentPage()}
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

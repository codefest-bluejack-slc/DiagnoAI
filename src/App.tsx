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
import ProductPage from './pages/product-page';
import { TransitionProvider } from './components/animations/diagonal-transition';
import { ServiceProvider } from './contexts/service-context';
import { AuthProvider } from './contexts/auth-context';
import { ToastProvider } from './contexts/toast-context';
import ProfilePage from './pages/profile-page';

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

  return (
    <TransitionProvider
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      <ServiceProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="App bg-dark-bg text-dark-text-primary">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/diagnostic" element={<DiagnosticPage />} />
                <Route path="/marketplace" element={<MarketPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </ServiceProvider>
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

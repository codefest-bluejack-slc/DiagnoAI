import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home-page';
import DiagnosticPage from './pages/diagnostic-page';
import MarketPage from './pages/market-page';

function App() {
  return (
    <Router>
      <div className="App bg-dark-bg text-dark-text-primary">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/marketplace" element={<MarketPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

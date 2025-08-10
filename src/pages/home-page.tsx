import { useTransition } from '../hooks/use-transition';
import Navbar from '../components/common/navbar';
import '../styles/navbar.css';

export default function HomePage() {
  const { navigateTo, isTransitioning } = useTransition();

  const handleNavigateToLanding = () => {
    if (!isTransitioning) {
      navigateTo('landing');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar onNavigateHome={handleNavigateToLanding} />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-dark-text-primary mb-8 text-center">Welcome to DiagnoAI</h1>
        </div>
      </div>
    </div>
  );
}

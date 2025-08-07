import { useTransition } from '../hooks/useTransition';
import WelcomeSections from '../components/sections/welcome-sections';
import '../styles/welcome-sections.css';

export default function LandingPage() {
  const { navigateTo, isTransitioning } = useTransition();

  const handleNavigateToHome = () => {
    if (!isTransitioning) {
      navigateTo('home');
    }
  };

  return (
    <WelcomeSections onNavigate={handleNavigateToHome} />
  );
}

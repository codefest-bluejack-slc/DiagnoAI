import { useTransition } from '../hooks/use-transition';
import WelcomeSections from '../components/sections/welcome-sections';
import Navbar from '../components/common/navbar';
import '../styles/welcome-sections.css';
import '../styles/navbar.css';

export default function LandingPage() {
  const { navigateTo, isTransitioning } = useTransition();

  const handleNavigateToHome = () => {
    if (!isTransitioning) {
      navigateTo('home');
    }
  };

  return (
    <>
      <Navbar onNavigateHome={handleNavigateToHome} />
      <WelcomeSections onNavigate={handleNavigateToHome} />
    </>
  );
}

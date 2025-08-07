import { useTransition } from '../hooks/useTransition';

export default function LandingPage() {
  const { navigateTo, isTransitioning } = useTransition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">DiagnoAI</div>
        <button 
          onClick={() => navigateTo('home')}
          disabled={isTransitioning}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isTransitioning 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Go to Home
        </button>
      </nav>
    </div>
  );
}

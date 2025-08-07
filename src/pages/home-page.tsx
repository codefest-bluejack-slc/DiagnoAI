import { useTransition } from '../hooks/useTransition';

export default function HomePage() {
  const { navigateTo, isTransitioning } = useTransition();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-6">
        <div className="flex justify-between items-center">
          <div className="text-blue-600 text-2xl font-bold">DiagnoAI</div>
          <button 
            onClick={() => navigateTo('landing')}
            disabled={isTransitioning}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isTransitioning 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Go to Landing
          </button>
        </div>
      </nav>
    </div>
  );
}

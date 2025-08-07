interface LandingPageProps {
  onNavigate: (page: 'landing' | 'home') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <nav className="flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">DiagnoAI</div>
        <button 
          onClick={() => onNavigate('home')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Homea
        </button>
      </nav>
    </div>
  );
}

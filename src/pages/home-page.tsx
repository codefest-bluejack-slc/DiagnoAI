interface HomePageProps {
  onNavigate: (page: 'landing' | 'home') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-6">
        <div className="flex justify-between items-center">
          <div className="text-blue-600 text-2xl font-bold">DiagnoAI</div>
          <button 
            onClick={() => onNavigate('landing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Landing
          </button>
        </div>
      </nav>
    </div>
  );
}

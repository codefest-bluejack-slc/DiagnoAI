import { useTransition } from '../hooks/useTransition';
import Tooltip from '../components/common/tooltip';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigateHome={handleNavigateToLanding} />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Welcome to DiagnoAI</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Tooltip content="AI-powered diagnostic analysis using machine learning algorithms" position="top">
                <h3 className="text-xl font-semibold text-blue-600 mb-4 cursor-help">Smart Analysis</h3>
              </Tooltip>
              <p className="text-gray-600">Advanced AI algorithms provide accurate diagnostic insights with high precision and reliability.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Tooltip content="Get results in real-time with our optimized processing pipeline">
                <h3 className="text-xl font-semibold text-green-600 mb-4 cursor-help">Real-time Results</h3>
              </Tooltip>
              <p className="text-gray-600">Receive instant diagnostic feedback and recommendations powered by cutting-edge technology.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Tooltip content="Enterprise-grade security protecting your sensitive medical data" position="left">
                <h3 className="text-xl font-semibold text-purple-600 mb-4 cursor-help">Secure & Private</h3>
              </Tooltip>
              <p className="text-gray-600">Your data is protected with industry-standard encryption and privacy protocols.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Interactive Demo</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              
              <Tooltip content="Hover tooltip with default settings">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Hover Me
                </button>
              </Tooltip>

              <Tooltip content="Click me to toggle this tooltip!" trigger="click" position="top">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                  Click Me
                </button>
              </Tooltip>

              <Tooltip 
                content="This tooltip appears when you focus on this button using keyboard navigation"
                trigger="focus"
                position="bottom"
              >
                <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                  Focus Me
                </button>
              </Tooltip>

              <Tooltip 
                content={
                  <div>
                    <div className="font-semibold mb-1">Rich Content Tooltip</div>
                    <div className="text-sm">This tooltip can contain multiple elements, links, and formatting.</div>
                  </div>
                }
                maxWidth={300}
                position="right"
              >
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  Rich Content
                </button>
              </Tooltip>

              <Tooltip content="This tooltip has no arrow" arrow={false} position="top">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                  No Arrow
                </button>
              </Tooltip>

              <Tooltip content="Auto-positioning tooltip that finds the best position" position="auto">
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors">
                  Auto Position
                </button>
              </Tooltip>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

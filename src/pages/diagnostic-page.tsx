import React, { useState, useEffect } from 'react';
import { Plus, X, Activity, AlertCircle, Heart, Brain, Thermometer } from 'lucide-react';
import Navbar from '../components/common/navbar';

interface Symptom {
  id: string;
  description: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

interface DiagnosticPageProps {}

export default function DiagnosticPage({}: DiagnosticPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptomDescription, setNewSymptomDescription] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const addSymptom = () => {
    if (newSymptomDescription.trim()) {
      const symptom: Symptom = {
        id: Date.now().toString(),
        description: newSymptomDescription.trim()
      };
      
      setSymptoms(prev => [...prev, symptom]);
      setNewSymptomDescription('');
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(symptom => symptom.id !== id));
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'severe': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'mild': return <Heart size={16} />;
      case 'moderate': return <AlertCircle size={16} />;
      case 'severe': return <Thermometer size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950" style={{ fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif" }}>
      
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>
      
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4) 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Brain className="text-purple-300" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Symptom Assessment
              </h1>
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Please describe your current symptoms to help us provide accurate diagnostic insights.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Plus className="text-purple-300" size={24} />
                Add Symptom
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Symptom Description
                  </label>
                  <textarea
                    value={newSymptomDescription}
                    onChange={(e) => setNewSymptomDescription(e.target.value)}
                    placeholder="Describe what you're feeling..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        addSymptom();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={addSymptom}
                  disabled={!newSymptomDescription.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                  <Plus size={20} />
                  Add Symptom
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="text-purple-300" size={24} />
                Current Symptoms ({symptoms.length})
              </h2>

              {symptoms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-white/5 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="text-purple-300" size={24} />
                  </div>
                  <p className="text-purple-200">No symptoms added yet</p>
                  <p className="text-purple-300 text-sm mt-1">Add your first symptom to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-2">{symptom.description}</p>
                          {(symptom.severity || symptom.duration) && (
                            <div className="flex items-center gap-3 text-sm">
                              {symptom.severity && (
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${getSeverityColor(symptom.severity)}`}>
                                  {getSeverityIcon(symptom.severity)}
                                  {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                                </span>
                              )}
                              {symptom.duration && (
                                <span className="text-purple-200">
                                  Duration: {symptom.duration}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeSymptom(symptom.id)}
                          className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400/50"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {symptoms.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
                    <Brain size={20} />
                    Get Diagnosis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
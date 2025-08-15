import React, { useState } from 'react';
import {
  Plus,
  X,
  Activity,
  Brain,
  Edit3,
  Clock,
  Search,
  Lightbulb,
  Target,
  Stethoscope,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/common/navbar';
import { IDiagnosticPageProps } from '../interfaces/IDiagnostic';
import { useDiagnostic } from '../hooks/use-diagnostic';
import { useMouseTracking } from '../hooks/use-mouse-tracking';
import {
  getSeverityColor,
  getStepIcon,
  getSeverityIcon,
} from '../utils/diagnostic-utils';
import '../styles/diagnostic-page.css';

export default function DiagnosticPage({}: IDiagnosticPageProps) {
  const mousePosition = useMouseTracking();
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      size: 0.2 + Math.random() * 0.3,
    })),
  );
  const {
    symptoms,
    newSymptomDescription,
    setNewSymptomDescription,
    showAddForm,
    setShowAddForm,
    currentStep,
    setCurrentStep,
    addSymptom,
    removeSymptom,
    getProgressPercentage,
  } = useDiagnostic();

  return (
    <div className="diagnostic-container">
      <div className="background-orbs">
        <div className="background-orb-1"></div>
        <div className="background-orb-2"></div>
        <div className="background-orb-3"></div>
      </div>

      <div
        className="mouse-glow"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary-purple-200) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}rem`,
              height: `${particle.size}rem`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main className="main-content">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Brain className="text-purple-300" size={32} />
              </div>
              <h1 className="text-4xl font-bold text-white">
                AI Diagnostic Assistant
              </h1>
            </div>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Describe your symptoms and get intelligent health insights
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="progress-card">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg
                        className="w-24 h-24 transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="var(--primary-purple-300)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${getProgressPercentage() * 2.51} 251`}
                          className="transition-all duration-500"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="var(--primary-purple)"
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--tertiary-indigo)"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {symptoms.length}
                        </span>
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm font-medium">
                      Symptoms Recorded
                    </p>
                    <p className="text-purple-300 text-xs mt-1">
                      Up to 8 recommended
                    </p>
                  </div>
                </div>

                <div className="step-card">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Activity className="text-purple-300" size={20} />
                    Analysis Steps
                  </h3>
                  <div className="space-y-3">
                    {['input', 'review', 'analysis'].map((step, index) => (
                      <div
                        key={step}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          currentStep === step
                            ? 'step-item-active'
                            : 'step-item-inactive'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            currentStep === step
                              ? 'bg-purple-500/30'
                              : 'bg-white/10'
                          }`}
                        >
                          {getStepIcon(step)}
                        </div>
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              currentStep === step
                                ? 'text-white'
                                : 'text-purple-200'
                            }`}
                          >
                            {step === 'input'
                              ? 'Input Symptoms'
                              : step === 'review'
                                ? 'Review & Confirm'
                                : 'AI Analysis'}
                          </p>
                          <p className="text-purple-300 text-xs">
                            {step === 'input'
                              ? 'Describe your symptoms'
                              : step === 'review'
                                ? 'Verify information'
                                : 'Get insights'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <div className="space-y-6">
                {!showAddForm && (
                  <div
                    className="add-symptom-card group animate-in fade-in slide-in-from-bottom-4 duration-700"
                    onClick={() => setShowAddForm(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Plus
                          className="text-purple-300 group-hover:rotate-90 transition-transform duration-300"
                          size={32}
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                        Add New Symptom
                      </h3>
                      <p className="text-purple-200 mb-6">
                        Click here to describe what you're experiencing
                      </p>
                      <div className="inline-flex items-center gap-2 text-purple-300 text-sm">
                        <span>Start your health assessment</span>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                {showAddForm && (
                  <div className="symptom-form-card animate-in slide-in-from-top-5 fade-in duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-full animate-in zoom-in duration-300 delay-150">
                          <Plus className="text-purple-300" size={24} />
                        </div>
                        <span className="animate-in slide-in-from-left-3 duration-300 delay-200">
                          Describe Your Symptom
                        </span>
                      </h3>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                      >
                        <X className="text-purple-300" size={20} />
                      </button>
                    </div>

                    <div className="space-y-4 animate-in slide-in-from-bottom-3 duration-400 delay-300">
                      <div>
                        <label className="block text-purple-200 text-sm font-medium mb-3">
                          What are you experiencing?
                        </label>
                        <textarea
                          value={newSymptomDescription}
                          onChange={(e) =>
                            setNewSymptomDescription(e.target.value)
                          }
                          placeholder="Describe your symptom in detail... e.g., 'Sharp pain in lower back when standing'"
                          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm resize-none text-lg leading-relaxed transition-all duration-300 focus:scale-[1.01]"
                          rows={4}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              addSymptom();
                            }
                          }}
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={addSymptom}
                          disabled={!newSymptomDescription.trim()}
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-lg hover:shadow-purple-500/25 disabled:hover:scale-100"
                        >
                          <Plus
                            size={20}
                            className="transition-transform duration-300 group-hover:rotate-90"
                          />
                          <span>Add Symptom</span>
                        </button>
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="py-4 px-6 bg-white/10 hover:bg-white/20 text-purple-200 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {symptoms.length > 0 && (
                  <div className="symptoms-list-card animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <Activity className="text-purple-300" size={24} />
                        Your Symptoms ({symptoms.length})
                      </h3>
                      {!showAddForm && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                        >
                          <Plus
                            className="text-purple-300 hover:rotate-90 transition-transform duration-300"
                            size={18}
                          />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                      {symptoms.map((symptom, index) => (
                        <div
                          key={symptom.id}
                          className="p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 rounded-xl transition-all duration-300 group animate-in fade-in duration-500"
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-purple-300 text-xs font-medium">
                                  Symptom #{index + 1}
                                </span>
                              </div>
                              <p className="text-white font-medium leading-relaxed">
                                {symptom.description}
                              </p>
                              {(symptom.severity || Number(symptom.duration)) && (
                                <div
                                  className="flex items-center gap-3 text-sm mt-3 animate-in fade-in duration-300"
                                  style={{
                                    animationDelay: `${index * 150 + 300}ms`,
                                  }}
                                >
                                  {symptom.severity && (
                                    <span
                                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-300 hover:scale-105 ${getSeverityColor(symptom.severity)}`}
                                    >
                                      {getSeverityIcon(symptom.severity)}
                                      {symptom.severity
                                        .charAt(0)
                                        .toUpperCase() +
                                        symptom.severity.slice(1)}
                                    </span>
                                  )}
                                  {Number(symptom.duration) && (
                                    <span className="text-purple-200 text-xs">
                                      Duration: {symptom.duration.toString()}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeSymptom(symptom.id)}
                              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400/50 hover:scale-110 hover:rotate-90"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {symptoms.length >= 3 && (
                      <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                        <button
                          onClick={() => setCurrentStep('analysis')}
                          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400/50 shadow-lg hover:shadow-indigo-500/25 group"
                        >
                          <Brain
                            size={24}
                            className="group-hover:animate-pulse"
                          />
                          <span>Start AI Analysis</span>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="tips-card">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Target className="text-purple-300" size={20} />
                    Quick Tips
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        icon: Edit3,
                        tip: 'Be specific about location and intensity',
                      },
                      { icon: Clock, tip: 'Include duration and frequency' },
                      { icon: Search, tip: 'Mention triggers or patterns' },
                      {
                        icon: Lightbulb,
                        tip: 'Add at least 3 symptoms for better analysis',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="p-1 bg-purple-500/20 rounded">
                          <item.icon size={16} className="text-purple-300" />
                        </div>
                        <p className="text-purple-200 text-sm leading-relaxed">
                          {item.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {symptoms.length > 0 && symptoms.length < 3 && (
                  <div className="warning-card">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-amber-500/30 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-amber-300" size={24} />
                      </div>
                      <p className="text-amber-200 text-sm font-medium mb-2">
                        Add {3 - symptoms.length} more symptom
                        {3 - symptoms.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-amber-300 text-xs">
                        For more accurate analysis
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

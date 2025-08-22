import React, { useState, useEffect } from 'react';
import { Brain, Maximize2, X, Loader2 } from 'lucide-react';
import { ISymptom } from '../../interfaces/IDiagnostic';
import { DiagnosisService } from '../../services/diagnosis.service';

interface AnalyzeSymptomsProps {
  symptoms: ISymptom[];
  description: string;
  since: string;
  onAnalysisComplete: (result: string, fullResponse?: any) => void;
}

export const AnalyzeSymptoms: React.FC<AnalyzeSymptomsProps> = ({
  symptoms,
  description,
  since,
  onAnalysisComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [analysisText, setAnalysisText] = useState('');
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const USE_TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

  const renderRichText = (text: string, isAnimating: boolean = false) => {
    const colors = {
      header: 'text-white border-b border-purple-500/30',
      subheader: 'text-purple-100',
      bullet: 'text-purple-400',
      numbered: 'text-purple-100',
      emphasis: 'text-purple-100 font-medium',
      text: 'text-purple-200'
    };

    return text.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <div key={`empty-${index}`} className="h-3" />;
      }

      if (line.startsWith('**') && line.endsWith('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h4 
            key={`section-${index}`} 
            className={`font-bold mt-4 mb-2 text-base pb-1 ${colors.header}`}
          >
            {cleanLine}
          </h4>
        );
      }

      if (line.startsWith('###')) {
        const cleanLine = line.replace(/###/g, '').trim();
        return (
          <h5 
            key={`subsection-${index}`} 
            className={`font-semibold mt-3 mb-1 text-sm ${colors.subheader}`}
          >
            {cleanLine}
          </h5>
        );
      }

      if (line.startsWith('• ') || line.startsWith('- ')) {
        const bulletText = line.substring(2);
        return (
          <div 
            key={`bullet-${index}`} 
            className="flex items-start gap-3 my-2 ml-2"
          >
            <span className={`flex-shrink-0 mt-1 ${colors.bullet}`}>•</span>
            <span className={`flex-1 ${colors.text}`}>{bulletText}</span>
          </div>
        );
      }

      if (line.match(/^\d+\./)) {
        const parts = line.split(': ');
        return (
          <div 
            key={`numbered-${index}`} 
            className="my-2 ml-2"
          >
            <span className={`font-semibold ${colors.numbered}`}>{parts[0]}:</span>
            <span className={`ml-2 ${colors.text}`}>{parts.slice(1).join(': ')}</span>
          </div>
        );
      }

      if (line.includes('*') && !line.startsWith('**')) {
        const formattedLine = line.replace(/\*(.*?)\*/g, `<em class="${colors.emphasis}">$1</em>`);
        return (
          <div 
            key={`text-${index}`} 
            className={`my-2 leading-relaxed ${colors.text}`} 
            dangerouslySetInnerHTML={{ __html: formattedLine }} 
          />
        );
      }

      return (
        <div 
          key={`text-${index}`} 
          className={`my-2 leading-relaxed ${colors.text}`}
        >
          {line}
        </div>
      );
    });
  };

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      setIsRetrying(false);
      
      try {
        const diagnosisRequest = {
          description: description.trim(),
          symptoms: symptoms.map(symptom => ({
            name: symptom.name,
            severity: symptom.severity
          })),
          since: since
        };

        const diagnosisResponse = await DiagnosisService.getStructuredDiagnosis(diagnosisRequest);
        
        setFullResponse(diagnosisResponse);
        
        if (diagnosisResponse.diagnosis) {
          setAnalysisText(diagnosisResponse.diagnosis);
        } else {
          setAnalysisText('Analysis complete. Please consult with a healthcare professional for detailed medical advice.');
        }
        
        setRetryCount(0);
      } catch (error) {
        console.error('Analysis error:', error);
        
        if (retryCount < 2) {
          setIsRetrying(true);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            setIsRetrying(false);
          }, 2000);
          return;
        }
        
        setAnalysisText('Our AI analysis is currently processing your symptoms. Please wait a moment while we generate your health insights. If this takes longer than expected, our system is working to provide you the most accurate analysis possible.');
        setRetryCount(0);
      } finally {
        if (!isRetrying) {
          setIsLoading(false);
        }
      }
    };

    if (isRetrying) {
      const retryTimer = setTimeout(performAnalysis, 2000);
      return () => clearTimeout(retryTimer);
    } else {
      performAnalysis();
    }
  }, [symptoms, description, since, isRetrying, retryCount]);

  useEffect(() => {
    if (!isLoading && !isRetrying && analysisText && !animationComplete) {
      const words = analysisText.split(' ');
      
      if (currentWordIndex < words.length) {
        const timer = setTimeout(() => {
          const currentText = words.slice(0, currentWordIndex + 1).join(' ');
          setDisplayedText(currentText);
          setCurrentWordIndex(currentWordIndex + 1);
        }, USE_TEST_MODE ? 25 : 45);
        return () => clearTimeout(timer);
      } else {
        setAnimationComplete(true);
        setTimeout(() => {
          onAnalysisComplete(analysisText, fullResponse);
        }, 1000);
      }
    }
  }, [currentWordIndex, analysisText, isLoading, isRetrying, onAnalysisComplete, USE_TEST_MODE, fullResponse, animationComplete]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-none">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 w-full">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 w-full">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-full flex-shrink-0">
                <Brain className="text-blue-300" size={20} />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h3 className="text-white font-semibold text-lg">
                    AI Analysis in Progress
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {USE_TEST_MODE && (
                      <span className="px-2 py-1 text-xs bg-orange-500/20 border border-orange-400/40 rounded-full text-orange-300">
                        TEST MODE
                      </span>
                    )}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                      title="Expand to full view"
                    >
                      <Maximize2 className="text-purple-300 group-hover:text-purple-200" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 w-full">
                  <div className="bg-slate-800/40 rounded-lg p-4 w-full">
                    {isLoading || isRetrying ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                          <Loader2 className="animate-spin text-purple-400" size={24} />
                          <div className="flex flex-col items-start">
                            <span className="text-purple-200 text-sm">
                              {isRetrying ? `Retrying analysis (attempt ${retryCount + 1}/3)...` : 'Analyzing your symptoms...'}
                            </span>
                            {isRetrying && (
                              <span className="text-purple-300 text-xs mt-1">
                                Our AI is working to provide the best analysis
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-purple-200 text-sm leading-relaxed max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-700/20 w-full">
                        <div className="space-y-3 break-words w-full">
                          {animationComplete ? 
                            renderRichText(analysisText) : 
                            renderRichText(displayedText)
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-purple-400/30 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
              <div className="flex items-center gap-3">
                <Brain className="text-purple-300" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-white">AI Analysis Results</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-purple-300 text-sm">Complete diagnostic analysis</p>
                    {USE_TEST_MODE && (
                      <span className="px-2 py-1 text-xs bg-orange-500/20 border border-orange-400/40 rounded-full text-orange-300">
                        TEST MODE
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Close modal"
              >
                <X className="text-purple-300" size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {isLoading || isRetrying ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin text-purple-400" size={32} />
                    <div className="flex flex-col items-start">
                      <span className="text-purple-200">
                        {isRetrying ? `Retrying analysis (attempt ${retryCount + 1}/3)...` : 'Analyzing your symptoms...'}
                      </span>
                      {isRetrying && (
                        <span className="text-purple-300 text-sm mt-1">
                          Our AI is working to provide the best analysis
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/40 rounded-lg p-4">
                  <div className="text-purple-200 text-sm leading-relaxed">
                    <div className="space-y-3 break-words">
                      {renderRichText(analysisText)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnalyzeSymptoms;

import React, { useState, useEffect } from 'react';
import { Brain, Maximize2, X } from 'lucide-react';
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
  const [displayedElements, setDisplayedElements] = useState<JSX.Element[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [analysisText, setAnalysisText] = useState('');
  const [fullResponse, setFullResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const USE_TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      
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
          setAnalysisText('Analysis complete. Unable to generate detailed diagnosis at this time.');
        }
      } catch (error) {
        console.error('Analysis error:', error);
        setAnalysisText('Analysis encountered an error. Please try again or consult a healthcare provider.');
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [symptoms, description, since]);

  useEffect(() => {
    if (!isLoading && analysisText) {
      const formattedElements = formatTextWithAnimation(analysisText);
      const words = analysisText.split(' ');
      
      if (currentWordIndex < words.length) {
        const timer = setTimeout(() => {
          const currentText = words.slice(0, currentWordIndex + 1).join(' ');
          setDisplayedText(currentText);
          
          const currentFormattedElements = formatTextAsElements(currentText);
          setDisplayedElements(currentFormattedElements);
          
          setCurrentWordIndex(currentWordIndex + 1);
        }, USE_TEST_MODE ? 25 : 45);
        return () => clearTimeout(timer);
      } else {
        setDisplayedElements(formattedElements);
        setTimeout(() => {
          onAnalysisComplete(analysisText, fullResponse);
        }, 1000);
      }
    }
  }, [currentWordIndex, analysisText, isLoading, onAnalysisComplete, USE_TEST_MODE, fullResponse]);

  const formatTextAsElements = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, lineIndex) => {
      if (line.trim() === '') {
        elements.push(<div key={`empty-${lineIndex}`} className="h-2" />);
        return;
      }
      
      if (line.includes('**') && !line.includes('Primary Assessment') && !line.includes('Key Observations') && !line.includes('Recommended Actions') && !line.includes('Important Note')) {
        const cleanLine = line.replace(/\*\*/g, '');
        elements.push(
          <h4 key={`header-${lineIndex}`} className="font-bold text-white mt-4 mb-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 50}ms`, animationFillMode: 'forwards'}}>
            {cleanLine}
          </h4>
        );
        return;
      }
      
      if (line.startsWith('**') && line.endsWith('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        elements.push(
          <h4 key={`section-${lineIndex}`} className="font-bold text-white mt-4 mb-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 50}ms`, animationFillMode: 'forwards'}}>
            {cleanLine}
          </h4>
        );
        return;
      }
      
      if (line.startsWith('• ')) {
        elements.push(
          <div key={`bullet-${lineIndex}`} className="flex items-start gap-2 my-1 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 50}ms`, animationFillMode: 'forwards'}}>
            <span className="text-purple-400 flex-shrink-0">•</span>
            <span className="flex-1">{line.substring(2)}</span>
          </div>
        );
        return;
      }
      
      if (line.match(/^\d+\./)) {
        const parts = line.split(': ');
        elements.push(
          <div key={`numbered-${lineIndex}`} className="my-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 50}ms`, animationFillMode: 'forwards'}}>
            <strong className="font-bold text-purple-300">{parts[0]}:</strong> <span className="text-gray-300">{parts[1] || ''}</span>
          </div>
        );
        return;
      }
      
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
      
      elements.push(
        <div key={`text-${lineIndex}`} className="my-1 opacity-0 animate-slide-up text-gray-300" style={{animationDelay: `${lineIndex * 50}ms`, animationFillMode: 'forwards'}} dangerouslySetInnerHTML={{__html: processedLine}} />
      );
    });
    
    return elements;
  };

  const formatTextWithAnimation = (text: string) => {
    return formatTextAsElements(text);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
            <div className="flex items-center gap-2">
              <p className="text-purple-300">Analyzing your symptoms...</p>
              {USE_TEST_MODE && (
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  TEST MODE
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
            title="Expand to full view"
          >
            <Maximize2 className="text-purple-300 group-hover:text-purple-200" size={16} />
          </button>
        </div>

        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="space-y-2 leading-relaxed">
                {displayedElements.length > 0 ? displayedElements : (
                  <div className="text-gray-300">{displayedText}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Analysis Results</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-purple-300 text-sm">Complete diagnostic analysis</p>
                    {USE_TEST_MODE && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        TEST MODE
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
              >
                <X className="text-purple-300 group-hover:text-purple-200" size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-3 leading-relaxed">
                  {formatTextWithAnimation(analysisText)}
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

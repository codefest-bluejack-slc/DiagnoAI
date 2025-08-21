import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { ISymptom } from '../../interfaces/IDiagnostic';

interface AnalyzeSymptomsProps {
  symptoms: ISymptom[];
  description: string;
  since: string;
  onAnalysisComplete: (result: string) => void;
}

const analysisText = `Analyzing your symptoms... 

Based on your health information, I'm processing the following:

• Symptom patterns and severity levels
• Timeline of symptom onset  
• Potential correlations between symptoms
• Risk assessment based on provided information

Generating comprehensive health analysis...

**Primary Assessment:**
Your combination of symptoms suggests several possibilities that warrant attention. The severity levels and timing help narrow down potential conditions.

**Key Observations:**
• Symptom onset timing is significant for diagnosis
• The combination pattern indicates possible systemic involvement  
• Severity progression suggests need for medical evaluation

**Recommended Actions:**
1. **Immediate Steps:** Monitor symptom progression carefully
2. **Medical Consultation:** Schedule healthcare provider appointment
3. **Symptom Tracking:** Continue documenting any changes

**Important Note:** This analysis is for informational purposes only. Please consult with a qualified healthcare provider for proper diagnosis and treatment.

Analysis complete. Proceeding to medication recommendations...`;

export const AnalyzeSymptoms: React.FC<AnalyzeSymptomsProps> = ({
  symptoms,
  description,
  since,
  onAnalysisComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const words = analysisText.split(' ');

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(words.slice(0, currentWordIndex + 1).join(' '));
        setCurrentWordIndex(currentWordIndex + 1);
      }, 80);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        onAnalysisComplete(analysisText);
      }, 1000);
    }
  }, [currentWordIndex, words, onAnalysisComplete]);

  const formatTextWithAnimation = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        return <div key={`empty-${lineIndex}`} className="h-2" />;
      }
      
      if (line.includes('**') && !line.includes('Primary Assessment') && !line.includes('Key Observations') && !line.includes('Recommended Actions') && !line.includes('Important Note')) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h4 key={`header-${lineIndex}`} className="font-bold text-white mt-4 mb-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 100}ms`, animationFillMode: 'forwards'}}>
            {cleanLine}
          </h4>
        );
      }
      
      if (line.startsWith('**') && line.endsWith('**')) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h4 key={`section-${lineIndex}`} className="font-bold text-white mt-4 mb-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 100}ms`, animationFillMode: 'forwards'}}>
            {cleanLine}
          </h4>
        );
      }
      
      if (line.startsWith('• ')) {
        return (
          <div key={`bullet-${lineIndex}`} className="flex items-start gap-2 my-1 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 100}ms`, animationFillMode: 'forwards'}}>
            <span className="text-purple-400 flex-shrink-0">•</span>
            <span className="flex-1">{line.substring(2)}</span>
          </div>
        );
      }
      
      if (line.match(/^\d+\./)) {
        const parts = line.split(': ');
        return (
          <div key={`numbered-${lineIndex}`} className="my-2 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 100}ms`, animationFillMode: 'forwards'}}>
            <strong className="font-bold">{parts[0]}:</strong> {parts[1] || ''}
          </div>
        );
      }
      
      return (
        <div key={`text-${lineIndex}`} className="my-1 opacity-0 animate-slide-up" style={{animationDelay: `${lineIndex * 100}ms`, animationFillMode: 'forwards'}}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
        <div className="bg-slate-900/50     rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-full animate-bounce">
              <Brain className="text-purple-300" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">
                Processing Your Health Data
              </h3>
              <div className="text-purple-200 text-sm leading-relaxed max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-700/20">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    @keyframes slide-up {
                      from {
                        opacity: 0;
                        transform: translateY(10px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                    .animate-slide-up {
                      animation: slide-up 0.4s ease-out;
                    }
                  `
                }} />
                <div className="space-y-1">
                  {formatTextWithAnimation(displayedText)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSymptoms;

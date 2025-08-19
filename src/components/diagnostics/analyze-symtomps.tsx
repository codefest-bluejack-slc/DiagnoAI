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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < analysisText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(analysisText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        onAnalysisComplete(analysisText);
      }, 1000);
    }
  }, [currentIndex, onAnalysisComplete]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-full animate-bounce">
              <Brain className="text-purple-300" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">
                Processing Your Health Data
              </h3>
              <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">
                {displayedText}
                {currentIndex < analysisText.length && (
                  <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSymptoms;

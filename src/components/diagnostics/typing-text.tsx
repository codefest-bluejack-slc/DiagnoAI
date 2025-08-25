import React, { useState, useEffect } from 'react';
import { Brain, Bot } from 'lucide-react';

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 50,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-400/30 p-4 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-500/20 rounded-full flex-shrink-0 animate-pulse">
          <Brain className="text-purple-300" size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-200 text-sm font-medium">
              AI DiagnoAssistant
            </span>
            <div className="flex gap-1"></div>
          </div>
          <div className="text-purple-100 text-sm leading-relaxed whitespace-pre-wrap">
            {formatText(displayedText)}
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-purple-300 ml-1 animate-pulse"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingText;

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useTemplateSymptoms } from '../../hooks/use-template-symtomps';
import { useToast } from '../../hooks/use-toast';

interface SymptomAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: (selectedValue?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  severity: 'mild' | 'moderate' | 'severe';
  onSeverityChange: (severity: 'mild' | 'moderate' | 'severe') => void;
}

export const SymptomAutocomplete: React.FC<SymptomAutocompleteProps> = ({
  value,
  onChange,
  onAdd,
  placeholder = 'Type a symptom...',
  className = '',
  disabled = false,
  severity,
  onSeverityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchSymptoms } = useTemplateSymptoms();
  const { addToast } = useToast();

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchSymptoms(value);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBestSuggestion = () => {
    if (suggestions.length === 0) return null;
    return suggestions[0];
  };

  const getBestMatchForText = (text: string): string | null => {
    if (!text || text.trim().length < 2) return null;
    const results = searchSymptoms(text.trim());
    return results.length > 0 ? results[0] : null;
  };

  const handleAddWithSuggestion = () => {
    const bestSuggestion = getBestSuggestion();
    if (bestSuggestion) {
      handleSelectSuggestion(bestSuggestion);
    } else if (suggestions.length === 0 && value.trim()) {
      addToast('Please select a symptom from the available options', {
        type: 'warning',
        title: 'Invalid Selection',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && value.trim()) {
        e.preventDefault();
        addToast('Please select a symptom from the available options', {
          type: 'warning',
          title: 'Invalid Selection',
        });
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          handleAddWithSuggestion();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    onAdd(suggestion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (value.length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={50}
          className={`w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 focus:scale-[1.01] ${className}`}
        />

        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-purple-400/30 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    index === selectedIndex
                      ? 'bg-purple-500/30 text-white border border-purple-400/50'
                      : 'text-purple-100 hover:bg-purple-500/20 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{suggestion}</span>
                </button>
              ))}
            </div>

            <div className="absolute top-full left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-400/30"></div>
          </div>
        )}

        {value.length >= 2 && suggestions.length === 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800/95 backdrop-blur-sm border border-red-400/30 rounded-xl shadow-xl z-50">
            <div className="p-3 text-center">
              <span className="text-red-300 text-sm">
                No matching symptoms found. Please try a different term.
              </span>
            </div>
            <div className="absolute top-full left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-400/30"></div>
          </div>
        )}
      </div>

      <select
        value={severity}
        onChange={(e) =>
          onSeverityChange(e.target.value as 'mild' | 'moderate' | 'severe')
        }
        disabled={disabled}
        className="p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300/50 backdrop-blur-sm transition-all duration-300 appearance-none cursor-pointer"
      >
        <option value="mild" className="bg-gray-800 text-white">
          Mild
        </option>
        <option value="moderate" className="bg-gray-800 text-white">
          Moderate
        </option>
        <option value="severe" className="bg-gray-800 text-white">
          Severe
        </option>
      </select>

      <button
        onClick={handleAddWithSuggestion}
        disabled={!value.trim() || disabled || suggestions.length === 0}
        className="p-4 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-200 disabled:text-gray-400 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
        title="Add symptom"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default SymptomAutocomplete;

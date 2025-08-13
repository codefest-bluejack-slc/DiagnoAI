import {
  Activity,
  AlertCircle,
  Heart,
  Brain,
  Thermometer,
  Stethoscope,
  Target,
  TrendingUp,
} from 'lucide-react';

export const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'mild':
      return 'text-green-400 bg-emerald-400/10 border-emerald-400/20';
    case 'moderate':
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'severe':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
  }
};

export const getStepIcon = (step: string) => {
  switch (step) {
    case 'input':
      return <Stethoscope size={20} />;
    case 'review':
      return <Target size={20} />;
    case 'analysis':
      return <TrendingUp size={20} />;
    default:
      return <Activity size={20} />;
  }
};

export const getSeverityIcon = (severity?: string) => {
  switch (severity) {
    case 'mild':
      return <Heart size={16} />;
    case 'moderate':
      return <AlertCircle size={16} />;
    case 'severe':
      return <Thermometer size={16} />;
    default:
      return <Activity size={16} />;
  }
};

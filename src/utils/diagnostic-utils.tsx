import {
  Activity,
  AlertCircle,
  Heart,
  Brain,
  Thermometer,
  Stethoscope,
  Target,
  TrendingUp,
  Search,
  ShoppingCart,
  Pill,
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
      return <Stethoscope className="text-purple-300" size={20} />;
    case 'finding-illness':
      return <Brain className="text-purple-300" size={20} />;
    case 'finding-drugs':
      return <Pill className="text-purple-300" size={20} />;
    case 'finding-products':
      return <ShoppingCart className="text-purple-300" size={20} />;
    default:
      return <Activity className="text-purple-300" size={20} />;
  }
};

export const getSeverityIcon = (severity?: string) => {
  switch (severity) {
    case 'mild':
      return <Heart className="text-green-400" size={20} />;
    case 'moderate':
      return <AlertCircle className="text-amber-400" size={20} />;
    case 'severe':
      return <Thermometer className="text-red-400" size={20} />;
    default:
      return <Activity className="text-purple-400" size={20} />;
  }
};

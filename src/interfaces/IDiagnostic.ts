export interface ISymptom {
  id: string;
  illness: string;
  description: string;
  severity?: 'mild' | 'moderate' | 'severe';
  since?: string;
}

export interface IDiagnosticPageProps {}

export interface IDiagnosticStep {
  id: 'input' | 'review' | 'analysis';
  name: string;
  description: string;
}

export interface IMousePosition {
  x: number;
  y: number;
}

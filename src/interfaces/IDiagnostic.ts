export interface ISymptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface IHealthAssessment {
  id: string;
  description: string;
  symptoms: ISymptom[];
  since: string;
}

export interface IDiagnostic {
  description: string;
  symptoms: ISymptom[];
  since: string;
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

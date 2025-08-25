import { I } from 'vitest/dist/chunks/reporters.nr4dxCkA';

export interface IResultDiagnosis {
  diagnosis?: string;
  recommendationAgentResponse?: IRecommendationAgentResponse;
}

export interface IRecommendationAgentResponse {
  answer?: string;
  medicines?: IMedicineResult[];
}

export interface IMedicineResult {
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  // product_ndc?: string;
}

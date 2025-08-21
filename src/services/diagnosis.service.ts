import axios from 'axios';

export interface DiagnosisRawRequest {
  text: string;
}

export interface DiagnosisFromSymptomsRequest {
  description: string;
  symptoms: Array<{
    name: string;
    severity: string;
  }>;
  since: string;
}

export interface DiagnosisResponse {
  diagnosis: string;
  recommendations: string[];
  severity_level: string;
}

export interface StringResponse {
  result: string;
}

export class DiagnosisService {
  private static readonly BASE_URL = import.meta.env.VITE_FORWARD_DIAGNOSTIC || 'http://localhost:8001';

  public static async getStructuredDiagnosis(request: DiagnosisFromSymptomsRequest): Promise<DiagnosisResponse> {
    try {
      const response = await axios.post(`${this.BASE_URL}/diagnosis/from-symptoms`, request, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get structured diagnosis: ${error}`);
    }
  }

  public static async getUnstructuredDiagnosis(request: DiagnosisRawRequest): Promise<StringResponse> {
    try {
      const response = await axios.post(`${this.BASE_URL}/diagnosis/get_structure`, request, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get unstructured diagnosis: ${error}`);
    }
  }
}

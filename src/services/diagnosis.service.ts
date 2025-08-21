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
  private static getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_FORWARD_DIAGNOSTIC;
    const fallbackUrl = 'http://localhost:8001';
    
    console.log('All import.meta.env:', import.meta.env);
    console.log('Environment VITE_FORWARD_DIAGNOSTIC:', envUrl);
    console.log('Environment type:', typeof envUrl);
    
    const baseUrl = (envUrl || fallbackUrl).replace(/\/$/, '');
    console.log('Using base URL:', baseUrl);
    
    return baseUrl;
  }

  public static async getStructuredDiagnosis(request: DiagnosisFromSymptomsRequest): Promise<DiagnosisResponse> {
    const baseUrl = this.getBaseUrl();
    try {
      console.log('Calling structured diagnosis endpoint:', `${baseUrl}/diagnosis/from-symptoms`);
      const response = await axios.post(`${baseUrl}/diagnosis/from-symptoms`, request, {
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
    const baseUrl = this.getBaseUrl();
    try {
      console.log('Calling unstructured diagnosis endpoint:', `${baseUrl}/diagnosis/get_structure`);
      const response = await axios.post(`${baseUrl}/diagnosis/get_structure`, request, {
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

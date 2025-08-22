import axios from 'axios';
import { Q } from 'vitest/dist/chunks/reporters.nr4dxCkA';
import { IDiagnostic } from '../interfaces/IDiagnostic';

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
  recommendation_agent_response: {
    answer: string;
    medicines: Array<{
      brand_name: string;
      generic_name: string;
      manufacturer: string;
      product_ndc: string;
    }>;
  };
}

export class DiagnosisService {
  private static readonly USE_TEST_MODE = import.meta.env.VITE_TEST_MODE === 'true';
  private static readonly BASE_URL = import.meta.env.VITE_FORWARD_DIAGNOSTIC || 'http://localhost:8001';

  private static readonly TEST_DATA: DiagnosisResponse = {
    "diagnosis": "Based on the provided symptoms (Headache - Mild, Fever - High, Diarrhea - High) and the information gathered from the dataset, here's a breakdown of the potential diagnoses, considering the context of eating a large amount of seafood:\n\n**Most Likely Possibilities (Considering Seafood Consumption):**\n\n*   **Gastroenteritis (Stomach Flu):** This is a strong contender. The symptoms of diarrhea and fever are present, and the dataset includes this disease. Eating a large amount of seafood, especially if it's not handled or cooked properly, can easily lead to food poisoning, which often manifests as gastroenteritis. The mild headache could be a secondary symptom.\n\n**Less Likely, but Possible (Requires Further Investigation):**\n\n*   **Intracranial Abscess:** While the dataset includes headache and fever, the presence of diarrhea makes this less likely. Intracranial abscesses are serious and usually present with more severe neurological symptoms. However, if the headache worsens or other neurological symptoms develop, this should be considered.\n*   **West Nile Virus:** The dataset includes fever and headache, but the presence of diarrhea makes this less likely.\n*   **Cryptococcosis:** The dataset includes headache and fever, but the presence of diarrhea makes this less likely.\n*   **Encephalitis:** The dataset includes headache and fever, but the presence of diarrhea makes this less likely.\n\n**Important Considerations and Next Steps:**\n\n*   **Severity:** The severity of the symptoms is crucial. \"High\" fever and \"High\" diarrhea suggest a more serious condition than mild symptoms.\n*   **Onset:** How quickly did the symptoms appear after eating the seafood? Food poisoning symptoms usually appear within hours.\n*   **Other Symptoms:** Are there any other symptoms? Nausea, vomiting, abdominal pain, or other neurological symptoms would provide more clues.\n*   **Medical Advice:** **This information is for informational purposes only and should not be considered medical advice.** The individual experiencing these symptoms should seek immediate medical attention. A doctor can perform a proper examination, order tests (e.g., stool sample, blood tests), and provide an accurate diagnosis and treatment plan.\n*   **Food Safety:** If food poisoning is suspected, it's important to report the incident to the relevant health authorities, especially if others who ate the same seafood are also experiencing symptoms.\n\n**In summary, the most likely initial diagnosis, given the context of seafood consumption, is gastroenteritis (food poisoning). However, the severity of the symptoms warrants medical attention to rule out other, potentially more serious, conditions.**\n",
    "recommendation_agent_response": {
      "answer": "**Recommended Medication:** DysBio Plus\n**Medical Name:** ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, BOTULINUM, SALMONELLA TYPHI NOSODE, MORGAN GAERTNER, CLOSTRIDIUM DIFFICILE, BRUGIA MALAYI\n**Manufacturer:** Deseret Biologicals, Inc.\n**Active Ingredients:** Echinacea (Angustifolia), Aloe, Colchicum Autumnale, Colocynthis, Mercurius Corrosivus, Nux Vomica, Arsenicum Album, Aceticum Acidum, Chininum Sulphuricum, Cholera Nosode, Proteus (Vulgaris), Colibacillinum Cum Natrum Muriaticum, Helicobacter Pylori, Botulinum, Salmonella Typhi Nosode, Morgan Gaertner, Clostridium Difficile, Brugia Malayi\n**Route of Administration:** Oral\n**Primary Use:** For temporary relief of symptoms related to gastroenteritis including occasional diarrhea, stomach cramps, nausea, vomiting, flatulence and bloating.\n**Important Warnings:** Keep out of reach of children. In case of overdose, contact a physician or Poison Control Center right away. If pregnant or breast-feeding, ask a health professional before use. These statements are based upon homeopathic principles and have not been reviewed by the Food and Drug Administration.\n**Contraindications:** Do not use if tamper seal is broken or missing.\n**Dosage and Administration:** 1-10 drops under the tongue, 3 times a day or as directed by a health professional. Consult a physician for use in children under 12 years of age.\n**Alternative Options:** DysBio Plus - For gastroenteritis symptoms, DysBio Plus - For gastroenteritis symptoms",
      "medicines": [
        {
          "brand_name": "DysBio Plus",
          "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, BOTULINUM, SALMONELLA TYPHI NOSODE, MORGAN GAERTNER, CLOSTRIDIUM DIFFICILE, BRUGIA MALAYI",
          "manufacturer": "Deseret Biologicals, Inc.",
          "product_ndc": "43742-2021"
        },
        {
          "brand_name": "DysBio Plus",
          "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, BOTULINUM, SALMONELLA TYPHI NOSODE, MORGAN GAERTNER, CLOSTRIDIUM DIFFICILE, BRUGIA MALAYI",
          "manufacturer": "Deseret Biologicals, Inc.",
          "product_ndc": "43742-1595"
        },
        {
          "brand_name": "DysBio Plus",
          "generic_name": "ECHINACEA (ANGUSTIFOLIA), ALOE, COLCHICUM AUTUMNALE, COLOCYNTHIS, MERCURIUS CORROSIVUS, NUX VOMICA, ARSENICUM ALBUM, CLOSTRIDIUM DIFFICILE, ACETICUM ACIDUM, CHININUM SULPHURICUM, CHOLERA NOSODE, PROTEUS (VULGARIS), COLIBACILLINUM CUM NATRUM MURIATICUM, HELICOBACTER PYLORI, YERSINIA ENTEROCOLITICA, BOTULINUM NOSODE, SALMONELLA TYPHI NOSODE, BRUGIA MALAYI",
          "manufacturer": "Deseret Biologicals, Inc.",
          "product_ndc": "43742-1421"
        },
        {
          "brand_name": "Naprelan",
          "generic_name": "NAPROXEN SODIUM",
          "manufacturer": "ALMATICA PHARMA INC.",
          "product_ndc": "52427-272"
        }
      ]
    }
  };

  public static async getStructuredDiagnosis(request: DiagnosisFromSymptomsRequest): Promise<DiagnosisResponse> {
    if (this.USE_TEST_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.TEST_DATA);
        }, 1500);
      });
    }

    try {
      const response = await axios.post(`${this.BASE_URL}diagnosis/from-symptoms`, request, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get structured diagnosis: ${error}`);
    }
  }

  public static async getUnstructuredDiagnosis(request: DiagnosisRawRequest): Promise<DiagnosisFromSymptomsRequest> {
    if (this.USE_TEST_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            description: "Test description",
            symptoms: [
              { name: "Headache", severity: "Mild" },
              { name: "Fever", severity: "High" }
            ],
            since: "2024-08-10"
          });
        }, 1500);
      });
    }

    try {
      const response = await axios.post(`${this.BASE_URL}diagnosis/get_structure`, request, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("response from diagnosis service (LANGSUNG DARI API) ", response.data.result);

      const result = response.data.result;
      const parsedData: IDiagnostic = typeof result === 'string'
        ? JSON.parse(result)
        : result;


      const { description, symptoms, since } = parsedData;

      console.log("parsed data description", description);
      console.log("parsed data symptoms", symptoms);
      console.log("parsed data since", since);
      return {
        description,
        symptoms,
        since
      };
    } catch (error) {
      throw new Error(`Failed to get unstructured diagnosis: ${error}`);
    }
  }
}

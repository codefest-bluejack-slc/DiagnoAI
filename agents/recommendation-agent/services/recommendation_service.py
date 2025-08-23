import textwrap
from config import EnvLoader
from google import genai
from services import OpenFDAService
from models.domain import Medicine

class RecommendationService:
    def __init__(self):
        self.model_name = EnvLoader.get_str("MODEL_NAME")
        self.api_key = EnvLoader.get_str("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.api_key)
        self.openfda_service = OpenFDAService()

    def _build_prompt(self, context: str, medicine_data: list, query: str) -> str:
        medicine_info = "\n".join([
            f"Medicine {i+1}: {med.brand_name} ({med.generic_name}) - Manufacturer: {med.manufacturer}"
            for i, med in enumerate(medicine_data)
        ])
        
        prompt = textwrap.dedent(f"""
            You are a medical assistant. Your task is to analyze the following drug information documents and follow the instructions below.

            **List of Medicines:**
            {medicine_info}

            **Instructions:**
            1. Analyze the user's query to understand their illness and symptoms.
            2. Carefully read the provided context documents.
            3. Prescribe a suitable medicine from the available medicines that addresses the user's needs.
            4. Present the prescription in the EXACT format specified below.
            5. If multiple drugs from the context are suitable, list the best one first and briefly mention the others as alternatives.
            6. If no document in the context is a suitable match for the user's query, you MUST respond with "I'm sorry, but based on the provided documents, I cannot recommend a suitable medicine." Do not use outside knowledge.

            ---

            **Context Documents:**
            {context}

            ---

            **User's Question:**
            {query}

            ---

            **Output Format:**
            Follow this EXACT format with proper formatting:

            **Recommended Medication:** [Drug's Brand Name]  

            **Medical Name:** [Generic Name]  

            **Manufacturer:** [Manufacturer Name]  

            **Active Ingredients:** [List of ingredients seperated by commas]

            **Route of Administration:** [Oral, Topical, Injection, etc.]  

            **Primary Use:** [Brief description]  

            **Important Warnings:**  
            - [Warning 1]  
            - [Warning 2]  

            **Contraindications:**  
            - [Contraindication 1]  
            - [Contraindication 2]  

            **Dosage and Administration:**  
            - [Instruction 1]  
            - [Instruction 2]  

            **Alternative Options:**  
            - [Brand Name] - [Brief indication]  
            - [Brand Name] - [Brief indication]  

            **Formatting Guidelines:**  
            - Use proper sentence case, not ALL CAPS  
            - Always use bullet points when listing multiple items (warnings, contraindications, dosage steps, alternatives), except for ingredients
            - If a section has no content, completely omit that section from the output
        """).strip()
        return prompt

    def _extract_medicine_data(self, search_results: list) -> list:
        medicines = []
        
        for result in search_results:
            brand_name = result.get('brand_name', ['N/A'])
            generic_name = result.get('generic_name', ['N/A'])
            manufacturer_name = result.get('manufacturer_name', ['N/A'])
            product_ndc = result.get('product_ndc', ['N/A'])
            
            medicine = Medicine(
                brand_name=brand_name[0] if brand_name and brand_name[0] else 'N/A',
                generic_name=generic_name[0] if generic_name and generic_name[0] else 'N/A',
                manufacturer=manufacturer_name[0] if manufacturer_name and manufacturer_name[0] else 'N/A',
                product_ndc=product_ndc[0] if product_ndc and product_ndc[0] else 'N/A'
            )
            
            medicines.append(medicine)
        
        return medicines

    def send_query(self, query: str) -> tuple:
        search_results = self.openfda_service.search(query_text=query)
        context = "\n\n".join([str(result) for result in search_results])

        medicine_list = self._extract_medicine_data(search_results)
        prompt = self._build_prompt(context, medicine_list, query)

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )

        return response.text, medicine_list
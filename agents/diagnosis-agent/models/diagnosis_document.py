from datetime import date
from typing import List
from uagents import Model
from models.symptom import Symptom

class DiagnosisDocument(Model):
    name: str
    symptoms: List[str]
    treatments: List[str]
    symptoms_formatted: str
    treatments_formatted: str
from datetime import date
from typing import List
from uagents import Model
from models.symptom import Symptom

class DiagnosisFromSymptomsRequest(Model):
    description: str
    symptoms: List[Symptom]
    since: date

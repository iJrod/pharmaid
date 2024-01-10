from pydantic import BaseModel
from enum import Enum


class SymptomSeverity(str, Enum):
    mild = 'mild'
    moderate_to_severe = 'moderate_to_severe'


class UTIQuestionnaireResponse(BaseModel):
    pregnant: bool
    urinary_catheter: bool
    recurrent_uti: bool
    risk_of_deterioration: bool
    kidney_pain: bool
    flu_like_symptoms: bool
    high_temperature: bool
    nausea_vomiting: bool
    vaginal_discharge: bool
    urethritis: bool
    sexual_history: bool
    signs_of_pregnancy: bool
    immunosuppressed: bool
    dysuria: bool
    nocturia: bool
    cloudy_urine: bool
    urgency: bool
    frequency: bool
    visible_haematuria: bool
    suprapubic_pain: bool
    symptom_severity: SymptomSeverity

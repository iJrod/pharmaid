from .models import UTIQuestionnaireResponse


def evaluate_uti_response(response: UTIQuestionnaireResponse):
    if response.pregnant or response.urinary_catheter or response.recurrent_uti:
        return "Exclude from UTI pathway"

    if response.risk_of_deterioration:
        return "Consider calculating NEWS2 Score"

    if any([response.kidney_pain, response.flu_like_symptoms, response.high_temperature, response.nausea_vomiting]):
        return """Urgent same day referral:
                    - General practice
                    - Relevant out of hours service
                """

    if any([response.vaginal_discharge, response.urethritis, response.sexual_history, response.signs_of_pregnancy,
            response.immunosuppressed]):
        return """Onward referral: 
                    - General practice
                    - Sexual health clinics
                    - Other provider as appropriate
                """

    key_symptoms = [response.dysuria, response.nocturia, response.cloudy_urine]
    key_symptoms_count = sum(key_symptoms)

    if key_symptoms_count == 0:
        if any([response.urgency, response.frequency, response.visible_haematuria, response.suprapubic_pain]):
            return """UTI equally likely to other diagnosis
                            Onward referral:
                                - General practice
                                - Sexual health clinics
                                - Other provider as appropriate
                                """
        else:
            return """UTI less likely
                           Self-care and pain relief
                        """
    elif key_symptoms_count >= 2:
        treatment_advice = "Shared decision making approach using TARGET UTI resources. "
        if response.symptom_severity == "mild":
            treatment_advice += "Consider pain relief and self care. Ask patient to return to Pharmacy if no " \
                                "improvement in 48 hours for pharmacist reassessment."
        else:
            treatment_advice += "Offer nitrofurantoin for 3 days (subject to inclusion/exclusion criteria in PGD) " \
                                "plus self-care."
        return treatment_advice

    return "Further Assessment Required"

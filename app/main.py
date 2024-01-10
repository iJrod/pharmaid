from fastapi import FastAPI
from .models import UTIQuestionnaireResponse
from .decision_tree import evaluate_uti_response

app = FastAPI()


@app.post("/evaluate")
async def evaluate(response: UTIQuestionnaireResponse):
    result = evaluate_uti_response(response)
    return {"result": result}

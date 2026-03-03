from fastapi import FastAPI
from pydantic import BaseModel
from app.scoring.baseline_tfidf import TfidfScorer

app = FastAPI()

scorer = TfidfScorer()

class ScoringRequest(BaseModel):
    question: str
    student_answer: str
    reference_answer: str

class ScoringResponse(BaseModel):
    score: float
    feedback: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/score", response_model=ScoringResponse)
def score_answer(request: ScoringRequest):
    score = scorer.score(
        request.student_answer,
        request.reference_answer
    )
    feedback = "Good answer." if score > 0.7 else "Answer needs improvement."

    return {
        "score": score,
        "feedback": feedback
    }
from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

from app.config import BERT_MODEL_DIR, RUBRIC_MAX_SCORE
from app.feedback.rule_based import generate_feedback
from app.scoring.sbert_scoring import SBERTScorer
from app.scoring.transformer_scoring import BertRegressorScorer

app = FastAPI()

scorer_type = "sbert"
scorer = SBERTScorer()

bert_dir = Path(BERT_MODEL_DIR)
if bert_dir.exists():
    try:
        scorer = BertRegressorScorer(str(bert_dir))
        scorer_type = "bert"
    except Exception:
        scorer = SBERTScorer()
        scorer_type = "sbert"

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
    if scorer_type == "bert":
        score = scorer.score(request.student_answer)
        feedback = generate_feedback(score, max_score=RUBRIC_MAX_SCORE)
    else:
        score = scorer.score(
            request.student_answer,
            request.reference_answer
        )
        feedback = generate_feedback(score, max_score=1.0)

    return {
        "score": score,
        "feedback": feedback
    }
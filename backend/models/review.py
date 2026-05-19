from dataclasses import dataclass


@dataclass(slots=True)
class ReviewPayload:
	teacher_score: float
	teacher_feedback: str

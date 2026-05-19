from dataclasses import dataclass


@dataclass(slots=True)
class AIResult:
	score: float | None
	feedback: str | None

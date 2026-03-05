from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parents[1]

BERT_MODEL_DIR = os.getenv(
	"BERT_MODEL_DIR",
	str(BASE_DIR / "results" / "bert_regressor" / "final"),
)

RUBRIC_MAX_SCORE = float(os.getenv("RUBRIC_MAX_SCORE", "5.0"))

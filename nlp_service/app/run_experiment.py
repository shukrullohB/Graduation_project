print("HELLO I AM RUNNING")

import sys
import os
import pandas as pd

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scoring.baseline_tfidf import TfidfScorer
from evaluation.metrics import evaluate

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "sample_dataset.csv")

df = pd.read_csv(DATA_PATH)

print("Dataset loaded")
print(df.head())
print("Number of rows:", len(df))

scorer = TfidfScorer()

true_scores = []
predicted_scores = []

for _, row in df.iterrows():
    score, sim = scorer.score(
        row["reference_answer"],
        row["student_answer"]
    )
    
    true_scores.append(row["teacher_score"])
    predicted_scores.append(score)

print("True scores:", true_scores)
print("Predicted scores:", predicted_scores)

results = evaluate(true_scores, predicted_scores)

print("Evaluation Results:")
print(results)
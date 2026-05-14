import os
import sys
import pandas as pd

print("HELLO I AM RUNNING")

# Fix imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scoring.baseline_tfidf import TfidfScorer
from evaluation.metrics import evaluate

# Dataset path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "sample_dataset.csv")

# Load dataset
df = pd.read_csv(DATA_PATH)

print("Dataset loaded")
print(df.head())
print("Number of rows:", len(df))

scorer = TfidfScorer()

true_scores = []
predicted_scores = []

for _, row in df.iterrows():
    score = scorer.score(row["student_answer"], row["reference_answer"])
    true_scores.append(row["teacher_score"])
    predicted_scores.append(score)

print("True scores:", true_scores)
print("Predicted scores:", predicted_scores)

results = evaluate(true_scores, predicted_scores)

print("Evaluation Results:")
print(results)
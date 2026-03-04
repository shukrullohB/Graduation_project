from pathlib import Path
import argparse
import sys

import numpy as np
import pandas as pd
import torch
from scipy.stats import pearsonr
from sklearn.metrics import cohen_kappa_score, mean_absolute_error
from transformers import AutoModelForSequenceClassification, AutoTokenizer

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
	sys.path.append(str(PROJECT_ROOT))

from app.scoring.baseline_tfidf import TfidfScorer
from app.scoring.sbert_scoring import SBERTScorer


class BertRegressorScorer:
	def __init__(self, model_dir: str):
		self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
		self.model = AutoModelForSequenceClassification.from_pretrained(model_dir)
		self.model.eval()

	def score(self, student_answer: str) -> float:
		encoded = self.tokenizer(
			student_answer,
			truncation=True,
			padding="max_length",
			max_length=128,
			return_tensors="pt",
		)
		with torch.no_grad():
			prediction = self.model(**encoded).logits.squeeze().item()
		return float(prediction)


def parse_args():
	parser = argparse.ArgumentParser(description="Compare TF-IDF, SBERT, and BERT scorers")
	parser.add_argument("--data_path", type=str, default="app/data/sample_dataset.csv")
	parser.add_argument("--bert_model_dir", type=str, default="results/bert_regressor/final")
	parser.add_argument("--limit", type=int, default=0)
	return parser.parse_args()


def compute_metrics(true_scores, predicted_scores):
	true_scores = np.asarray(true_scores, dtype=float)
	predicted_scores = np.asarray(predicted_scores, dtype=float)

	mae = mean_absolute_error(true_scores, predicted_scores)
	correlation, _ = pearsonr(true_scores, predicted_scores)

	true_rounded = np.clip(np.rint(true_scores), 0, 5).astype(int)
	pred_rounded = np.clip(np.rint(predicted_scores), 0, 5).astype(int)
	kappa = cohen_kappa_score(true_rounded, pred_rounded)

	return {
		"MAE": float(mae),
		"Correlation": float(correlation),
		"Cohen_Kappa": float(kappa),
	}


def to_rubric_scale(score_0_1):
	return float(np.clip(score_0_1, 0.0, 1.0) * 5.0)


def main():
	args = parse_args()

	data_path = Path(args.data_path)
	bert_model_dir = Path(args.bert_model_dir)

	if not data_path.exists():
		raise FileNotFoundError(f"Dataset not found: {data_path}")
	if not bert_model_dir.exists():
		raise FileNotFoundError(f"BERT model directory not found: {bert_model_dir}")

	df = pd.read_csv(data_path)
	required_columns = {"student_answer", "reference_answer", "teacher_score"}
	missing = required_columns - set(df.columns)
	if missing:
		raise ValueError(f"Missing required columns: {sorted(missing)}")

	if args.limit > 0:
		df = df.head(args.limit)

	print("Rows:", len(df))
	print("Data path:", data_path)
	print("BERT model:", bert_model_dir)

	tfidf = TfidfScorer()
	sbert = SBERTScorer()
	bert = BertRegressorScorer(str(bert_model_dir))

	y_true = df["teacher_score"].astype(float).tolist()

	tfidf_preds = []
	sbert_preds = []
	bert_preds = []

	for _, row in df.iterrows():
		student_answer = str(row["student_answer"])
		reference_answer = str(row["reference_answer"])

		tfidf_score = tfidf.score(student_answer, reference_answer)
		sbert_score = sbert.score(student_answer, reference_answer)
		bert_score = bert.score(student_answer)

		tfidf_preds.append(to_rubric_scale(tfidf_score))
		sbert_preds.append(to_rubric_scale(sbert_score))
		bert_preds.append(float(np.clip(bert_score, 0.0, 5.0)))

	results = {
		"TF-IDF": compute_metrics(y_true, tfidf_preds),
		"SBERT": compute_metrics(y_true, sbert_preds),
		"BERT": compute_metrics(y_true, bert_preds),
	}

	print("\nModel Comparison")
	print("-" * 66)
	print(f"{'Model':<10} {'MAE':<12} {'Correlation':<12} {'Cohen_Kappa':<12}")
	print("-" * 66)
	for model_name, metrics in results.items():
		print(
			f"{model_name:<10} "
			f"{metrics['MAE']:<12.4f} "
			f"{metrics['Correlation']:<12.4f} "
			f"{metrics['Cohen_Kappa']:<12.4f}"
		)
	print("-" * 66)


if __name__ == "__main__":
	main()

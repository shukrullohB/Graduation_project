from pathlib import Path

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


class BertRegressorScorer:
	def __init__(self, model_dir: str):
		model_path = Path(model_dir)
		self.tokenizer = AutoTokenizer.from_pretrained(str(model_path))
		self.model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
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

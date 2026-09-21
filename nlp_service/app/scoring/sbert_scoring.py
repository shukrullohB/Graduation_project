from pathlib import Path

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer


MODEL_DIR = Path(__file__).resolve().parents[1] / "models" / "all-MiniLM-L6-v2"
MODEL_PATH = MODEL_DIR / "model.onnx"
TOKENIZER_PATH = MODEL_DIR / "tokenizer.json"
MAX_SEQ_LENGTH = 256


class SBERTScorer:
    def __init__(self, model_dir: str | Path = MODEL_DIR):
        self.model_dir = Path(model_dir)
        self.tokenizer = Tokenizer.from_file(str(self.model_dir / TOKENIZER_PATH.name))
        self.tokenizer.enable_truncation(max_length=MAX_SEQ_LENGTH)
        self.session = ort.InferenceSession(
            str(self.model_dir / MODEL_PATH.name),
            providers=["CPUExecutionProvider"],
        )
        self.input_names = {model_input.name for model_input in self.session.get_inputs()}

    def score(self, student_answer, reference_answer):
        embeddings = self.encode([student_answer, reference_answer])
        similarity = self._cosine_similarity(embeddings[0], embeddings[1])

        return float(similarity)

    def encode(self, texts):
        encodings = self.tokenizer.encode_batch([str(text) for text in texts])
        max_length = max(len(encoding.ids) for encoding in encodings)

        input_ids = []
        attention_mask = []
        token_type_ids = []

        for encoding in encodings:
            pad_length = max_length - len(encoding.ids)
            input_ids.append(encoding.ids + [0] * pad_length)
            attention_mask.append(encoding.attention_mask + [0] * pad_length)
            token_type_ids.append(encoding.type_ids + [0] * pad_length)

        model_inputs = {
            "input_ids": np.asarray(input_ids, dtype=np.int64),
            "attention_mask": np.asarray(attention_mask, dtype=np.int64),
            "token_type_ids": np.asarray(token_type_ids, dtype=np.int64),
        }
        outputs = self.session.run(
            None,
            {name: value for name, value in model_inputs.items() if name in self.input_names},
        )
        embeddings = self._mean_pool(outputs[0], model_inputs["attention_mask"])
        return self._l2_normalize(embeddings)

    @staticmethod
    def _mean_pool(last_hidden_state, attention_mask):
        mask = attention_mask[..., None].astype(np.float32)
        summed = np.sum(last_hidden_state * mask, axis=1)
        counts = np.clip(np.sum(mask, axis=1), 1e-9, None)
        return summed / counts

    @staticmethod
    def _l2_normalize(values):
        norms = np.linalg.norm(values, axis=1, keepdims=True)
        return values / np.clip(norms, 1e-12, None)

    @staticmethod
    def _cosine_similarity(left, right):
        numerator = np.dot(left, right)
        denominator = np.linalg.norm(left) * np.linalg.norm(right)
        return numerator / denominator

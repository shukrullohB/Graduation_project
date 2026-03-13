from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SBERTScorer:

    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def score(self, student_answer, reference_answer):
        embeddings = self.model.encode([student_answer, reference_answer])
        similarity = cosine_similarity(
            [embeddings[0]],
            [embeddings[1]]
        )[0][0]

        return float(similarity)
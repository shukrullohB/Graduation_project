from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class TfidfScorer:

    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def score(self, student_answer, reference_answer):
        texts = [student_answer, reference_answer]
        tfidf = self.vectorizer.fit_transform(texts)
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

        return float(similarity)
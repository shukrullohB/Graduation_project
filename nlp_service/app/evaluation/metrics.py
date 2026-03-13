from sklearn.metrics import mean_absolute_error
from scipy.stats import pearsonr
from sklearn.metrics import cohen_kappa_score

def evaluate(true_scores, predicted_scores):
    mae = mean_absolute_error(true_scores, predicted_scores)
    correlation, _ = pearsonr(true_scores, predicted_scores)
    kappa = cohen_kappa_score(true_scores, predicted_scores)

    return {
        "MAE": mae,
        "Correlation": correlation,
        "Cohen_Kappa": kappa
    }
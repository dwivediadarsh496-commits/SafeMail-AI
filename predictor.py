import joblib
import threading
from pathlib import Path

_lock = threading.Lock()
_model = None
_vectorizer = None


def _load_assets(model_path: str, vec_path: str):
    global _model, _vectorizer
    with _lock:
        if _model is None:
            _model = joblib.load(model_path)
        if _vectorizer is None:
            _vectorizer = joblib.load(vec_path)


def predict(text: str, model_path: str, vec_path: str) -> dict:
    """
    Returns:
        {
          label: 'legitimate' | 'suspicious' | 'phishing',
          confidence: float (0-1, probability of predicted class),
          phishing_prob: float
        }
    """
    _load_assets(model_path, vec_path)

    X = _vectorizer.transform([text])
    proba = _model.predict_proba(X)[0]  # [P(safe), P(phishing)]
    phishing_prob = float(proba[1])

    if phishing_prob >= 0.75:
        label = "phishing"
        confidence = phishing_prob
    elif phishing_prob >= 0.45:
        label = "suspicious"
        confidence = phishing_prob
    else:
        label = "legitimate"
        confidence = float(proba[0])

    return {
        "label": label,
        "confidence": confidence,
        "phishing_prob": phishing_prob,
    }

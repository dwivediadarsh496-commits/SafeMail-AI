import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # -> d:\GITHUB DEVDAYS 2026\

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "safemail-dev-secret-2026")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{BASE_DIR / 'safemail' / 'safemail.db'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MODEL_PATH = str(BASE_DIR / "email_spam_nb.pkl")
    VECTORIZER_PATH = str(BASE_DIR / "tfidf_vectorizer.pkl")
    MAX_EMAIL_LENGTH = 50_000  # chars

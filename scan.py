"""SafeMail AI — Backend Routes: /api/scan"""
import uuid
from flask import Blueprint, request, jsonify, current_app

from ..db import db
from ..db.models import ScanHistory
from ..ml.preprocessor import preprocess_email, extract_url_flags
from ..ml.predictor import predict
from ..ml.explainer import explain

scan_bp = Blueprint("scan", __name__)


@scan_bp.route("/api/scan", methods=["POST"])
def scan_email():
    data = request.get_json(silent=True) or {}

    # Accept text from JSON body OR file upload
    if "email_text" in data:
        raw_text = data["email_text"]
    elif request.files.get("file"):
        f = request.files["file"]
        raw_text = f.read().decode("utf-8", errors="replace")
    else:
        return jsonify({"error": "No email_text or file provided"}), 400

    cfg = current_app.config
    if len(raw_text) > cfg["MAX_EMAIL_LENGTH"]:
        raw_text = raw_text[: cfg["MAX_EMAIL_LENGTH"]]

    # Preprocess
    clean_text = preprocess_email(raw_text)
    url_flags = extract_url_flags(raw_text)

    # Predict
    result = predict(clean_text, cfg["MODEL_PATH"], cfg["VECTORIZER_PATH"])

    # Explain
    reasons, suggestions = explain(raw_text, result["label"], result["confidence"])
    reasons = url_flags + reasons  # URL flags come first

    # Store to DB
    scan_id = str(uuid.uuid4())
    preview = raw_text[:250].replace("\n", " ").strip()

    record = ScanHistory(
        scan_id=scan_id,
        email_preview=preview,
        label=result["label"],
        confidence=result["confidence"],
    )
    record.reasons = reasons
    record.suggestions = suggestions
    db.session.add(record)
    db.session.commit()

    return jsonify({
        "scan_id": scan_id,
        "label": result["label"],
        "confidence": round(result["confidence"] * 100, 1),
        "phishing_prob": round(result["phishing_prob"] * 100, 1),
        "reasons": reasons,
        "suggestions": suggestions,
        "email_preview": preview,
    })

from datetime import datetime
import json
from . import db


class ScanHistory(db.Model):
    __tablename__ = "scan_history"

    id = db.Column(db.Integer, primary_key=True)
    scan_id = db.Column(db.String(36), unique=True, nullable=False)
    email_preview = db.Column(db.String(300), nullable=True)
    label = db.Column(db.String(20), nullable=False)        # legitimate | suspicious | phishing
    confidence = db.Column(db.Float, nullable=False)
    _reasons = db.Column("reasons", db.Text, default="[]")
    _suggestions = db.Column("suggestions", db.Text, default="[]")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def reasons(self):
        return json.loads(self._reasons)

    @reasons.setter
    def reasons(self, value):
        self._reasons = json.dumps(value)

    @property
    def suggestions(self):
        return json.loads(self._suggestions)

    @suggestions.setter
    def suggestions(self, value):
        self._suggestions = json.dumps(value)

    def to_dict(self):
        return {
            "scan_id": self.scan_id,
            "email_preview": self.email_preview,
            "label": self.label,
            "confidence": round(self.confidence * 100, 1),
            "reasons": self.reasons,
            "suggestions": self.suggestions,
            "timestamp": self.timestamp.isoformat() + "Z",
        }

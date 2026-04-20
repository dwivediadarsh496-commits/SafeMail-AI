"""SafeMail AI — Backend Routes: /api/history"""
from flask import Blueprint, jsonify

from ..db import db
from ..db.models import ScanHistory

history_bp = Blueprint("history", __name__)


@history_bp.route("/api/history", methods=["GET"])
def get_history():
    records = (
        ScanHistory.query.order_by(ScanHistory.timestamp.desc()).limit(100).all()
    )
    return jsonify([r.to_dict() for r in records])


@history_bp.route("/api/history/<scan_id>", methods=["DELETE"])
def delete_record(scan_id):
    record = ScanHistory.query.filter_by(scan_id=scan_id).first()
    if not record:
        return jsonify({"error": "Record not found"}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"success": True})


@history_bp.route("/api/history/stats", methods=["GET"])
def get_stats():
    total = ScanHistory.query.count()
    phishing = ScanHistory.query.filter_by(label="phishing").count()
    suspicious = ScanHistory.query.filter_by(label="suspicious").count()
    legitimate = ScanHistory.query.filter_by(label="legitimate").count()
    return jsonify({
        "total": total,
        "phishing": phishing,
        "suspicious": suspicious,
        "legitimate": legitimate,
    })

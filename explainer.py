import re
from typing import Tuple


# ── Heuristic keyword sets ───────────────────────────────────────────────────

URGENCY_PATTERNS = [
    r"\burgent\b", r"\bimmediately\b", r"\baccount.{0,10}(suspend|terminat|lock)",
    r"\bverify.{0,10}(now|immediately|account)", r"\bact now\b",
    r"\byour.{0,10}account.{0,10}(will be|has been)", r"\bexpires?\b",
    r"\blast.{0,5}chance\b", r"\blimited.{0,5}time\b",
]

FINANCIAL_BAIT = [
    r"\bfree\b.{0,20}\b(gift|prize|money|cash|reward)",
    r"\bwinner\b", r"\blottery\b", r"\bcongratulations\b.{0,30}\b(won|win)",
    r"\bclaim.{0,10}(prize|reward|money)", r"\b\$\d+[\.,]\d+\b",
    r"\bmillion.{0,10}dollar", r"\bcash.{0,10}(prize|reward|bonus)",
]

THREAT_LANGUAGE = [
    r"\blegal.{0,10}action\b", r"\barrest\b", r"\blawsuit\b",
    r"\bpolice\b.{0,20}(contact|file|report)", r"\bcriminal\b",
    r"\bprosecution\b", r"\bpenalt(y|ies)\b", r"\bdetain\b",
]

CREDENTIAL_HARVEST = [
    r"\bclick here\b", r"\benter.{0,15}(password|credential|detail)",
    r"\bconfirm.{0,15}(account|identity|password|email)",
    r"\bupdate.{0,15}(account|payment|billing|info)",
    r"\bverify.{0,10}(identity|account|email)",
    r"\bsign.{0,5}in\b.{0,20}\bconfirm\b",
]

IMPERSONATION = [
    r"\b(paypal|amazon|apple|microsoft|google|irs|fbi|ebay|netflix|bank of america)\b",
]

SUSPICIOUS_ATTACHMENTS = [
    r"\.(exe|bat|cmd|scr|vbs|js|zip|rar|7z|iso)\b",
    r"\battachment\b.{0,30}\bopen\b", r"\bdownload\b.{0,30}\bfile\b",
]


def _scan_patterns(text: str, patterns: list[str]) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in patterns)


def explain(raw_text: str, label: str, confidence: float) -> Tuple[list[str], list[str]]:
    """
    Return (reasons, suggestions) heuristic analysis for the email.
    """
    text = raw_text.lower()
    reasons = []
    suggestions = []

    # ── Collect reasons ──────────────────────────────────────────────────────
    if _scan_patterns(text, URGENCY_PATTERNS):
        reasons.append("⚠️ Urgent or threatening language detected (pressure tactics)")

    if _scan_patterns(text, FINANCIAL_BAIT):
        reasons.append("💰 Financial bait or prize offer detected")

    if _scan_patterns(text, THREAT_LANGUAGE):
        reasons.append("🚨 Threatening language (legal action, arrest, lawsuit)")

    if _scan_patterns(text, CREDENTIAL_HARVEST):
        reasons.append("🔑 Credential harvesting attempt — asking for login details")

    if _scan_patterns(text, IMPERSONATION):
        reasons.append("🎭 Possible brand impersonation (PayPal, Amazon, Apple, etc.)")

    if _scan_patterns(text, SUSPICIOUS_ATTACHMENTS):
        reasons.append("📎 Suspicious attachment reference (.exe, .zip, .js, etc.)")

    if re.search(r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", text):
        reasons.append("🌐 URL with raw IP address instead of domain name")

    if re.search(r"(bit\.ly|tinyurl|ow\.ly|is\.gd|goo\.gl)", text):
        reasons.append("🔗 Shortened or obfuscated URL detected")

    if re.search(r"dear (customer|user|member|account holder|valued client)", text):
        reasons.append("📧 Generic salutation — legitimate emails use your real name")

    if re.search(r"(misspell|paypa1|amaz0n|g00gle|micros0ft)", text):
        reasons.append("🔤 Misspelled brand name (common phishing tactic)")

    # ── Generate tailored suggestions ────────────────────────────────────────
    if label == "phishing":
        suggestions += [
            "🚫 Do NOT click any links in this email",
            "🗑️ Mark this email as spam and delete it",
            "🔒 Do NOT enter any personal or financial information",
            "📢 Report this email to your IT team or email provider",
        ]
        if _scan_patterns(text, IMPERSONATION):
            suggestions.append("✅ Go directly to the company's official website — do NOT use links in the email")
        if _scan_patterns(text, CREDENTIAL_HARVEST):
            suggestions.append("🔐 Change your password immediately if you clicked any links")

    elif label == "suspicious":
        suggestions += [
            "🧐 Verify the sender's identity through official channels before acting",
            "⚠️ Do not click links — navigate to the website directly",
            "📞 Contact the alleged sender via a known phone number to confirm",
            "🔍 Hover over links to inspect the actual URL before clicking",
        ]
    else:  # legitimate
        suggestions += [
            "✅ This email appears safe based on our analysis",
            "💡 Still exercise caution — always verify unexpected requests",
            "🔒 Keep your antivirus and email filters updated",
        ]

    return reasons, suggestions

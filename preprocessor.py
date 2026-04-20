import re
import html


def preprocess_email(text: str) -> str:
    """Clean raw email text for ML inference."""
    # Unescape HTML entities
    text = html.unescape(text)
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Normalize URLs (keep the token but simplify)
    text = re.sub(r"https?://\S+", " URL ", text)
    # Lowercase
    text = text.lower()
    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_url_flags(text: str) -> list[str]:
    """Return suspicious URL indicators found in raw email text."""
    flags = []
    urls = re.findall(r"https?://\S+", text)
    for url in urls:
        if re.search(r"\d{1,3}(\.\d{1,3}){3}", url):
            flags.append("IP address used as URL (common phishing tactic)")
        if re.search(r"bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|is\.gd", url):
            flags.append("Shortened / obfuscated URL detected")
        if url.count(".") > 4:
            flags.append("Excessively long or nested domain detected")
        if re.search(r"@", url):
            flags.append("@ symbol found inside URL (deceptive redirect)")
    return list(set(flags))

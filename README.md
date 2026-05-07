# 🛡️ SafeMail AI — Phishing Email Detection

> **SafeMail AI** is a machine learning-powered web application that detects phishing emails by analyzing content. It classifies emails as **Legitimate**, **Suspicious**, or **Phishing**, displays a confidence score, explains detected risks, and provides actionable prevention tips.

🔗 **Live Demo:** Wait

---

## 📸 Application Screenshots

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Home | `http://localhost:5000` | Email input, paste/upload modes, scan button |
| 📊 Dashboard | `http://localhost:5000/dashboard` | Scan history, stats cards, filterable table |
| 🔐 Login | `http://localhost:5000/login` | Sign In / Register with guest option |

---

## ✨ Features

- **Dual Input Modes** — Paste email text directly or upload `.txt` / `.eml` files via drag-and-drop
- **3-Tier Classification** — Phishing 🔴 / Suspicious 🟡 / Legitimate 🟢 with confidence score
- **Heuristic Explainer** — 9 detectors explain *why* an email was flagged
- **Scan History Dashboard** — Filterable table with stats, modal detail view, and delete support
- **User Authentication** — Sign in, register, or continue as guest
- **No External Dependencies** — Runs fully locally with just Python and a browser

---

## 🧠 How It Works

```
Email Input → TF-IDF Vectorization → Naive Bayes Model → Confidence Score
                                                              ↓
                                               Heuristic Explainer Engine
                                                              ↓
                                              Risk Reasons + Prevention Tips
```

### Classification Thresholds

| Phishing Probability | Label | Color |
|---|---|---|
| ≥ 75% | 🔴 Phishing | `#ef4444` |
| 45–74% | 🟡 Suspicious | `#f59e0b` |
| < 45% | 🟢 Legitimate | `#10b981` |

### Heuristic Detectors (9 Total)

| # | Detector | Example Triggers |
|---|---|---|
| 1 | Urgent / threatening language | `urgent`, `immediately`, `suspended` |
| 2 | Financial bait | `lottery`, `winner`, `prize`, `$` |
| 3 | Threat language | `legal action`, `arrest`, `lawsuit` |
| 4 | Credential harvesting | `click here`, `enter password`, `verify identity` |
| 5 | Brand impersonation | `PayPal`, `Amazon`, `Apple`, `IRS` |
| 6 | Suspicious attachments | `.exe`, `.zip`, `.js` |
| 7 | Raw IP address URLs | `http://192.168.x.x` |
| 8 | Shortened URLs | `bit.ly`, `tinyurl` |
| 9 | Generic salutations | `Dear Customer`, `Dear Account Holder` |

---

## 🗂️ Project Structure

```
safemail/
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── __init__.py             # App factory + frontend routing
│   ├── config.py               # Configuration
│   ├── db/                     # SQLAlchemy models + init
│   ├── ml/
│   │   ├── predictor.py        # ML inference
│   │   ├── preprocessor.py     # Text cleaning & TF-IDF
│   │   └── explainer.py        # Heuristic explanation engine
│   ├── routes/
│   │   ├── scan.py             # POST /api/scan
│   │   └── history.py          # GET /api/history
│   └── requirements.txt
├── frontend/
│   ├── index.html              # Home page
│   ├── dashboard.html          # Dashboard
│   ├── login.html              # Login / Register
│   ├── css/
│   │   ├── globals.css
│   │   ├── home.css
│   │   ├── dashboard.css
│   │   └── login.css
│   └── js/
│       ├── api.js
│       ├── home.js
│       ├── dashboard.js
│       └── login.js
├── setup.bat                   # Install dependencies
├── start.bat                   # Launch app
├── email_spam_nb.pkl           # Pre-trained Naive Bayes model
├── tfidf_vectorizer.pkl        # Trained TF-IDF vectorizer
└── Phishing_Email.csv          # 18,650 email training dataset
```

---

## ⚙️ ML Model Details

| Property | Value |
|---|---|
| Algorithm | Multinomial Naive Bayes |
| Feature Extraction | TF-IDF Vectorization |
| Training Dataset | 18,650 emails (`Phishing_Email.csv`) |
| Classification | Binary (phishing / legitimate) |
| Saved Models | `email_spam_nb.pkl`, `tfidf_vectorizer.pkl` |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- A modern web browser

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/dwivediadarsh496-commits/SafeMail-AI.git
cd SafeMail-AI

# 2. Install dependencies (Windows)
setup.bat

# Or manually:
pip install -r safemail/backend/requirements.txt
```

### Running the App

```bash
# Windows
start.bat

# Or manually:
python safemail/backend/app.py
```

Then open your browser and navigate to: **http://localhost:5000**

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scan` | Scan an email for phishing |
| `GET` | `/api/history` | Get scan history |
| `GET` | `/api/history/stats` | Get summary statistics |
| `DELETE` | `/api/history/<id>` | Delete a scan record |

### Example: Scan an Email

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Congratulations! You have won a $1,000 gift card. Click here to claim."}'
```

**Response:**
```json
{
  "label": "phishing",
  "confidence": 0.77,
  "reasons": ["Financial bait detected", "Credential harvesting link"],
  "recommendations": ["Do not click links", "Report to your email provider"]
}
```

### Example: Get Stats

```bash
curl http://localhost:5000/api/history/stats
```

**Response:**
```json
{
  "total": 42,
  "phishing": 18,
  "suspicious": 12,
  "legitimate": 12
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, SQLAlchemy, SQLite |
| ML | scikit-learn (Naive Bayes, TF-IDF) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Storage | SQLite (local) |

**Language breakdown:** CSS 38.7% · HTML 26.9% · JavaScript 23.4% · Python 9.5% · Jupyter Notebook 1.5%

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.

---

## 🙏 Acknowledgements

- Trained on a dataset of 18,650 phishing and legitimate emails
- Built as part of **GitHub DevDays 2026**
- Powered by scikit-learn's Multinomial Naive Bayes classifier

---

*SafeMail AI — Protecting users from cyber threats, one email at a time. 🛡️*
Author : Adarsh Dwivedi

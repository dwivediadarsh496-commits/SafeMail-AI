SafeMail AI — Completed Walkthrough
What Was Built
A full-stack, AI-powered phishing email detection web application — SafeMail AI — running entirely locally with no external dependencies beyond Python and a browser.

Application Screenshots
🏠 Home Page — http://localhost:5000
Dark cybersecurity theme (deep navy #060b18 + electric cyan + purple)
Animated shield SVG with pulsing rings
Dual-mode email input: Paste Email tab + Upload File (.txt/.eml) tab
Character counter, drag-and-drop upload zone
Large gradient Scan Email button with animated progress bar
"How SafeMail AI Works" 4-step grid
📊 Dashboard — http://localhost:5000/dashboard
4 stats cards (Total Scans, Phishing, Suspicious, Legitimate) with animated counters
Filterable history table (All / Phishing / Suspicious / Legitimate tabs)
Each row: color-coded badge + email preview + score bar + timestamp + View/Delete buttons
Detail modal with full reasons and recommendations
Skeleton loading state while fetching data
🔐 Login Page — http://localhost:5000/login
Split-screen layout: branded left panel (shield + feature list) + auth form right
Tabbed Sign In / Create Account toggle
Password strength indicator
"Continue as Guest" option
Agent Execution Summary
Agent	Status	Key Output
🧠 Agent 1	✅ Done	MultinomialNB model verified (binary), TF-IDF vectorizer trained on 18,650 emails, saved as tfidf_vectorizer.pkl
🎨 Agent 2	✅ Done	4 pages (Home, Dashboard, Login + result modal), pure HTML/CSS/JS, no Node.js needed
⚙️ Agent 3	✅ Done	Flask API with 5 routes, explanation engine with 9 heuristic detectors, SQLite history
🔗 Agent 4	✅ Done	Flask serves frontend at port 5000, start.bat + setup.bat created, E2E tested
API Test Results (All Passed ✅)
POST /api/scan  →  phishing email: label=phishing, confidence=77%
POST /api/scan  →  safe email:    label=suspicious, confidence=56.5%
GET  /api/history  →  2 records returned
GET  /api/history/stats  →  {total:2, phishing:1, suspicious:1, legitimate:0}
3-Tier Classification Logic
Phishing Probability	Label	Color
≥ 75%	🔴 Phishing	#ef4444 red
45–74%	🟡 Suspicious	#f59e0b amber
< 45%	🟢 Legitimate	#10b981 green
Heuristic Explanation Engine Detects
Urgent / threatening language (urgent, immediately, suspended)
Financial bait (lottery, winner, prize, $)
Threat language (legal action, arrest, lawsuit)
Credential harvesting (click here, enter password, verify identity)
Brand impersonation (PayPal, Amazon, Apple, IRS)
Suspicious attachments (.exe, .zip, .js)
Raw IP address URLs (http://192.168.x.x)
Shortened URLs (bit.ly, tinyurl)
Generic salutations (Dear Customer, Dear Account Holder)
Project Structure
d:\GITHUB DEVDAYS 2026\
├── safemail/
│   ├── backend/
│   │   ├── app.py               ← Flask entry point
│   │   ├── __init__.py          ← App factory + frontend routing
│   │   ├── config.py
│   │   ├── db/                  ← SQLAlchemy models + init
│   │   ├── ml/                  ← predictor, preprocessor, explainer
│   │   ├── routes/              ← scan.py, history.py
│   │   └── requirements.txt
│   ├── frontend/
│   │   ├── index.html           ← Home page
│   │   ├── dashboard.html       ← Dashboard
│   │   ├── login.html           ← Login / Register
│   │   ├── css/                 ← globals.css, home.css, dashboard.css, login.css
│   │   └── js/                  ← api.js, home.js, dashboard.js, login.js
│   ├── setup.bat                ← Install dependencies
│   └── start.bat                ← Launch app
├── email_spam_nb.pkl            ← Pre-trained Naive Bayes model
├── tfidf_vectorizer.pkl         ← Trained TF-IDF vectorizer (newly created)
└── Phishing_Email.csv           ← 18,650 email training dataset

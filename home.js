/* ═══════════════════════════════════════════════════════════════════
   SafeMail AI — Home Page Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── DOM refs ────────────────────────────────────────────────────────
  const tabPaste = document.getElementById("tabPaste");
  const tabUpload = document.getElementById("tabUpload");
  const pastePanel = document.getElementById("pastePanel");
  const uploadPanel = document.getElementById("uploadPanel");

  const emailTextarea = document.getElementById("emailTextarea");
  const charCounter = document.getElementById("charCounter");

  const uploadZone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  const fileSelected = document.getElementById("fileSelected");
  const fileName = document.getElementById("fileName");
  const clearFile = document.getElementById("clearFile");

  const inputError = document.getElementById("inputError");
  const scanBtn = document.getElementById("scanBtn");
  const scanBtnText = scanBtn.querySelector(".scan-btn-text");
  const scanBtnLoad = scanBtn.querySelector(".scan-btn-loading");
  const scanProgress = document.getElementById("scanProgress");
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");

  const resultModal = document.getElementById("resultModal");
  const closeModal = document.getElementById("closeModal");
  const resultBanner = document.getElementById("resultBanner");
  const resultIcon = document.getElementById("resultIcon");
  const resultTitle = document.getElementById("resultTitle");
  const resultSublabel = document.getElementById("resultSublabel");
  const gaugeFill = document.getElementById("gaugeFill");
  const gaugeText = document.getElementById("gaugeText");
  const reasonsList = document.getElementById("reasonsList");
  const noIssues = document.getElementById("noIssues");
  const suggestionsList = document.getElementById("suggestionsList");
  const scanAnotherBtn = document.getElementById("scanAnotherBtn");

  let selectedFile = null;
  let activeTab = "paste";

  // ── Tab switching ───────────────────────────────────────────────────
  tabPaste.addEventListener("click", () => switchTab("paste"));
  tabUpload.addEventListener("click", () => switchTab("upload"));

  function switchTab(tab) {
    activeTab = tab;
    if (tab === "paste") {
      tabPaste.classList.add("active");
      tabPaste.setAttribute("aria-selected", "true");
      tabUpload.classList.remove("active");
      tabUpload.setAttribute("aria-selected", "false");
      pastePanel.hidden = false;
      uploadPanel.hidden = true;
    } else {
      tabUpload.classList.add("active");
      tabUpload.setAttribute("aria-selected", "true");
      tabPaste.classList.remove("active");
      tabPaste.setAttribute("aria-selected", "false");
      uploadPanel.hidden = false;
      pastePanel.hidden = true;
    }
    hideError();
  }

  // ── Character counter ───────────────────────────────────────────────
  emailTextarea.addEventListener("input", () => {
    const len = emailTextarea.value.length;
    charCounter.textContent = `${len.toLocaleString()} / 50,000`;
    charCounter.style.color = len > 45000 ? "var(--warn)" : "var(--text-muted)";
    hideError();
  });

  // ── File upload ─────────────────────────────────────────────────────
  fileInput.addEventListener("change", handleFileChange);

  uploadZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") fileInput.click();
  });

  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) applyFile(file);
  });

  clearFile.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    fileSelected.hidden = true;
    uploadZone.hidden = false;
    hideError();
  });

  function handleFileChange() {
    const file = fileInput.files[0];
    if (file) applyFile(file);
  }

  function applyFile(file) {
    const allowed = [".txt", ".eml"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      showError("Only .txt and .eml files are supported.");
      return;
    }
    selectedFile = file;
    fileName.textContent = file.name;
    fileSelected.hidden = false;
    uploadZone.hidden = true;
    hideError();
  }

  // ── Error helpers ───────────────────────────────────────────────────
  function showError(msg) {
    inputError.textContent = "⚠️ " + msg;
    inputError.hidden = false;
  }

  function hideError() {
    inputError.hidden = true;
    inputError.textContent = "";
  }

  // ── Progress simulation ─────────────────────────────────────────────
  const PROGRESS_STEPS = [
    [10, "Preprocessing email text..."],
    [30, "Running TF-IDF vectorization..."],
    [55, "Running Naive Bayes model..."],
    [75, "Analyzing threat patterns..."],
    [90, "Generating recommendations..."],
    [98, "Finalizing results..."],
  ];

  let progressTimer = null;

  function startProgress() {
    scanProgress.hidden = false;
    let step = 0;
    progressFill.style.width = "0%";
    progressLabel.textContent = "Initializing ML model...";

    progressTimer = setInterval(() => {
      if (step < PROGRESS_STEPS.length) {
        const [pct, label] = PROGRESS_STEPS[step];
        progressFill.style.width = pct + "%";
        progressLabel.textContent = label;
        step++;
      }
    }, 280);
  }

  function stopProgress() {
    clearInterval(progressTimer);
    progressFill.style.width = "100%";
    setTimeout(() => { scanProgress.hidden = true; }, 400);
  }

  // ── Gauge animation ─────────────────────────────────────────────────
  function animateGauge(score, label) {
    const ARC_LENGTH = 251.2;
    const offset = ARC_LENGTH - (ARC_LENGTH * score) / 100;

    // Color by label
    const colors = {
      phishing: "#ef4444",
      suspicious: "#f59e0b",
      legitimate: "#10b981",
    };
    const color = colors[label] || "#00d4ff";
    gaugeFill.style.stroke = color;

    // Animate
    let current = 0;
    const target = score;
    const step = target / 40;
    let frame = 0;

    gaugeFill.style.strokeDashoffset = ARC_LENGTH;
    gaugeText.textContent = "0%";

    const ticker = setInterval(() => {
      current = Math.min(current + step, target);
      frame++;
      const off = ARC_LENGTH - (ARC_LENGTH * current) / 100;
      gaugeFill.style.strokeDashoffset = off;
      gaugeText.textContent = Math.round(current) + "%";
      if (current >= target) clearInterval(ticker);
    }, 25);
  }

  // ── Render result modal ─────────────────────────────────────────────
  const LABEL_META = {
    legitimate: {
      icon: "✅",
      title: "LEGITIMATE",
      subtitle: "This email appears safe based on our analysis.",
      bannerClass: "banner-safe",
    },
    suspicious: {
      icon: "⚠️",
      title: "SUSPICIOUS",
      subtitle: "Exercise caution — this email shows warning signs.",
      bannerClass: "banner-suspicious",
    },
    phishing: {
      icon: "🚨",
      title: "PHISHING DETECTED",
      subtitle: "High risk! Do not click links or share personal information.",
      bannerClass: "banner-phishing",
    },
  };

  function renderResult(data) {
    const meta = LABEL_META[data.label] || LABEL_META.suspicious;

    // Banner
    resultBanner.className = `result-banner ${meta.bannerClass}`;
    resultIcon.textContent = meta.icon;
    resultTitle.textContent = meta.title;
    resultSublabel.textContent = meta.subtitle;

    // Gauge
    animateGauge(data.confidence, data.label);

    // Reasons
    reasonsList.innerHTML = "";
    if (data.reasons && data.reasons.length > 0) {
      noIssues.hidden = true;
      data.reasons.forEach((r, i) => {
        const li = document.createElement("li");
        li.className = "issue-item";
        li.style.animationDelay = `${i * 60}ms`;
        li.textContent = r;
        reasonsList.appendChild(li);
      });
    } else {
      noIssues.hidden = false;
    }

    // Suggestions
    suggestionsList.innerHTML = "";
    (data.suggestions || []).forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.style.animationDelay = `${i * 60}ms`;
      card.textContent = s;
      suggestionsList.appendChild(card);
    });

    // Show modal
    resultModal.hidden = false;
    document.body.style.overflow = "hidden";
    resultModal.focus();
  }

  // ── Close modal ─────────────────────────────────────────────────────
  function closeResultModal() {
    resultModal.hidden = true;
    document.body.style.overflow = "";
  }

  closeModal.addEventListener("click", closeResultModal);
  scanAnotherBtn.addEventListener("click", closeResultModal);
  resultModal.addEventListener("click", (e) => {
    if (e.target === resultModal) closeResultModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resultModal.hidden) closeResultModal();
  });

  // ── Main scan handler ───────────────────────────────────────────────
  scanBtn.addEventListener("click", handleScan);

  async function handleScan() {
    hideError();

    // Validate input
    if (activeTab === "paste") {
      const text = emailTextarea.value.trim();
      if (!text) { showError("Please paste some email content before scanning."); return; }
      if (text.length < 10) { showError("Email content is too short to analyze."); return; }
    } else {
      if (!selectedFile) { showError("Please upload a .txt or .eml file before scanning."); return; }
    }

    // Show loading state
    scanBtn.disabled = true;
    scanBtnText.hidden = true;
    scanBtnLoad.hidden = false;
    startProgress();

    try {
      let result;
      if (activeTab === "paste") {
        result = await api.scan(emailTextarea.value.trim(), null);
      } else {
        result = await api.scan(null, selectedFile);
      }

      stopProgress();
      renderResult(result);

      // Update stat counter in hero
      const statTotal = document.getElementById("stat-total");
      if (statTotal) {
        const current = parseInt(statTotal.textContent.replace(/[^0-9]/g, ""), 10) || 18650;
        statTotal.textContent = (current + 1).toLocaleString() + "+";
      }

    } catch (err) {
      stopProgress();
      console.error("Scan error:", err);
      showError("Could not reach the backend. Make sure the Flask server is running on port 5000.");
    } finally {
      scanBtn.disabled = false;
      scanBtnText.hidden = false;
      scanBtnLoad.hidden = true;
    }
  }

  // ── Mobile nav toggle ───────────────────────────────────────────────
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
    });
  }

})();

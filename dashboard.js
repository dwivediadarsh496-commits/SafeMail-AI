/* ═══════════════════════════════════════════════════════════════════
   SafeMail AI — Dashboard Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── DOM refs ────────────────────────────────────────────────────────
  const statTotal     = document.getElementById("statTotal");
  const statPhishing  = document.getElementById("statPhishing");
  const statSuspicious= document.getElementById("statSuspicious");
  const statSafe      = document.getElementById("statSafe");

  const filterTabs    = document.querySelectorAll(".filter-tab");
  const tableLoading  = document.getElementById("tableLoading");
  const tableEmpty    = document.getElementById("tableEmpty");
  const historyTable  = document.getElementById("historyTable");
  const historyBody   = document.getElementById("historyBody");

  const detailModal   = document.getElementById("detailModal");
  const closeDetail   = document.getElementById("closeDetail");
  const detailBanner  = document.getElementById("detailBanner");
  const detailIcon    = document.getElementById("detailIcon");
  const detailTitle   = document.getElementById("detailTitle");
  const detailSublabel= document.getElementById("detailSublabel");
  const detailPreview = document.getElementById("detailPreview");
  const detailReasons = document.getElementById("detailReasons");
  const detailNoIssues= document.getElementById("detailNoIssues");
  const detailSuggestions= document.getElementById("detailSuggestions");

  let allRecords = [];
  let activeFilter = "all";

  // ── Label helpers ───────────────────────────────────────────────────
  const LABEL_META = {
    legitimate: { icon: "✅", text: "SAFE",       color: "var(--safe)",   bannerClass: "banner-safe" },
    suspicious: { icon: "⚠️", text: "SUSPICIOUS", color: "var(--warn)",   bannerClass: "banner-suspicious" },
    phishing:   { icon: "🚨", text: "PHISHING",   color: "var(--danger)", bannerClass: "banner-phishing" },
  };

  function getMeta(label) {
    return LABEL_META[label] || LABEL_META.suspicious;
  }

  function makeBadge(label) {
    const m = getMeta(label);
    const span = document.createElement("span");
    span.className = `badge badge-${label === "legitimate" ? "safe" : label}`;
    span.textContent = m.text;
    return span;
  }

  // ── Format timestamp ────────────────────────────────────────────────
  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  // ── Animate counter ─────────────────────────────────────────────────
  function animateCount(el, target) {
    let start = 0;
    const step = Math.ceil(target / 30);
    const tick = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start;
      if (start >= target) clearInterval(tick);
    }, 30);
  }

  // ── Load stats ──────────────────────────────────────────────────────
  async function loadStats() {
    try {
      const s = await api.getStats();
      animateCount(statTotal, s.total);
      animateCount(statPhishing, s.phishing);
      animateCount(statSuspicious, s.suspicious);
      animateCount(statSafe, s.legitimate);
    } catch (e) {
      console.warn("Could not load stats:", e);
      [statTotal, statPhishing, statSuspicious, statSafe].forEach(el => el.textContent = "0");
    }
  }

  // ── Load history ────────────────────────────────────────────────────
  async function loadHistory() {
    tableLoading.hidden = false;
    tableEmpty.hidden = true;
    historyTable.hidden = true;

    try {
      allRecords = await api.getHistory();
      renderTable(allRecords);
    } catch (e) {
      console.warn("Could not load history:", e);
      allRecords = [];
      renderTable([]);
    }
  }

  function renderTable(records) {
    tableLoading.hidden = true;
    historyBody.innerHTML = "";

    const filtered = activeFilter === "all"
      ? records
      : records.filter(r => r.label === activeFilter);

    if (filtered.length === 0) {
      tableEmpty.hidden = false;
      historyTable.hidden = true;
      return;
    }

    tableEmpty.hidden = true;
    historyTable.hidden = false;

    filtered.forEach((rec, i) => {
      const tr = document.createElement("tr");
      tr.style.animationDelay = `${i * 30}ms`;

      const m = getMeta(rec.label);
      const scoreColor = m.color;
      const scoreW = Math.round(rec.confidence) + "%";

      tr.innerHTML = `
        <td class="cell-status"></td>
        <td class="cell-preview" title="${escHtml(rec.email_preview)}">${escHtml(rec.email_preview)}</td>
        <td class="cell-score">
          <div class="score-bar-wrap">
            <div class="score-bar">
              <div class="score-fill" style="width:${scoreW};background:${scoreColor}"></div>
            </div>
            <span class="score-value">${rec.confidence}%</span>
          </div>
        </td>
        <td class="cell-timestamp">${formatTime(rec.timestamp)}</td>
        <td class="cell-actions">
          <button class="btn-icon view-btn" title="View details" data-id="${rec.scan_id}" aria-label="View details for scan ${rec.scan_id}">👁️</button>
          <button class="btn-icon delete-btn" title="Delete" data-id="${rec.scan_id}" aria-label="Delete scan ${rec.scan_id}">🗑️</button>
        </td>
      `;

      // Insert badge
      tr.querySelector(".cell-status").appendChild(makeBadge(rec.label));

      // View button
      tr.querySelector(".view-btn").addEventListener("click", () => openDetail(rec));

      // Delete button
      tr.querySelector(".delete-btn").addEventListener("click", () => deleteRecord(rec.scan_id));

      historyBody.appendChild(tr);
    });
  }

  function escHtml(str) {
    return String(str || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  // ── Delete ──────────────────────────────────────────────────────────
  async function deleteRecord(scanId) {
    console.log("deleteRecord called for scanId:", scanId);
    if (!confirm("Are you sure you want to delete this scan record?")) return;
    try {
      await api.deleteRecord(scanId);
      console.log("api.deleteRecord succeeded");
      allRecords = allRecords.filter(r => r.scan_id !== scanId);
      renderTable(allRecords);
      loadStats(); // refresh counts
    } catch (e) {
      console.error("deleteRecord error:", e);
      alert("Could not delete record. Try again.");
    }
  }

  // ── Detail modal ────────────────────────────────────────────────────
  const SUBLABELS = {
    legitimate: "This email appears safe based on our analysis.",
    suspicious: "Exercise caution — this email shows warning signs.",
    phishing:   "High risk! Do not click links or share personal information.",
  };

  function openDetail(rec) {
    const m = getMeta(rec.label);
    detailBanner.className = `result-banner ${m.bannerClass}`;
    detailIcon.textContent = m.icon;
    detailTitle.textContent = m.text;
    detailSublabel.textContent = SUBLABELS[rec.label] || "";

    detailPreview.textContent = rec.email_preview || "(no preview)";

    // Reasons
    detailReasons.innerHTML = "";
    if (rec.reasons && rec.reasons.length > 0) {
      detailNoIssues.hidden = true;
      rec.reasons.forEach(r => {
        const li = document.createElement("li");
        li.className = "issue-item";
        li.textContent = r;
        detailReasons.appendChild(li);
      });
    } else {
      detailNoIssues.hidden = false;
    }

    // Suggestions
    detailSuggestions.innerHTML = "";
    (rec.suggestions || []).forEach(s => {
      const card = document.createElement("div");
      card.className = "suggestion-card";
      card.textContent = s;
      detailSuggestions.appendChild(card);
    });

    detailModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeDetailModal() {
    detailModal.hidden = true;
    document.body.style.overflow = "";
  }

  closeDetail.addEventListener("click", closeDetailModal);
  detailModal.addEventListener("click", e => { if (e.target === detailModal) closeDetailModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !detailModal.hidden) closeDetailModal(); });

  // ── Filters ─────────────────────────────────────────────────────────
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected","false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected","true");
      activeFilter = tab.dataset.filter;
      renderTable(allRecords);
    });
  });

  // ── Mobile nav ──────────────────────────────────────────────────────
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────
  loadStats();
  loadHistory();

})();

/* ═══════════════════════════════════════════════════════════════════
   SafeMail AI — Login Page Logic
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Tab switching ───────────────────────────────────────────────────
  const tabSignIn  = document.getElementById("tabSignIn");
  const tabRegister= document.getElementById("tabRegister");
  const signInForm = document.getElementById("signInForm");
  const registerForm= document.getElementById("registerForm");

  tabSignIn.addEventListener("click", () => {
    tabSignIn.classList.add("active"); tabSignIn.setAttribute("aria-selected","true");
    tabRegister.classList.remove("active"); tabRegister.setAttribute("aria-selected","false");
    signInForm.hidden = false;
    registerForm.hidden = true;
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active"); tabRegister.setAttribute("aria-selected","true");
    tabSignIn.classList.remove("active"); tabSignIn.setAttribute("aria-selected","false");
    registerForm.hidden = false;
    signInForm.hidden = true;
  });

  // ── Password visibility toggles ─────────────────────────────────────
  function setupToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "🙈" : "👁";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  }

  setupToggle("toggleSignInPw", "signInPassword");
  setupToggle("toggleRegPw", "regPassword");

  // ── Password strength ───────────────────────────────────────────────
  const regPassword = document.getElementById("regPassword");
  const pwStrength  = document.getElementById("pwStrength");

  if (regPassword && pwStrength) {
    regPassword.addEventListener("input", () => {
      const val = regPassword.value;
      let score = 0;
      if (val.length >= 8)           score++;
      if (/[A-Z]/.test(val))         score++;
      if (/[0-9]/.test(val))         score++;
      if (/[^A-Za-z0-9]/.test(val))  score++;

      const labels = ["", "Weak", "Fair", "Good", "Strong"];
      const colors = ["", "var(--danger)", "var(--warn)", "#60a5fa", "var(--safe)"];

      pwStrength.textContent = val.length === 0 ? "" : `Password strength: ${labels[score]}`;
      pwStrength.style.color = colors[score] || "var(--text-muted)";
    });
  }

  // ── Form helpers ────────────────────────────────────────────────────
  function setLoading(btn, loading) {
    const text = btn.querySelector(".submit-text");
    const load = btn.querySelector(".submit-loading");
    btn.disabled = loading;
    if (text) text.hidden = loading;
    if (load) load.hidden = !loading;
  }

  function showFormError(errorEl, msg) {
    errorEl.textContent = "⚠️ " + msg;
    errorEl.hidden = false;
  }

  function showFormSuccess(successEl, msg) {
    successEl.textContent = "✅ " + msg;
    successEl.hidden = false;
  }

  function hideFormMessages(errorEl, successEl) {
    if (errorEl)  { errorEl.hidden = true; errorEl.textContent = ""; }
    if (successEl){ successEl.hidden = true; successEl.textContent = ""; }
  }

  // ── Sign In (mock — no server auth) ────────────────────────────────
  const signInBtn  = document.getElementById("signInBtn");
  const signInError= document.getElementById("signInError");

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFormMessages(signInError, null);
    const email = document.getElementById("signInEmail").value.trim();
    const pass  = document.getElementById("signInPassword").value;

    if (!email || !pass) { showFormError(signInError, "Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormError(signInError, "Please enter a valid email address."); return; }

    setLoading(signInBtn, true);
    await new Promise(r => setTimeout(r, 1200)); // Simulate API call
    setLoading(signInBtn, false);

    // Mock: any credentials succeed
    alert("✅ Welcome back! (Note: Login is a demo feature — no real auth server)");
    window.location.href = "dashboard.html";
  });

  // ── Register (mock) ─────────────────────────────────────────────────
  const regBtn    = document.getElementById("regBtn");
  const regError  = document.getElementById("regError");
  const regSuccess= document.getElementById("regSuccess");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFormMessages(regError, regSuccess);

    const name  = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass  = document.getElementById("regPassword").value;

    if (!name || !email || !pass) { showFormError(regError, "Please fill in all fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormError(regError, "Please enter a valid email address."); return; }
    if (pass.length < 8) { showFormError(regError, "Password must be at least 8 characters."); return; }

    setLoading(regBtn, true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(regBtn, false);

    showFormSuccess(regSuccess, `Account created for ${name}! (Demo mode — no persistence)`);
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
  });

})();

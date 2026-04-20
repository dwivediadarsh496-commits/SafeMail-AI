/* ═══════════════════════════════════════════════════════════════════
   SafeMail AI — API Service
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = "";

const api = {
  /**
   * Scan email content (text or file).
   * @param {string|null} text - Pasted email text
   * @param {File|null} file  - Uploaded file
   */
  async scan(text = null, file = null) {
    if (file) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE}/api/scan`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
    const res = await fetch(`${API_BASE}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_text: text }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  /** Get scan history */
  async getHistory() {
    const res = await fetch(`${API_BASE}/api/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
  },

  /** Delete a scan record by ID */
  async deleteRecord(scanId) {
    const res = await fetch(`${API_BASE}/api/history/${scanId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete record");
    return res.json();
  },

  /** Get dashboard stats */
  async getStats() {
    const res = await fetch(`${API_BASE}/api/history/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },
};

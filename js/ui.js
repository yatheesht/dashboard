/* UI helpers: sidebar, modal, toast, tabs, topbar — superset Track A + Track B */
(function () {
  const NAV = [
    { id: "overview", label: "Overview", href: "index.html", ico: "◧" },
    { id: "academics", label: "Academics", href: "academics.html", ico: "▦" },
    { id: "projects", label: "Projects", href: "projects.html", ico: "◈" },
    { id: "practice", label: "Practice", href: "practice.html", ico: "⬣" },
    { id: "achievements", label: "Achievements", href: "achievements.html", ico: "★" },
    { id: "settings", label: "Settings", href: "settings.html", ico: "⚙" }
  ];
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function initials(name) {
    return String(name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }
  function avatarStyle(hue) {
    return `background:linear-gradient(135deg,hsl(${hue} 70% 42%),hsl(${(hue + 40) % 360} 70% 55%))`;
  }
  function ensureRoots() {
    let m = document.getElementById("modal-root");
    if (!m) { m = document.createElement("div"); m.id = "modal-root"; document.body.appendChild(m); }
    let t = document.getElementById("toast-root");
    if (!t) { t = document.createElement("div"); t.id = "toast-root"; document.body.appendChild(t); }
    return { m, t };
  }
  function closeModal() {
    const m = document.getElementById("modal-root");
    if (m) m.innerHTML = "";
  }
  function confetti(n = 20) {
    try {
      const t = ensureRoots().t;
      const d = document.createElement("div");
      d.className = "toast";
      d.textContent = "🎉 " + "✦".repeat(Math.min(3, Math.max(1, Math.round(n / 10))));
      t.appendChild(d);
      setTimeout(() => d.remove(), 1200);
    } catch {}
  }
  const UI = {
    esc, initials, NAV, closeModal, confetti,
    sidebar(active) {
      const el = document.getElementById("sidebar");
      if (!el) return;
      let s = {};
      try { s = (window.Store ? Store.all() : (window.SEED || {})).student || (window.SEED || {}).student || {}; }
      catch { s = (window.SEED || {}).student || {}; }
      const pct = Math.min(100, Math.round(((s.xp || 0) % 2000) / 20));
      el.innerHTML = `
        <div class="brand">
          <img src="assets/logo.svg" alt="Open Dashboard" width="32" height="32" style="border-radius:10px" />
          <div><b>open dashboard</b><small>ALL-IN-ONE • DEMO</small></div>
        </div>
        <nav class="nav">
          ${NAV.map(n => `<a href="${n.href}" data-nav="${n.id}" class="${n.id === active ? "active" : ""}"><span class="ico">${n.ico}</span>${n.label}</a>`).join("")}
        </nav>
        <div class="side-card">
          <div class="eyebrow" style="color:#B9B2B5">level ${esc(s.level || 12)} — ${esc(s.xp || 0)} xp</div>
          <div style="font-weight:700;margin-top:4px">Keep the streak alive.</div>
          <div class="bar"><i style="width:${pct}%"></i></div>
          <div class="mono" style="font-size:11px;margin-top:8px;color:#B9B2B5">${pct}% to next level • 🔥 ${esc(s.streak || 0)} days</div>
        </div>`;
    },
    // Supports Track A: topbar({searchPlaceholder, onSearch})
    // and Track B: topbar("Title", "subtitle")
    topbar(a, b) {
      const el = document.getElementById("topbar");
      if (!el) return;
      let s = {};
      try { s = (window.Store ? Store.all() : {}).student || {}; } catch { s = {}; }
      let opts = {};
      let title = "", subtitle = "";
      if (typeof a === "string") { title = a; subtitle = b || ""; }
      else if (a && typeof a === "object") { opts = a; }
      const right = `
        <div style="flex:1"></div>
        <span class="pill">🔥 ${esc(s.streak ?? (window.SEED || {}).student?.streak ?? 0)} day streak</span>
        <span class="pill soft">✦ ${esc(s.xp ?? (window.SEED || {}).student?.xp ?? 0)} XP</span>
        <div class="avatar" title="${esc(s.name || "")}" style="${avatarStyle(s.avatarHue ?? 345)}">${esc(initials(s.name))}</div>`;
      if (title) {
        el.innerHTML = `
          <div style="min-width:0"><div class="eyebrow">open dashboard — ${esc(title.toLowerCase())}</div>
          <div style="font-weight:800;font-size:17px;letter-spacing:-.02em">${esc(title)} <span class="muted" style="font-weight:500;font-size:13px">${esc(subtitle)}</span></div></div>${right}`;
      } else {
        el.innerHTML = `
          <div class="topbar-search"><span class="faint">⌕</span><input id="global-search" placeholder="${esc(opts.searchPlaceholder || "Search courses, projects, certs…")}" /></div>${right}`;
        const inp = el.querySelector("#global-search");
        if (inp && opts.onSearch) inp.addEventListener("input", e => opts.onSearch(e.target.value));
      }
    },
    modal(html) {
      ensureRoots();
      const root = document.getElementById("modal-root");
      root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog">${html}</div></div>`;
      const back = root.querySelector(".modal-back");
      function close() { root.innerHTML = ""; document.removeEventListener("keydown", onKey); }
      function onKey(e) { if (e.key === "Escape") close(); }
      document.addEventListener("keydown", onKey);
      back.addEventListener("click", e => { if (e.target === back || e.target.closest("[data-close]")) close(); });
      return close;
    },
    toast(msg) {
      ensureRoots();
      const root = document.getElementById("toast-root");
      const d = document.createElement("div");
      d.className = "toast";
      d.innerHTML = `<span>✦</span><span></span>`;
      d.lastChild.textContent = msg;
      root.appendChild(d);
      setTimeout(() => { d.style.opacity = "0"; d.style.transition = "opacity .3s"; setTimeout(() => d.remove(), 320); }, 2600);
    },
    tabs(el, { tabs, active, onChange }) {
      if (!el) return;
      el.className = "tabs";
      el.innerHTML = tabs.map(t => `<button class="tab ${t.id === active ? "active" : ""}" data-tab="${t.id}">${esc(t.label)}</button>`).join("");
      el.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => {
        el.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        onChange && onChange(b.dataset.tab);
      }));
    }
  };
  window.UI = UI;
})();

/* Settings page */
(function () {
  UI.sidebar("settings");
  UI.topbar({ searchPlaceholder: "Settings…" });
  const root = document.getElementById("view-root");
  const s = Store.all().student;
  const hues = [345, 265, 210, 160, 25, 45, 0];

  root.innerHTML = `
    <div class="eyebrow">tnkr.ai — settings</div>
    <h1 style="font-size:30px;margin:4px 0 16px">Profile settings.</h1>
    <div class="grid two">
      <div class="card">
        <div class="eyebrow">profile</div><h3>Edit details</h3>
        <label class="lbl">Name</label><input class="input" id="f-name" value="${UI.esc(s.name)}" />
        <label class="lbl">Email</label><input class="input" id="f-email" value="${UI.esc(s.email)}" />
        <label class="lbl">University</label><input class="input" id="f-uni" value="${UI.esc(s.uni)}" />
        <label class="lbl">Semester</label>
        <select class="input" id="f-sem">${["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"].map(o => `<option ${o === s.sem ? "selected" : ""}>${o}</option>`).join("")}</select>
        <label class="lbl">Bio</label><textarea class="input" id="f-bio" rows="3">${UI.esc(s.bio)}</textarea>
        <label class="lbl">Avatar hue</label>
        <div class="hue-row" id="hues">${hues.map(h => `<div class="hue ${h === s.avatarHue ? "active" : ""}" data-hue="${h}" style="background:hsl(${h} 70% 50%)"></div>`).join("")}</div>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn primary" id="save">Save changes</button>
          <button class="btn ghost" id="reset-view">Preview reset</button>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr;align-content:start">
        <div class="card">
          <div class="eyebrow">danger zone</div><h3>Demo data</h3>
          <p class="muted" style="font-size:14px;margin:6px 0 12px">Reset restores Aarav Mehta seed. Export downloads your current JSON.</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn dark sm" id="reset">Reset Demo</button>
            <button class="btn sm" id="export">⤓ Export JSON</button>
          </div>
        </div>
        <div class="card">
          <div class="eyebrow">live preview</div><h3>How you'll appear</h3>
          <div class="list-row"><div class="avatar" id="prev-av" style="background:hsl(${s.avatarHue} 70% 45%)">${UI.esc(UI.initials(s.name))}</div>
          <div><div id="prev-name" style="font-weight:700">${UI.esc(s.name)}</div><div class="faint" id="prev-sub" style="font-size:13px">${UI.esc(s.email)} • ${UI.esc(s.uni)}</div></div></div>
        </div>
      </div>
    </div>`;

  let hue = s.avatarHue;
  document.getElementById("hues").addEventListener("click", e => {
    const h = e.target.closest("[data-hue]");
    if (!h) return;
    hue = +h.dataset.hue;
    document.querySelectorAll(".hue").forEach(x => x.classList.toggle("active", x === h));
    document.getElementById("prev-av").style.background = `hsl(${hue} 70% 45%)`;
  });
  ["f-name", "f-email", "f-uni"].forEach(id => document.getElementById(id).addEventListener("input", syncPreview));
  function syncPreview() {
    document.getElementById("prev-name").textContent = document.getElementById("f-name").value || "—";
    document.getElementById("prev-sub").textContent = `${document.getElementById("f-email").value} • ${document.getElementById("f-uni").value}`;
    document.getElementById("prev-av").textContent = UI.initials(document.getElementById("f-name").value);
  }
  document.getElementById("save").addEventListener("click", () => {
    Store.set("student.name", document.getElementById("f-name").value.trim() || s.name);
    Store.set("student.email", document.getElementById("f-email").value.trim() || s.email);
    Store.set("student.uni", document.getElementById("f-uni").value.trim() || s.uni);
    Store.set("student.sem", document.getElementById("f-sem").value);
    Store.set("student.bio", document.getElementById("f-bio").value.trim());
    Store.set("student.avatarHue", hue);
    UI.sidebar("settings"); UI.topbar({});
    UI.toast("Profile saved");
  });
  document.getElementById("reset").addEventListener("click", () => {
    Store.reset(); location.reload();
  });
  document.getElementById("reset-view").addEventListener("click", () => UI.toast("Reset restores seed — use Reset Demo to apply"));
  document.getElementById("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(Store.all(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "student-dashboard.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    UI.toast("Exported JSON");
  });
})();

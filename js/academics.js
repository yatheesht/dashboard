/* Academics page */
(function () {
  UI.sidebar("academics");
  UI.topbar({ searchPlaceholder: "Search marks table…" });

  const root = document.getElementById("view-root");
  const data = Store.all();
  let activeSem = data.semesters[data.semesters.length - 1].id;
  let query = "", gradeFilter = "All";

  root.innerHTML = `
    <div class="eyebrow">tnkr.ai — academics</div>
    <h1 style="font-size:30px;margin:4px 0 16px">Marks & transcripts.</h1>
    <div class="grid sidebar-split">
      <div class="card">
        <div class="card-head"><div><div class="eyebrow">semesters</div><h3>Select term</h3></div>
          <button class="btn primary sm" id="upload-btn">⇪ Upload marksheet</button></div>
        <div id="sem-tabs"></div>
        <div class="search-row" style="margin-top:12px">
          <input class="input" id="marks-search" placeholder="Search code / subject…" />
          <select class="input" id="grade-filter" style="max-width:150px">
            <option>All</option><option>A+</option><option>A</option><option>A-</option><option>B+</option><option>B</option>
          </select>
        </div>
        <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Code</th><th>Subject</th><th>Credits</th><th>Marks</th><th>Grade</th><th>Status</th></tr></thead><tbody id="marks-body"></tbody></table></div>
        <div id="pending-note" style="margin-top:10px"></div>
      </div>
      <div class="grid" style="grid-template-columns:1fr;align-content:start">
        <div class="card" style="text-align:center">
          <div class="eyebrow">semester gpa</div>
          <canvas id="gpa-donut" style="width:100%;height:200px"></canvas>
          <div class="mono faint" style="font-size:11.5px;margin-top:6px" id="donut-sub"></div>
        </div>
        <div class="card">
          <div class="eyebrow">cgpa</div>
          <h3 style="font-size:26px">${Store.all().student.gpa} / 10</h3>
          <div class="progress accent" style="margin-top:10px"><i style="width:${(Store.all().student.gpa / 10) * 100}%"></i></div>
          <div class="muted" style="font-size:13px;margin-top:8px">Dean's list 3× • No backlogs • 76 credits done.</div>
        </div>
      </div>
    </div>`;

  const tabsEl = document.getElementById("sem-tabs");
  UI.tabs(tabsEl, {
    tabs: data.semesters.map(s => ({ id: s.id, label: s.id })),
    active: activeSem,
    onChange: id => { activeSem = id; render(); }
  });

  function sem() { return data.semesters.find(x => x.id === activeSem); }

  function render() {
    const s = sem();
    Charts.donut(document.getElementById("gpa-donut"), { value: s.gpa, max: 10, label: `/ 10 — ${s.id}` });
    document.getElementById("donut-sub").textContent = `${s.id} • ${s.courses.length} COURSES`;
    const rows = s.courses.filter(c => {
      const okQ = (c.code + " " + c.subject).toLowerCase().includes(query.toLowerCase());
      const okG = gradeFilter === "All" || c.grade === gradeFilter;
      return okQ && okG;
    });
    document.getElementById("marks-body").innerHTML = rows.map(c => `
      <tr><td class="mono"><b>${UI.esc(c.code)}</b></td><td>${UI.esc(c.subject)}</td><td class="mono">${UI.esc(c.credits)}</td>
      <td><b>${UI.esc(c.marks)}</b></td><td><span class="badge ${String(c.grade).startsWith("A") ? "g" : "n"}">${UI.esc(c.grade)}</span></td>
      <td><span class="badge g">${UI.esc(c.status)}</span></td></tr>`).join("") || `<tr><td colspan="6" class="muted">No rows match.</td></tr>`;
    const pend = Store.get("pendingUploads", []);
    document.getElementById("pending-note").innerHTML = pend.length
      ? `<div class="mono faint" style="font-size:12px">PENDING UPLOADS: ${pend.map(UI.esc).join(", ")}</div>` : "";
  }

  document.getElementById("marks-search").addEventListener("input", e => { query = e.target.value; render(); });
  document.getElementById("grade-filter").addEventListener("change", e => { gradeFilter = e.target.value; render(); });
  document.getElementById("upload-btn").addEventListener("click", () => {
    UI.modal(`
      <div class="eyebrow">upload marksheet — demo</div>
      <h3 style="margin:4px 0 8px">Park a marksheet file</h3>
      <p class="muted" style="font-size:14px">Demo mode: we only store the filename, no parsing.</p>
      <label class="lbl">Filename</label>
      <input class="input" id="ms-name" placeholder="e.g. sem5-marksheet.pdf" />
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">
        <button class="btn ghost sm" data-close>Cancel</button>
        <button class="btn primary sm" id="ms-save">Save (demo)</button>
      </div>`);
    document.getElementById("ms-save").addEventListener("click", () => {
      const v = (document.getElementById("ms-name").value || "marksheet.pdf").trim();
      Store.push("pendingUploads", v);
      document.getElementById("modal-root").innerHTML = "";
      UI.toast("Upload parked - demo mode");
      render();
    });
  });

  render();
})();

/* Overview page — body[data-page="overview"] */
(function () {
  const data = Store.all();
  const s = data.student;
  UI.sidebar("overview");
  UI.topbar({ searchPlaceholder: "Search courses…", onSearch: v => renderCourses(v) });

  const root = document.getElementById("view-root");
  const allCourses = data.semesters.flatMap(sem => sem.courses.map(c => ({ ...c, sem: sem.id })));

  root.innerHTML = `
    <div class="eyebrow">tnkr.ai — student overview</div>
    <h1 style="font-size:32px;margin:4px 0 16px">Good evening, ${UI.esc(s.name.split(" ")[0])}.</h1>

    <div class="card profile-hero">
      <div class="avatar-lg" style="background:linear-gradient(135deg,hsl(${s.avatarHue} 70% 42%),hsl(${(s.avatarHue + 40) % 360} 70% 55%))">${UI.esc(UI.initials(s.name))}</div>
      <div style="flex:1;min-width:0">
        <div class="eyebrow">profile</div>
        <h2 style="font-size:20px">${UI.esc(s.name)}</h2>
        <div class="muted" style="font-size:13.5px">${UI.esc(s.email)} • ${UI.esc(s.uni)} • ${UI.esc(s.major)} ’${UI.esc(String(s.gradYear).slice(2))}</div>
        <div class="muted" style="font-size:13.5px;margin-top:4px">${UI.esc(s.bio)}</div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <span class="pill dark">${UI.esc(s.sem)}</span>
          <span class="pill soft">CGPA ${UI.esc(s.gpa)} / 10</span>
          <span class="pill">🔥 ${UI.esc(s.streak)} days</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="kpi"><div class="eyebrow">gpa</div><b>${UI.esc(s.gpa)}</b></div>
        <div class="kpi"><div class="eyebrow">xp</div><b>${UI.esc((s.xp / 1000).toFixed(1))}k</b></div>
        <div class="kpi"><div class="eyebrow">streak</div><b>${UI.esc(s.streak)}d</b></div>
      </div>
    </div>

    <div class="grid sidebar-split" style="margin-top:16px">
      <div class="grid" style="grid-template-columns:1fr">
        <div class="card">
          <div class="card-head"><div><div class="eyebrow">academics</div><h3>Semester GPA trend</h3></div><a class="btn sm" href="academics.html">Open academics →</a></div>
          <canvas id="gpa-bars" style="width:100%;height:170px"></canvas>
          <div class="gpa-bars" id="gpa-fallback" style="display:none"></div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="eyebrow">courses</div><h3>All courses</h3></div><span class="mono faint" id="course-count"></span></div>
          <div class="search-row"><input class="input" id="course-search" placeholder="Filter by code or subject…" /></div>
          <div id="course-list"></div>
        </div>
      </div>
      <div class="grid" style="grid-template-columns:1fr;align-content:start">
        <div class="card">
          <div class="card-head"><div class="eyebrow">consistency</div></div></div>
          <h3>Mini heatmap</h3>
          <div id="heatmap"></div>
          <div id="mini-heatmap" style="display:none"></div>
          <div id="trackb-heatmap" style="display:none"></div>
          <div class="mono faint" style="font-size:11px;margin-top:8px">LAST 12 WEEKS • ${UI.esc(s.streak)} DAY STREAK</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="eyebrow">up next</div></div></div>
          <h3>Deadlines</h3>
          <div id="deadlines">${data.deadlines.map(d => `
            <div class="list-row">
              <span class="dot" style="background:${d.priority === "High" ? "var(--accent)" : d.priority === "Med" ? "#D99A00" : "#B9B2B5"}"></span>
              <div style="flex:1"><div style="font-weight:650;font-size:14px">${UI.esc(d.title)}</div><div class="faint mono" style="font-size:11.5px">${UI.esc(d.course)} • due ${UI.esc(d.due)}</div></div>
              <span class="badge ${d.priority === "High" ? "a" : "n"}">${UI.esc(d.priority)}</span>
            </div>`).join("")}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="eyebrow">credentials</div></div></div>
          <h3>Recent certs</h3>
          ${data.certs.slice(0, 3).map(c => `
            <div class="list-row"><div style="flex:1"><div style="font-weight:650;font-size:14px">${UI.esc(c.title)}</div><div class="faint" style="font-size:12.5px">${UI.esc(c.issuer)} • ${UI.esc(c.date)}</div></div><span class="badge g">✓</span></div>`).join("")}
        </div>
        <div class="card">
          <div class="card-head"><div><div class="eyebrow">spotlight</div></div><a class="mono faint" style="font-size:12px" href="projects.html">view all →</a></div>
          <h3>Top projects</h3>
          ${data.projects.slice(0, 2).map(p => `
            <div style="padding:10px 0;border-bottom:1px solid var(--line-soft)">
              <div style="font-weight:700">${UI.esc(p.title)}</div>
              <div class="muted" style="font-size:13px">${UI.esc(p.desc)}</div>
              <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">${p.stack.map(t => `<span class="stack-tag">${UI.esc(t)}</span>`).join("")}<span class="stack-tag">★ ${UI.esc(p.stars)}</span></div>
            </div>`).join("")}
        </div>
      </div>
    </div>`;

  const series = Array.isArray(data.activity) ? data.activity : (Array.isArray(data.activitySeries) ? data.activitySeries : Object.values(data.activity || {}));
  Charts.bars(document.getElementById("gpa-bars"), {
    labels: data.semesters.map(x => x.id),
    values: data.semesters.map(x => x.gpa)
  });
  Charts.heatmap(document.getElementById("heatmap"), series.slice(-60));
  // compat mirrors for Track B
  Charts.heatmap(document.getElementById("mini-heatmap"), series.slice(-60));
  Charts.heatmap(document.getElementById("trackb-heatmap"), series.slice(-60));

  function renderCourses(q = "") {
    q = q.toLowerCase();
    const list = allCourses.filter(c => (c.code + " " + c.subject).toLowerCase().includes(q));
    document.getElementById("course-count").textContent = list.length + " courses";
    document.getElementById("course-list").innerHTML = list.map(c => `
      <div class="list-row">
        <span class="badge n">${UI.esc(c.code)}</span>
        <div style="flex:1"><div style="font-weight:600;font-size:14px">${UI.esc(c.subject)}</div><div class="faint mono" style="font-size:11.5px">${UI.esc(c.sem)} • ${UI.esc(c.credits)} cr</div></div>
        <span class="badge ${String(c.grade).includes("A") ? "g" : "n"}">${UI.esc(c.grade)} • ${UI.esc(c.marks)}</span>
      </div>`).join("") || `<div class="muted">No courses match.</div>`;
  }
  renderCourses("");
  document.getElementById("course-search").addEventListener("input", e => renderCourses(e.target.value));
})();

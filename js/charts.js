/* Charts — minimal canvas impl: bars/donut/heatmap. Accepts Track A object form + Track B shorthand. */
(function () {
  function setup(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    const w = Math.max(80, r.width || 300), h = Math.max(60, r.height || 160);
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  }
  // bars(canvas, {labels, values})  OR  bars(canvas, [n,n,n])
  function bars(canvas, arg, maybeLabels) {
    if (!canvas) return;
    let labels = [], values = [];
    if (Array.isArray(arg)) { values = arg; labels = Array.isArray(maybeLabels) ? maybeLabels : values.map((_, i) => ""); }
    else if (arg && typeof arg === "object") { labels = arg.labels || []; values = arg.values || []; }
    else return;
    if (!values.length) values = [0];
    const { ctx, w, h } = setup(canvas);
    const max = Math.max(10, ...values);
    const n = values.length || 1;
    const gap = 10, bw = (w - gap * (n + 1)) / n;
    ctx.font = "10px 'Courier Prime', monospace";
    values.forEach((v, i) => {
      const bh = Math.max(3, (h - 34) * (v / max));
      const x = gap + i * (bw + gap), y = h - 20 - bh;
      ctx.fillStyle = "#ECE8DB";
      try {
        ctx.beginPath(); ctx.roundRect(x, 6, bw, h - 26, 7); ctx.fill();
      } catch { ctx.fillRect(x, 6, bw, h - 26); }
      const g = ctx.createLinearGradient(0, y, 0, h - 20);
      g.addColorStop(0, "#C90D40"); g.addColorStop(1, "#A90533");
      ctx.fillStyle = g;
      try {
        ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 6); ctx.fill();
      } catch { ctx.fillRect(x, y, bw, bh); }
      ctx.fillStyle = "#858585";
      ctx.fillText(String(labels[i] || "").slice(0, 6), x, h - 6);
    });
  }
  // donut(canvas, {value,max,label})  OR  donut(canvas, percentNumber)
  function donut(canvas, arg, maxArg) {
    if (!canvas) return;
    let value = 0, max = 10, label = "";
    if (typeof arg === "number") { value = arg; max = 100; label = arg + "%"; }
    else if (arg && typeof arg === "object") { value = arg.value ?? 0; max = arg.max ?? 10; label = arg.label ?? ""; }
    else return;
    if (typeof maxArg === "number") max = maxArg;
    const { ctx, w, h } = setup(canvas);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10;
    ctx.lineWidth = 13; ctx.lineCap = "round";
    ctx.strokeStyle = "#ECE8DB";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    const frac = Math.max(0, Math.min(1, value / max));
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#A90533"); g.addColorStop(1, "#FF5C7E");
    ctx.strokeStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#1C1C1C"; ctx.textAlign = "center";
    ctx.font = "700 26px 'Inter Tight', sans-serif";
    ctx.fillText(String(value), cx, cy + 2);
    ctx.font = "11px 'Courier Prime', monospace"; ctx.fillStyle = "#858585";
    ctx.fillText(label || (`/ ${max}`), cx, cy + 20);
  }
  // heatmap(el, array)  OR  heatmap(el, {date:count})
  function heatmap(el, data) {
    if (!el) return;
    el.innerHTML = "";
    el.classList.add("heat");
    let vals = [];
    if (Array.isArray(data)) vals = data;
    else if (data && typeof data === "object") vals = Object.keys(data).sort().map(k => data[k]);
    else return;
    vals = vals.slice(-140);
    const scale = Math.max(1, ...vals);
    vals.forEach(v => {
      const i = document.createElement("i");
      const a = Math.min(1, (v || 0) / Math.max(5, scale));
      i.style.background = (v || 0) <= 0 ? "#E9E5D6" : `rgba(169,5,51,${0.18 + a * 0.82})`;
      i.title = `${v} pts`;
      el.appendChild(i);
    });
    // ensure grid shows nicely for large sets
    if (vals.length > 60) { el.style.gridTemplateColumns = "repeat(20, 1fr)"; }
  }
  window.Charts = { bars, donut, heatmap };
})();

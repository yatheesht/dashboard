<p align="center">
  <img src="assets/logo.svg" width="84" height="84" alt="Open Dashboard logo" />
</p>

<h1 align="center">open dashboard</h1>
<p align="center"><code>ALL-IN-ONE STUDENT OS • TNKR-INSPIRED • STATIC • NO BACKEND</code></p>

<p align="center">
  <img src="https://img.shields.io/badge/style-tnkr.cream_%23EDECE4-1C1C1C?style=flat-square" alt="tnkr cream" />
  <img src="https://img.shields.io/badge/accent-%23A90533-A90533?style=flat-square" alt="accent" />
  <img src="https://img.shields.io/badge/stack-HTML_CSS_JS-black?style=flat-square" alt="stack" />
  <img src="https://img.shields.io/badge/data-localStorage-504A4C?style=flat-square" alt="localStorage" />
  <img src="https://img.shields.io/github/license/yatheesht/dashboard?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/issues/yatheesht/dashboard?style=flat-square" alt="issues" />
</p>

> One profile, every proof. Marks cards, grades, certificates, projects, practice streak — six focused dashboards in one sexy static app.

## ✨ Features

| Dashboard | What you get |
|---|---|
| `Overview` | Profile hero (name + email + uni + sem), CGPA / XP / streak KPIs, GPA bars, deadlines, top projects |
| `Academics` | Sem 1–4 tabs, marks table (code / subject / credits / marks / grade / status), GPA donut, marksheet upload placeholder |
| `Projects` | Filter `All / Web / AI / Design`, search + sort, gradient cards, detail modal, New Project modal |
| `Practice` | 23-day streak, 140-day heatmap, language split, weekly goal donut, Log Session (+XP) |
| `Achievements` | Cert wall with credential IDs, Verify toast, upload placeholder, timeline |
| `Settings` | Edit profile, avatar hue, Export JSON, Reset demo |

- 💾 Persisted to `localStorage` (`sdash.v1`) — no backend
- 📱 Responsive `<900px` — sidebar collapses to top nav
- 🎨 tnkr.ai palette: `--bg:#EDECE4 --card:#FFFDF9 --ink:#1C1C1C --muted:#504A4C --faint:#858585 --accent:#A90533`

## 🚀 Quickstart

```bash
git clone https://github.com/yatheesht/dashboard.git
cd dashboard
# option A: just open it
start index.html
# option B: serve on :1234
npx serve -l 1234 .
# -> http://localhost:1234
```

Demo login: **Aarav Mehta — aarav.mehta@univ.edu** (fake seed data, edit in Settings).

## 🗂️ Structure

```
dashboard/
├── index.html  academics.html  projects.html
├── practice.html  achievements.html  settings.html
├── assets/
│   ├── logo.svg  favicon.svg  og-cover.svg
├── css/
│   ├── tokens.css  base.css  layout.css
│   ├── components.css  views-a.css  views-b.css
├── js/
│   ├── data.js  store.js  ui.js  charts.js
│   ├── overview.js  academics.js  settings.js
│   ├── projects.js  practice.js  achievements.js
└── .github/
```

## 🏷️ Labels

| Label | Use |
|---|---|
| `good first issue` | small, safe for newcomers |
| `enhancement` | new feature / polish |
| `bug` | broken UI / JS error |
| `design` | palette / logo / CSS |
| `data` | seed / fake-data updates |
| `docs` | README / contributing |
| `priority:high` | streak-breaking stuff |

## 🗺️ Roadmap

- [ ] PWA + installable + offline
- [ ] Export transcript PDF
- [ ] Import CSV marks
- [ ] Dark mode (`--ink` ↔ `--bg` flip)
- [ ] Real auth + cloud sync

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome — keep the tnkr cream clean.

## 📄 License

MIT — see [LICENSE](LICENSE).

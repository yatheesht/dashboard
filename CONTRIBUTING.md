# Contributing to Open Dashboard

Keep it cream, keep it clean.

## Setup

```bash
git clone https://github.com/yatheesht/dashboard.git
cd dashboard
npx serve -l 1234 .
```

No build step. Vanilla HTML/CSS/JS only.

## Rules

1. **Palette lock:** `--bg:#EDECE4 --card:#FFFDF9 --ink:#1C1C1C --accent:#A90533`. No new hex without a `design` issue.
2. **Contracts:** every page keeps `#sidebar #topbar #view-root #modal-root #toast-root` + script order `data.js > store.js > ui.js > charts.js > <page>.js`.
3. **Shared CSS:** `.btn .card .pill .tag .table .modal .toast .heatmap-grid` live in `components.css` — extend in `views-a/b.css`, don't fork.
4. **Fake data:** edit `js/data.js` `window.SEED` only. Never hardcode names elsewhere — use `Store.all()`.
5. **Labels:** tag PRs with `enhancement / bug / design / data / docs`.

## PR checklist

- [ ] Tested `index.html` + touched pages at desktop + 390px mobile
- [ ] `node --check js/*.js` passes
- [ ] Screenshots for visual changes
- [ ] No real user data committed

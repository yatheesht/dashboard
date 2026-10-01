/* Store — localStorage wrapper, key sdash.v1. Lazy + migrates missing SEED keys. */
(function () {
  const KEY = "sdash.v1";
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function readRaw() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }
  function writeRaw(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  }
  function ensure() {
    let d = readRaw();
    const seed = clone(window.SEED || {});
    if (!d || typeof d !== "object") {
      d = seed;
      writeRaw(d);
      return d;
    }
    // backfill any missing top-level SEED keys (forward-compat for Track A/B superset)
    let dirty = false;
    Object.keys(seed).forEach(k => {
      if (d[k] === undefined) { d[k] = seed[k]; dirty = true; }
    });
    if (dirty) writeRaw(d);
    return d;
  }
  function getPath(obj, path) {
    if (!path) return obj;
    return path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
  }
  function setPath(obj, path, val) {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] == null || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }
  window.Store = {
    key: KEY,
    all() { return ensure(); },
    get(path, fallback) {
      const d = ensure();
      const v = getPath(d, path);
      return v === undefined ? fallback : v;
    },
    set(path, val) {
      const d = ensure();
      setPath(d, path, val);
      writeRaw(d);
      return val;
    },
    push(path, val) {
      const arr = this.get(path, []);
      arr.push(val);
      this.set(path, arr);
      return arr;
    },
    reset() {
      const s = clone(window.SEED || {});
      writeRaw(s);
      return s;
    }
  };
})();

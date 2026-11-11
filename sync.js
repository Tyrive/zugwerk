/* Zugwerk – Geräte-Sync über einen privaten GitHub-Gist.
   Gespeichert werden Trainingsfortschritt, eigene Fehler und der chess.com-Name.
   Das Token (nur Recht "gist") bleibt im Browser dieses Geräts. */
"use strict";

const SYNC_FILE = "zugwerk-sync.json";
const SY = {timer:null, running:false, again:false, status:"", err:false};

function syncCfg(){ try { return JSON.parse(localStorage.getItem("zugwerk.sync")) || null; } catch(e){ return null; } }
function setSyncCfg(c){ try { if (c) localStorage.setItem("zugwerk.sync", JSON.stringify(c)); else localStorage.removeItem("zugwerk.sync"); } catch(e){} }

async function gh(path, token, opts){
  opts = opts || {};
  const r = await fetch("https://api.github.com" + path, {
    method: opts.method || "GET",
    headers: Object.assign({"Accept":"application/vnd.github+json", "Authorization":"Bearer " + token}, opts.body ? {"Content-Type":"application/json"} : {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (r.status === 401) throw new Error("Das Token ist ungültig oder abgelaufen.");
  if (r.status === 403 || r.status === 404) throw new Error("Das Token hat keine Berechtigung für Gists.");
  if (!r.ok) throw new Error("GitHub antwortet mit Status " + r.status + ".");
  return r.json();
}

/* ---------- Zusammenführen: nichts geht verloren, egal auf welchem Gerät trainiert wurde ---------- */
function mergeProgress(a, b){
  a = a || {}; b = b || {};
  const newer = (a.updated || 0) >= (b.updated || 0) ? a : b;
  const days = {};
  new Set([...Object.keys(a.days || {}), ...Object.keys(b.days || {})]).forEach(k => {
    const x = (a.days || {})[k] || {}, y = (b.days || {})[k] || {};
    days[k] = {p:Math.max(x.p || 0, y.p || 0), l:Math.max(x.l || 0, y.l || 0), m:Math.max(x.m || 0, y.m || 0), a:Math.max(x.a || 0, y.a || 0)};
  });
  return {
    // Wertung vom Gerät mit mehr gewerteten Rätseln, bei Gleichstand das zuletzt genutzte
    rating: ((x, y) => x > y ? a.rating : y > x ? b.rating : newer.rating)((a.solved || 0) + (a.failed || 0), (b.solved || 0) + (b.failed || 0)) || 400,
    solved: Math.max(a.solved || 0, b.solved || 0),
    failed: Math.max(a.failed || 0, b.failed || 0),
    seen: Object.assign({}, b.seen, a.seen),
    lessons: Object.assign({}, b.lessons, a.lessons),
    cleared: Object.assign({}, b.cleared, a.cleared),
    days,
    updated: Math.max(a.updated || 0, b.updated || 0)
  };
}
function mergeMistakes(a, b, cleared){
  const map = new Map();
  [...(b || []), ...(a || [])].forEach(m => {
    if (!m || !m.fen || cleared[m.fen]) return;
    const old = map.get(m.fen);
    map.set(m.fen, old ? Object.assign({}, old, m, {n:Math.max(old.n || 0, m.n || 0)}) : m);
  });
  return [...map.values()].slice(-300);
}
function mergeOpenings(a, b){
  const r = {};
  new Set([...Object.keys(a || {}), ...Object.keys(b || {})]).forEach(k => {
    const x = (a || {})[k] || {}, y = (b || {})[k] || {};
    r[k] = {seen: !!(x.seen || y.seen), ok:Math.max(x.ok || 0, y.ok || 0), err:Math.max(x.err || 0, y.err || 0), last:Math.max(x.last || 0, y.last || 0)};
  });
  return r;
}
function localData(){
  let user = ""; try { user = localStorage.getItem("zugwerk.user") || ""; } catch(e){}
  return {v:1, progress:PR, mistakes:loadMistakes(), user, openings:loadOpProgress()};
}
function applyData(d){
  PR = Object.assign(loadProgress(), d.progress);
  try {
    localStorage.setItem("zugwerk.progress", JSON.stringify(PR));
    localStorage.setItem("zugwerk.mistakes", JSON.stringify(d.mistakes || []));
    localStorage.setItem("zugwerk.openings", JSON.stringify(d.openings || {}));
    if (d.user && !localStorage.getItem("zugwerk.user")){ localStorage.setItem("zugwerk.user", d.user); if ($("ccUser") && !$("ccUser").value) $("ccUser").value = d.user; }
  } catch(e){}
  renderHome();
  if (window.zwOpeningsReload) zwOpeningsReload();
}

/* ---------- Abgleich ---------- */
async function syncNow(){
  const cfg = syncCfg(); if (!cfg) return;
  if (SY.running){ SY.again = true; return; }
  SY.running = true; SY.err = false; SY.status = "Synchronisiere …"; renderSync();
  try {
    const g = await gh("/gists/" + cfg.gist, cfg.token);
    let remote = {};
    try { remote = JSON.parse((g.files[SYNC_FILE] || {}).content || "{}"); } catch(e){}
    const local = localData();
    const progress = mergeProgress(local.progress, remote.progress);
    const merged = {v:1, progress, mistakes:mergeMistakes(local.mistakes, remote.mistakes, progress.cleared || {}), user: local.user || remote.user || "", openings:mergeOpenings(local.openings, remote.openings)};
    applyData(merged);
    if (JSON.stringify(merged) !== JSON.stringify(remote)){
      await gh("/gists/" + cfg.gist, cfg.token, {method:"PATCH", body:{files:{[SYNC_FILE]:{content:JSON.stringify(merged)}}}});
    }
    cfg.last = Date.now(); setSyncCfg(cfg);
    SY.status = "";
  } catch(e){
    SY.err = true; SY.status = e instanceof TypeError ? "GitHub ist gerade nicht erreichbar. Dein Fortschritt bleibt auf diesem Gerät gespeichert." : e.message;
  } finally {
    SY.running = false; renderSync();
    if (SY.again){ SY.again = false; syncNow(); }
  }
}
window.zwSyncSoon = function(){
  if (!syncCfg()) return;
  clearTimeout(SY.timer); SY.timer = setTimeout(syncNow, 3000);
};

async function connectSync(token){
  token = token.trim();
  if (!token){ SY.err = true; SY.status = "Bitte ein Token einfügen."; return renderSync(); }
  SY.err = false; SY.status = "Verbinde mit GitHub …"; renderSync();
  try {
    // Vorhandenen Sync-Gist suchen (zweites Gerät), sonst neu anlegen
    let gist = null;
    for (let page = 1; page <= 5 && !gist; page++){
      const list = await gh("/gists?per_page=100&page=" + page, token);
      gist = list.find(x => x.files && x.files[SYNC_FILE]);
      if (list.length < 100) break;
    }
    if (!gist){
      gist = await gh("/gists", token, {method:"POST", body:{description:"Zugwerk – Trainingsfortschritt", public:false,
        files:{[SYNC_FILE]:{content:JSON.stringify(localData())}}}});
    }
    setSyncCfg({token, gist:gist.id, last:0});
    await syncNow();
  } catch(e){
    SY.err = true; SY.status = e instanceof TypeError ? "GitHub ist gerade nicht erreichbar." : e.message; renderSync();
  }
}

function renderSync(){
  const el = $("tSync"); if (!el) return;
  const cfg = syncCfg();
  const st = SY.status ? `<div class="fb ${SY.err ? "bad" : ""}">${esc(SY.status)}</div>` : "";
  if (!cfg){
    el.innerHTML = `<div class="ttext">
      <p>Speichert deinen Fortschritt in einem privaten Gist in deinem GitHub-Konto. So hast du am Handy und am PC denselben Stand.</p>
      <ol>
        <li><a href="https://github.com/settings/tokens/new?scopes=gist&description=Zugwerk%20Sync" target="_blank" rel="noopener">Token bei GitHub erstellen</a>: Nur das Häkchen <b>gist</b> setzen, Ablaufdatum nach Wunsch, dann <b>Generate token</b>.</li>
        <li>Token hier einfügen und verbinden. Auf jedem weiteren Gerät dasselbe Token verwenden.</li>
      </ol></div>
      <form class="row" id="syncForm" style="margin-top:8px">
        <input id="syncToken" type="password" placeholder="ghp_…" autocomplete="off" spellcheck="false">
        <button class="btn primary" type="submit">Verbinden</button>
      </form>${st}`;
    $("syncForm").onsubmit = e => { e.preventDefault(); connectSync($("syncToken").value); };
    return;
  }
  const last = cfg.last ? new Date(cfg.last).toLocaleString("de-DE", {day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit"}) : "noch nie";
  el.innerHTML = `<div class="ttext"><p><b style="color:var(--c-best)">Verbunden.</b> Fortschritt wird nach jeder Übung automatisch gesichert. Zuletzt: ${last}</p></div>
    <div class="row"><button class="btn" id="syncNowBtn"${SY.running ? " disabled" : ""}>Jetzt synchronisieren</button><button class="btn" id="syncOff">Trennen</button></div>${st}`;
  $("syncNowBtn").onclick = syncNow;
  $("syncOff").onclick = () => { setSyncCfg(null); SY.status = "Getrennt. Der Gist bleibt in deinem GitHub-Konto erhalten."; SY.err = false; renderSync(); };
}

renderSync();
if (syncCfg()) syncNow();
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && syncCfg()) syncNow(); });

/* Zugwerk – Trainingsbereich: Tagesplan, Rätsel, eigene Fehler, Lektionen, Ausspielen gegen Stockfish.
   Nutzt Chess, makeEngine, winPct, de, moveLabel, esc, FILES, $ aus index.html. */
"use strict";

const TR = {mode:null, board:null, eng:null, engReady:null, chain:Promise.resolve(), pz:null, ls:null, st:null, busy:false};
const GOAL = {p:10, l:1, m:3};
const TAGS = {hanging:"Hängende Figur", fork:"Gabel", tactic:"Taktik", mate1:"Matt in 1", mate2:"Matt in 2", mate3:"Matt in 3", mistake:"Eigener Fehler"};
const MODES = [
  {id:"mix",     label:"Gemischt",        f:p => true},
  {id:"hanging", label:"Figur schlagen",  f:p => p[2] === "hanging"},
  {id:"fork",    label:"Gabel",           f:p => p[2] === "fork"},
  {id:"mate",    label:"Matt",            f:p => p[2].startsWith("mate")},
  {id:"tactic",  label:"Taktik",          f:p => p[2] === "tactic"}
];

/* ---------- Fortschritt (nur in diesem Browser) ---------- */
function dayKey(d){ d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function loadProgress(){
  let p = null;
  try { p = JSON.parse(localStorage.getItem("zugwerk.progress")); } catch(e){}
  return Object.assign({rating:400, solved:0, failed:0, seen:{}, lessons:{}, days:{}, cleared:{}, tags:{}, retry:{}, rush:0, coords:0, updated:0}, p || {});
}
let PR = loadProgress();
function saveProgress(){ PR.updated = Date.now(); try { localStorage.setItem("zugwerk.progress", JSON.stringify(PR)); } catch(e){} if (window.zwSyncSoon) zwSyncSoon(); }
function today(){ const k = dayKey(); return PR.days[k] || (PR.days[k] = {p:0, l:0, m:0, a:0}); }
function bump(key){ today()[key]++; saveProgress(); renderHome(); }
function streak(){
  let n = 0;
  for (let i = 0; i < 400; i++){
    const d = new Date(); d.setDate(d.getDate() - i);
    const x = PR.days[dayKey(d)];
    if (x && x.p + x.l + x.m + x.a > 0) n++;
    else if (i > 0) break;
  }
  return n;
}
function loadMistakes(){ try { return JSON.parse(localStorage.getItem("zugwerk.mistakes")) || []; } catch(e){ return []; } }
function saveMistakes(list){ try { localStorage.setItem("zugwerk.mistakes", JSON.stringify(list.slice(-300))); } catch(e){} if (window.zwSyncSoon) zwSyncSoon(); }

/* Wird nach jeder fertigen Analyse aufgerufen: eigene Fehler werden zu Rätseln */
window.zwAfterAnalysis = function(){
  bump("a");
  const g = S.game, me = S.me;
  if (!g || !me) return 0;
  const list = loadMistakes(), have = new Set(list.map(x => x.fen));
  let added = 0;
  S.info.forEach((inf, i) => {
    if (!inf || g.moves[i].color !== me || !["mistake","blunder"].includes(inf.cls) || !inf.bestUci) return;
    const fen = g.fens[i];
    if (have.has(fen)) return;
    list.push({fen, best:inf.bestUci, played:g.moves[i].uci, cls:inf.cls, opp: me === "w" ? g.black : g.white, date:dayKey(), n:0});
    added++;
  });
  saveMistakes(list);
  renderHome();
  return added;
};

/* ---------- Engine (eigene Instanz, Aufträge nacheinander) ---------- */
function tEngine(){
  if (!TR.engReady) TR.engReady = makeEngine().then(e => { TR.eng = e; e.send("setoption name MultiPV value 1"); });
  return TR.engReady;
}
function search(fen, depth){
  const job = TR.chain.then(async () => {
    await tEngine();
    const r = await TR.eng.analyse(fen, depth);
    const win = r.type === "mate" ? (r.val > 0 ? 100 : 0) : winPct(r.val);
    return {win, best:r.best, pv:r.pv, mate: r.type === "mate" ? r.val : null, cp: r.type === "cp" ? r.val : null};
  });
  TR.chain = job.catch(() => {});
  return job;
}
// Gewinnchance (in %) für die ziehende Seite nach dem Zug uci
async function moverWin(fen, uci, depth){
  const c = new Chess(fen);
  if (!c.move(U(uci))) return 0;
  if (c.in_checkmate()) return 100;
  if (c.game_over()) return 50;
  const r = await search(c.fen(), depth || 14);
  return 100 - r.win;
}
const U = u => ({from:u.slice(0,2), to:u.slice(2,4), promotion:u[4] || "q"});

/* ---------- Erklärungen zu Rätselzügen ---------- */
const NOM = {p:"der Bauer", n:"der Springer", b:"der Läufer", r:"der Turm", q:"die Dame", k:"der König"};
const NAMEN = {p:"Bauer", n:"Springer", b:"Läufer", r:"Turm", q:"Dame", k:"König"};
const DEN = {p:"den Bauern", n:"den Springer", b:"den Läufer", r:"den Turm", q:"die Dame", k:"den König"};
const WEG = {p:"ein Bauer", n:"ein Springer", b:"ein Läufer", r:"ein Turm", q:"die Dame", k:"der König"};
const DER = t => t === "q" ? "Die Dame" : "Der " + NAMEN[t];
// Material am Ende einer Linie; ein eigener Rückschlag zählt mit (wie in der Partieanalyse)
function matEnd(steps, col, m0){ let v = null; steps.forEach(s => { const x = material(s.after, col); v = (v === null || s.color !== col) ? x : Math.max(v, x); }); return v === null ? m0 : v; }
// Welche gegnerischen Figuren greift die Figur auf sq an?
function attackedBy(fen, sq){
  const c = new Chess(fen), p = c.get(sq); if (!p) return [];
  const f = fen.split(" "); f[1] = p.color; f[3] = "-";
  const t = new Chess(); if (!t.load(f.join(" "))) return [];
  const hits = t.moves({square:sq, verbose:true}).filter(m => m.captured).map(m => m.captured);
  if (c.in_check()) hits.unshift("k");
  return hits;
}
const listDe = arr => arr.length < 2 ? (arr[0] || "") : arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1];
function motif(fen, line, tag){
  const c = new Chess(fen), m = c.move(U(line[0])); if (!m) return "";
  const targets = [...new Set(attackedBy(c.fen(), m.to))].filter(t => t === "k" || VAL[t] >= 3);
  if (targets.length >= 2)
    return `<b>Gabel:</b> ${DER(m.piece)} auf ${m.to} greift ${listDe(targets.map(t => DEN[t]))} gleichzeitig an. Der Gegner kann nicht alles retten.`;
  if (tag === "hanging" && m.captured) return `Die Figur auf ${m.to} war <b>nicht gedeckt</b>. Vor jedem Zug lohnt der Blick: Was hat der Gegner gerade ungeschützt gelassen?`;
  if (m.san.includes("+") && tag === "fork") return `Der Zug kommt <b>mit Schach</b> und bereitet eine Gabel vor: Der Gegner muss reagieren, und im nächsten Zug greift deine Figur zwei Ziele an.`;
  if (m.san.includes("+")) return `Der Zug kommt <b>mit Schach</b>. Der Gegner muss zuerst darauf reagieren und hat keine Zeit für seine eigenen Pläne.`;
  if (m.captured) return `${DER(m.piece)} schlägt auf ${m.to} und leitet die Kombination ein.`;
  return "";
}
async function explainSolution(fen, line, tag){
  const col = fen.split(" ")[1], m0 = material(fen, col);
  const steps = walk(fen, line, line.length);
  const end = steps.length ? steps[steps.length - 1].after : fen, ce = new Chess(end);
  if (ce.in_checkmate()){
    const n = Math.ceil(steps.length / 2);
    return `<b>Matt in ${n}.</b> ${n > 1 ? "Jeder Zug kommt mit Schach oder einer Drohung, der Gegner hat keine Zeit zur Verteidigung. " : "Der König hat kein Fluchtfeld, und nichts kann dazwischenziehen oder den Angreifer schlagen. "}Zugfolge: <b>${lineTxt(steps, steps.length)}</b>.`;
  }
  let more = [];
  try { const r = await search(end, 14); more = walk(end, r.pv, 3); } catch(e){}
  const all = steps.concat(more), gain = matEnd(all, col, m0) - m0;
  // Bilanz bis zum letzten eigenen Schlagzug (danach folgt nur noch normales Spiel)
  const mine = all.filter(s => s.color === col && s.captured).map(s => DEN[s.captured]);
  const theirs = all.filter(s => s.color !== col && s.captured).map(s => DEN[s.captured]);
  let out = motif(fen, line, tag);
  out += ` Zugfolge: <b>${lineTxt(all, all.length)}</b>.`;
  if (gain >= 1 && mine.length) out += ` Bilanz: <b>+${gain}</b> Bauerneinheiten. Du schlägst ${listDe(mine)}${theirs.length ? `, der Gegner ${listDe(theirs)}` : ""}.`;
  return out.trim();
}
async function explainWrong(fen, uci, missedMate){
  const col = fen.split(" ")[1], m0 = material(fen, col);
  const c = new Chess(fen), m = c.move(U(uci)); if (!m) return "";
  if (c.in_checkmate()) return "";
  if (c.game_over()) return `<b class="mono">${esc(de(m.san))}</b> führt zum Patt oder Remis.`;
  const r = await search(c.fen(), 14);
  const reply = walk(c.fen(), r.pv, 4), san = `<b class="mono">${esc(de(m.san))}</b>`;
  const pre = missedMate ? `Damit verpasst du das Matt. ` : "";
  if (r.mate !== null && r.mate > 0) return pre + `${san} erlaubt ein Matt in ${r.mate}: <b>${lineTxt(walk(c.fen(), r.pv, r.mate * 2 - 1), r.mate * 2 - 1)}</b>.`;
  const lost = m0 - matEnd(reply, col, m0);
  if (lost >= 1){
    const cap = reply.find(s => s.color !== col && s.captured);
    const hung = cap && cap.to === m.to;
    return pre + `${san} ${hung ? `stellt ${DEN[m.piece]} auf ${m.to} ein` : "verliert Material"}: Nach <b>${lineTxt(reply, 4)}</b> ${cap ? `ist ${WEG[cap.captured]} weg` : "fehlt dir Material"}.`;
  }
  const w = 100 - r.win;
  if (missedMate) return `Damit verpasst du das Matt. Nach ${san} antwortet der Gegner am besten mit <b>${lineTxt(reply, 3)}</b>.`;
  return `${san} ist kein Fehler im Material, lässt aber die Chance liegen. Danach hast du nur noch ${Math.round(w)} % Gewinnchance. Der Gegner antwortet am besten mit <b>${lineTxt(reply, 3)}</b>.`;
}
function showExp(pz, html){ if (TR.pz !== pz) return; const e = pq("#tExp"); if (e && html) e.innerHTML = html; }

/* ---------- Brett für das Training ---------- */
class TBoard{
  constructor(el){
    this.el = el; this.fen = START_FEN; this.orient = "w"; this.sel = null; this.last = null;
    this.arrows = []; this.mark = null; this.enabled = false; this.onMove = null; this.drag = null;
    this.draw = new Draw(el, (x, y) => this.sqAt(x, y), sq => this.xy(sq));
    this.bind(); this.render();
  }
  set(fen, o){
    o = o || {};
    this.fen = fen; this.sel = null; this.mark = o.mark || null;
    if (o.orient) this.orient = o.orient;
    this.last = o.last || null; this.arrows = o.arrows || [];
    this.render();
  }
  xy(sq){ const f = FILES.indexOf(sq[0]), r = 8 - parseInt(sq[1], 10); return this.orient === "w" ? {x:f, y:r} : {x:7 - f, y:7 - r}; }
  sqAt(x, y){
    const r = this.el.getBoundingClientRect();
    if (x < r.left || y < r.top || x >= r.right || y >= r.bottom) return null;
    let f = Math.floor((x - r.left) / r.width * 8), k = Math.floor((y - r.top) / r.height * 8);
    if (this.orient === "b"){ f = 7 - f; k = 7 - k; }
    return FILES[f] + (8 - k);
  }
  render(){
    const rows = this.fen.split(" ")[0].split("/"), grid = [];
    rows.forEach(row => { const out = []; for (const ch of row){ if (/\d/.test(ch)) for (let k = 0; k < +ch; k++) out.push(null); else out.push(ch); } grid.push(out); });
    const tg = {};
    if (this.sel) new Chess(this.fen).moves({square:this.sel, verbose:true}).forEach(m => { tg[m.to] = true; });
    let h = "";
    for (let vy = 0; vy < 8; vy++) for (let vx = 0; vx < 8; vx++){
      const r = this.orient === "b" ? 7 - vy : vy, f = this.orient === "b" ? 7 - vx : vx;
      const sq = FILES[f] + (8 - r), p = grid[r][f];
      const last = this.last && (this.last.from === sq || this.last.to === sq);
      let inner = "";
      if (p) inner += `<span class="pc ${p === p.toUpperCase() ? "w" : "b"} p${p.toLowerCase()}"></span>`;
      if (vx === 0) inner += `<span class="co r">${8 - r}</span>`;
      if (vy === 7) inner += `<span class="co f">${FILES[f]}</span>`;
      if (this.mark && this.mark.sq === sq) inner += `<span class="badge-sq" style="background:${this.mark.ok ? "var(--c-best)" : "var(--c-blunder)"}">${this.mark.ok ? "✓" : "✗"}</span>`;
      h += `<div class="sq ${(r + f) % 2 ? "d" : "l"}${last ? " last" : ""}${this.sel === sq ? " sel" : ""}${tg[sq] ? " tgt" + (p ? " cap" : "") : ""}${this.hintSq === sq ? " hint" : ""}" data-sq="${sq}">${inner}</div>`;
    }
    let a = "";
    this.arrows.forEach(ar => {
      const u = typeof ar === "string" ? ar : ar.u, col = ar.c || "#ffaa00";
      const p1 = this.xy(u.slice(0,2)), p2 = this.xy(u.slice(2,4));
      const x1 = p1.x + .5, y1 = p1.y + .5, x2 = p2.x + .5, y2 = p2.y + .5, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      const hx = x2 - ux * .42, hy = y2 - uy * .42, px = -uy * .22, py = ux * .22;
      a += `<g opacity=".8"><line x1="${x1 + ux * .2}" y1="${y1 + uy * .2}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width=".17" stroke-linecap="round"/><polygon points="${x2 - ux * .08},${y2 - uy * .08} ${hx + px},${hy + py} ${hx - px},${hy - py}" fill="${col}"/></g>`;
    });
    h += `<svg class="arrows" viewBox="0 0 8 8">${a}</svg>`;
    if (this.draw) h += this.draw.svg(this.fen);
    this.el.innerHTML = h;
  }
  tryMove(from, to){
    if (!this.enabled) return false;
    const c = new Chess(this.fen), m = c.move({from, to, promotion:"q"});
    if (!m) return false;
    this.sel = null; this.hintSq = null;
    if (this.onMove) this.onMove(m.from + m.to + (m.promotion || ""), m, c.fen());
    return true;
  }
  bind(){
    const el = this.el;
    el.addEventListener("pointerdown", e => {
      if (this.onSquare && e.button === 0){ const q = this.sqAt(e.clientX, e.clientY); if (q) this.onSquare(q); return; }
      if (!this.enabled || e.button > 0) return;
      const sq = this.sqAt(e.clientX, e.clientY); if (!sq) return;
      const c = new Chess(this.fen), p = c.get(sq);
      if (this.sel && this.sel !== sq && (!p || p.color !== c.turn())){ if (!this.tryMove(this.sel, sq)){ this.sel = null; this.render(); } return; }
      if (!p || p.color !== c.turn()){ this.sel = null; this.render(); return; }
      e.preventDefault();
      const was = this.sel === sq; this.sel = sq; this.render();
      const pc = el.querySelector(`[data-sq="${sq}"] .pc`), box = pc.parentElement, ghost = pc.cloneNode(true);
      ghost.classList.add("ghost"); ghost.style.width = box.offsetWidth + "px"; ghost.style.height = box.offsetHeight + "px";
      ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; ghost.hidden = true;
      document.body.appendChild(ghost);
      this.drag = {from:sq, ghost, pc, was, moved:false, x0:e.clientX, y0:e.clientY};
      try { el.setPointerCapture(e.pointerId); } catch(_){}
    });
    el.addEventListener("pointermove", e => {
      const d = this.drag; if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 5){ d.moved = true; d.ghost.hidden = false; d.pc.classList.add("lift"); }
      d.ghost.style.left = e.clientX + "px"; d.ghost.style.top = e.clientY + "px";
    });
    const end = (e, cancel) => {
      const d = this.drag; if (!d) return; this.drag = null; d.ghost.remove();
      if (cancel){ this.sel = null; this.render(); return; }
      if (d.moved){ const to = this.sqAt(e.clientX, e.clientY); if (to && to !== d.from && this.tryMove(d.from, to)) return; this.render(); return; }
      if (d.was){ this.sel = null; this.render(); }
    };
    el.addEventListener("pointerup", e => end(e, false));
    el.addEventListener("pointercancel", e => end(e, true));
  }
}

/* ---------- Anzeige: Statusfeld unter dem Brett ---------- */
TR.ids = {panel:"tPanel", ctl:"tCtl"}; TR.ctx = "training";
const TLESSONS = () => LESSONS.filter(l => !l.opening);
function useCtx(ctx){
  if (ctx === "openings"){ TR.ctx = "openings"; TR.board = OP.board; TR.ids = {panel:"oPanel", ctl:"oCtl"}; }
  else { TR.ctx = "training"; TR.board = TR.trainBoard; TR.ids = {panel:"tPanel", ctl:"tCtl"}; }
}
window.zwUseCtx = useCtx;
function pq(sel){ return $(TR.ids.panel).querySelector(sel); }
function panel(html){ $(TR.ids.panel).innerHTML = (TR.session && TR.ctx === "training" ? sessBar() : "") + html; }
function feedback(kind, html){ const f = pq("#tFb"); if (!f) return; f.className = "fb " + (kind || ""); f.innerHTML = html; }
function controls(btns){
  $(TR.ids.ctl).innerHTML = btns.map((b, i) => `<button class="btn${b.primary ? " primary" : ""}" data-i="${i}"${b.disabled ? " disabled" : ""}>${b.label}</button>`).join("");
  $(TR.ids.ctl).onclick = e => { const x = e.target.closest("button"); if (x && !x.disabled) btns[+x.dataset.i].fn(); };
}
const sideTxt = fen => fen.split(" ")[1] === "w" ? "Weiß" : "Schwarz";

/* ---------- Rätsel ---------- */
function pickPuzzle(modeId){
  const mode = MODES.find(m => m.id === modeId) || MODES[0];
  const P = window.PUZZLES || [], curIdx = TR.pz ? TR.pz.idx : -1, now = Date.now();
  // Verpatzte Rätsel kommen wieder: nach 10 Minuten, nach einem Tag, nach vier Tagen
  const due = Object.keys(PR.retry).map(Number).filter(i => P[i] && i !== curIdx && PR.retry[i][1] <= now && mode.f(P[i])).sort((a, b) => PR.retry[a][1] - PR.retry[b][1]);
  if (due.length && (due.length >= 4 || Math.random() < .5)) return {p:P[due[0]], i:due[0], retry:true};
  const all = P.map((p, i) => ({p, i})).filter(x => mode.f(x.p) && x.i !== curIdx);
  if (!all.length) return null;
  const scored = all.map(x => ({x, s: Math.abs(x.p[3] - PR.rating) + Math.random() * 200 + (PR.seen[x.i] ? 600 : 0)}));
  scored.sort((a, b) => a.s - b.s);
  return scored[0].x;
}
const nextPuzzle = pz => TR.session ? sessionNext() : startPuzzle(pz.mode);
function startPuzzle(modeId, forced){
  const rush = !!(forced && forced.rush);
  resetBoardMode(rush);
  TR.mode = "puzzle";
  let pz;
  if (modeId === "mistakes"){
    const list = loadMistakes();
    if (!list.length){ return showHomePanel("Noch keine eigenen Fehler gespeichert. Lade eine chess.com-Partie im Analyse-Bereich und lass sie analysieren."); }
    list.sort((a, b) => a.n - b.n || Math.random() - .5);
    const m = list[0];
    pz = {kind:"mistake", fen:m.fen, line:[m.best], tag:"mistake", r:null, ref:m.fen, mode:modeId, played:m.played, opp:m.opp};
  } else {
    const x = forced || pickPuzzle(modeId);
    if (!x) return showHomePanel("Für diese Kategorie gibt es noch keine Rätsel.");
    const p = x.p;
    pz = {kind: p[2].startsWith("mate") ? "mate" : "tactic", fen:p[0], line:p[1].split(" "), tag:p[2], r:p[3], idx:x.i, mode:modeId, retry:!!x.retry, rush};
  }
  Object.assign(pz, {step:0, now:pz.fen, failed:false, hinted:false, done:false, side:pz.fen.split(" ")[1]});
  TR.pz = pz;
  const b = TR.board;
  b.enabled = true; b.onMove = puzzleMove;
  b.set(pz.fen, {orient:pz.side});
  if (rush){
    panel(`${rushHead()}<div class="ttext">${sideTxt(pz.fen)} am Zug. ${pz.kind === "mate" ? "Finde das Matt." : "Finde den besten Zug."}</div><div id="tFb" class="fb"></div><div id="tExp" class="texp"></div>`);
    return controls([{label:"Sturm beenden", fn:rushEnd}]);
  }
  const title = pz.kind === "mistake" ? `Dein Fehler gegen ${esc(pz.opp || "?")}` : `${pz.retry ? "Wiederholung · " : ""}${TAGS[pz.tag]} · ca. ${pz.r} Elo`;
  panel(`<div class="ttitle">${title}</div>
    <div class="ttext">${sideTxt(pz.fen)} am Zug. ${pz.kind === "mate" ? "Finde das Matt." : pz.kind === "mistake" ? `In der Partie hast du <b class="mono">${esc(de(sanOf(pz.fen, pz.played)))}</b> gespielt. Finde den besseren Zug.` : "Finde den besten Zug."}</div>
    <div id="tFb" class="fb"></div><div id="tExp" class="texp"></div>`);
  controls([
    {label:"Hinweis", fn:puzzleHint},
    {label:"Lösung zeigen", fn:puzzleSolution},
    {label:"Überspringen", fn:() => startPuzzle(pz.mode)},
    {label:"Übersicht", fn:() => lessonHome()}
  ]);
}
function sanOf(fen, uci){ try { const c = new Chess(fen), m = c.move(U(uci)); return m ? m.san : uci; } catch(e){ return uci; } }
const RETRY_GAP = [10 * 60e3, 864e5, 4 * 864e5];
function retryUpdate(idx, ok){
  const r = PR.retry[idx];
  if (!ok){ PR.retry[idx] = [0, Date.now() + RETRY_GAP[0]]; return; }
  if (!r) return;
  const st = r[0] + 1;
  if (st >= RETRY_GAP.length) delete PR.retry[idx]; else PR.retry[idx] = [st, Date.now() + RETRY_GAP[st]];
}
function rate(score){
  const pz = TR.pz; if (pz.rated || pz.kind === "mistake" || pz.rush) return; pz.rated = true;
  // Wiederholungen zählen nicht für die Wertung, sie steuern nur, wann das Rätsel wiederkommt
  if (pz.retry){ retryUpdate(pz.idx, score >= 1); saveProgress(); return; }
  const exp = 1 / (1 + Math.pow(10, (pz.r - PR.rating) / 400));
  PR.rating = Math.max(100, Math.round(PR.rating + 32 * (score - exp)));
  if (score >= .5) PR.solved++; else PR.failed++;
  const t = PR.tags[pz.tag] || (PR.tags[pz.tag] = {ok:0, fail:0});
  if (score >= .5) t.ok++; else t.fail++;
  if (score === 0) retryUpdate(pz.idx, false);
  today().r = PR.rating;
  saveProgress();
}
async function puzzleMove(uci, m, after){
  const pz = TR.pz, b = TR.board;
  if (pz.done || TR.busy) return;
  const exp = pz.line[pz.step], lastUser = pz.step >= pz.line.length - 1;
  let ok = uci === exp || (exp && exp.length === 4 && uci.slice(0, 4) === exp);
  if (!ok && lastUser && new Chess(after).in_checkmate()) ok = true;
  b.set(after, {last:{from:m.from, to:m.to}});
  if (!ok && pz.kind !== "mate"){
    TR.busy = true; b.enabled = false; feedback("", "Prüfe deinen Zug …");
    try {
      const wU = await moverWin(pz.now, uci), wE = await moverWin(pz.now, exp);
      const tol = pz.kind === "mistake" ? 5 : 3;
      if (wU >= wE - tol && (pz.kind === "mistake" || wU >= 70)){ TR.busy = false; return puzzleSolved(true, m.to); }
    } catch(e){}
    TR.busy = false; b.enabled = true;
  }
  if (ok){
    pz.step++; pz.now = after;
    if (pz.step >= pz.line.length) return puzzleSolved(false, m.to);
    b.enabled = false; b.mark = {sq:m.to, ok:true}; b.render();
    feedback("good", "Richtig! Weiter …");
    setTimeout(() => {
      const c = new Chess(pz.now), r = c.move(U(pz.line[pz.step]));
      pz.now = c.fen(); pz.step++;
      b.set(pz.now, {last:{from:r.from, to:r.to}}); b.enabled = true;
      feedback("", `Gegner: <b class="mono">${esc(de(r.san))}</b>. Wie geht es weiter?`);
    }, 450);
    return;
  }
  if (pz.rush) return rushMiss(m.to);
  if (!pz.failed){ pz.failed = true; rate(0); }
  b.enabled = false; b.mark = {sq:m.to, ok:false}; b.render();
  feedback("bad", "Das ist nicht der beste Zug. Versuch es nochmal.");
  const before = pz.now;
  showExp(pz, '<span class="muted">Warum nicht? Stockfish schaut nach …</span>');
  explainWrong(before, uci, pz.kind === "mate").then(t => showExp(pz, t ? "<b>Warum nicht:</b> " + t : "")).catch(() => {});
  setTimeout(() => { if (TR.pz === pz && !pz.done){ b.set(pz.now, {}); b.enabled = true; } }, 1200);
}
function puzzleSolved(alt, sq){
  const pz = TR.pz, b = TR.board;
  pz.done = true; b.enabled = false;
  if (sq){ b.mark = {sq, ok:true}; b.render(); }
  if (pz.rush) return rushHit();
  if (!pz.failed) rate(pz.hinted ? .5 : 1);
  TR.run = !pz.failed && !pz.hinted ? (TR.run || 0) + 1 : 0;
  if (pz.kind === "mistake"){
    const list = loadMistakes(), m = list.find(x => x.fen === pz.ref);
    if (m){ m.n++; if (!pz.failed && !pz.hinted && m.n >= 2){ list.splice(list.indexOf(m), 1); PR.cleared[m.fen] = 1; saveProgress(); } saveMistakes(list); }
    bump("m");
  } else { PR.seen[pz.idx] = 1; saveProgress(); bump("p"); }
  const msg = pz.failed ? "Gelöst, aber nicht im ersten Versuch." : alt ? "Auch richtig! Dein Zug ist genauso stark." : "Gelöst!";
  explainDone(pz);
  feedback("good", `${msg}${pz.kind !== "mistake" && !pz.retry ? ` Deine Rätselwertung: <b>${PR.rating}</b>` : ""}${pz.retry && !pz.failed ? " Die Wiederholung sitzt." : ""}${TR.run >= 3 ? ` · <b>${TR.run}</b> in Folge im ersten Versuch` : ""}`);
  controls([
    {label:TR.session ? "Weiter" : "Nächstes Rätsel", primary:true, fn:() => nextPuzzle(pz)},
    {label:"Lösung ansehen", fn:puzzleSolution},
    {label:"Im Analysebrett öffnen", fn:() => puzzleToAnalysis(pz)},
    {label:"Übersicht", fn:() => lessonHome()}
  ]);
}
async function explainDone(pz){
  showExp(pz, '<span class="muted">Erklärung wird berechnet …</span>');
  try {
    let t = "<b>Warum das funktioniert:</b> " + await explainSolution(pz.fen, pz.line, pz.tag);
    if (pz.kind === "mistake" && pz.played){ const w = await explainWrong(pz.fen, pz.played); if (w) t += "<br><b>Dein Partiezug:</b> " + w; }
    showExp(pz, t);
  } catch(e){ showExp(pz, ""); }
}
function puzzleToAnalysis(pz){
  const c = new Chess(pz.fen), sans = [];
  pz.line.forEach(u => { const m = c.move(U(u)); if (m) sans.push(m.san); });
  const pgn = `[SetUp "1"]\n[FEN "${pz.fen}"]\n[White "Rätsel"]\n[Black "${pz.kind === "mistake" ? "Eigener Fehler" : TAGS[pz.tag]}"]\n\n${sans.join(" ")}`;
  try { setGame(parseGame(pgn), pz.side === "b"); location.hash = ""; setTimeout(() => go(0), 50); } catch(e){}
}
function puzzleHint(){
  const pz = TR.pz; if (!pz || pz.done) return;
  pz.hinted = true;
  const u = pz.line[pz.step];
  TR.board.hintSq = u.slice(0, 2); TR.board.render();
  feedback("", `Die Figur auf <b>${u.slice(0, 2)}</b> ist der Schlüssel.`);
}
function puzzleSolution(){
  const pz = TR.pz; if (!pz) return;
  if (!pz.done && !pz.failed){ pz.failed = true; rate(0); }
  if (!pz.done){ TR.run = 0; if (pz.kind !== "mistake"){ PR.seen[pz.idx] = 1; bump("p"); } else bump("m"); }
  pz.done = true;
  const b = TR.board; b.enabled = false;
  const c = new Chess(pz.fen), sans = [];
  let i = 0;
  b.set(pz.fen, {});
  const stepFn = () => {
    if (i >= pz.line.length){ feedback("", `Lösung: <b class="mono">${esc(sans.join(" "))}</b>`); explainDone(pz); return; }
    const before = c.fen(), r = c.move(U(pz.line[i]));
    sans.push(i === 0 || r.color === "w" ? moveLabel(before, r.san) : de(r.san));
    b.set(c.fen(), {last:{from:r.from, to:r.to}}); i++;
    setTimeout(stepFn, 700);
  };
  setTimeout(stepFn, 300);
  controls([
    {label:TR.session ? "Weiter" : "Nächstes Rätsel", primary:true, fn:() => nextPuzzle(pz)},
    {label:"Im Analysebrett öffnen", fn:() => puzzleToAnalysis(pz)},
    {label:"Übersicht", fn:() => lessonHome()}
  ]);
}

/* ---------- Lektionen ---------- */
function openLesson(id){
  const les = LESSONS.find(l => l.id === id); if (!les) return;
  if (TR.ctx === "training") resetBoardMode();
  TR.mode = "lesson"; TR.ls = {les, i:0};
  showStep();
}
function showStep(){
  const {les, i} = TR.ls, s = les.steps[i], b = TR.board;
  const side = s.fen.split(" ")[1];
  TR.st = {s, path:[], now:s.fen, done:s.type === "info", wrong:0, n:0};
  b.onMove = lessonMove;
  b.enabled = s.type !== "info" && s.type !== "quiz";
  b.set(s.fen, {orient: s.orient || (s.type === "info" || s.type === "quiz" ? "w" : side), arrows:(s.arrows || []).map(u => ({u, c:"#ffaa00"}))});
  const intro = i === 0 && les.intro ? `<p class="muted">${les.intro}</p>` : "";
  panel(`<div class="ttitle"><span class="nospell">${esc(les.title)}</span> <span class="muted">· Schritt ${i + 1} von ${les.steps.length}</span></div>
    ${intro}<div class="ttext">${s.text}</div>
    ${s.type === "play" ? `<div class="muted" id="tCount">Züge: 0 / ${s.max}</div>` : ""}
    ${s.type === "quiz" ? `<div class="qopts">${shuffledOpts(s).map(o => `<button class="qopt" data-k="${o.k}">${esc(o.t)}</button>`).join("")}</div>` : ""}
    <div id="tFb" class="fb"></div>`);
  if (s.type === "quiz") $(TR.ids.panel).querySelector(".qopts").onclick = e => { const b = e.target.closest(".qopt"); if (b && !TR.st.done) quizAnswer(b); };
  lessonControls();
}
// Antworten mischen, damit die richtige nicht immer oben steht (stabil pro Schritt)
function shuffledOpts(s){
  const o = s.opts.map((x, k) => Object.assign({k}, x));
  let seed = s.text.length;
  for (let i = o.length - 1; i > 0; i--){ seed = (seed * 9301 + 49297) % 233280; const j = Math.floor(seed / 233280 * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
  return o;
}
function quizAnswer(btn){
  const st = TR.st, o = st.s.opts[+btn.dataset.k];
  if (o.ok){ btn.classList.add("ok"); return stepDone(); }
  st.wrong++; btn.classList.add("bad"); btn.disabled = true;
  feedback("bad", o.why || "Nicht ganz.");
}
function lessonControls(){
  const {les, i} = TR.ls, st = TR.st, s = st.s, last = i === les.steps.length - 1;
  const btns = [];
  if (i > 0) btns.push({label:"Zurück", fn:() => { TR.ls.i--; showStep(); }});
  if (s.type === "move" && !st.done) btns.push({label:"Hinweis", fn:() => feedback("", s.hint || "Schau dir an, welche Figuren angegriffen sind.")});
  if (s.type === "move" && !st.done && (s.lines || s.accept)) btns.push({label:"Lösung", fn:lessonSolution});
  if (s.type === "play") btns.push({label:"Neu starten", fn:showStep});
  btns.push(last
    ? {label:"Lektion abschließen", primary:true, disabled:!st.done, fn:finishLesson}
    : {label:"Weiter", primary:true, disabled:!st.done, fn:() => { TR.ls.i++; showStep(); }});
  btns.push({label:"Übersicht", fn:() => lessonHome()});
  controls(btns);
}
function lessonHome(){ if (TR.ctx === "openings" && window.zwOpeningsHome) window.zwOpeningsHome(); else showHomePanel(); }
function stepDone(){
  const st = TR.st; st.done = true; TR.board.enabled = false;
  feedback("good", st.s.done || "Richtig!");
  lessonControls();
}
function lessonWrong(after, sq, msg){
  const st = TR.st, b = TR.board;
  st.wrong++;
  b.enabled = false; b.mark = {sq, ok:false}; b.render();
  feedback("bad", (msg || "Nicht ganz.") + (st.wrong >= 2 && st.s.hint ? " Tipp: " + st.s.hint : " Versuch es nochmal."));
  setTimeout(() => { if (TR.st === st){ b.set(st.now, {}); b.enabled = true; } }, 900);
}
async function lessonMove(uci, m, after){
  const st = TR.st, s = st.s, b = TR.board;
  if (st.done || TR.busy) return;
  if (s.type === "play") return drillPlayMove(uci, m, after);
  b.set(after, {last:{from:m.from, to:m.to}});
  if (s.lines){
    const cand = s.lines.filter(l => st.path.every((u, k) => l[k] === u) && l[st.path.length] && l[st.path.length].slice(0,4) === uci.slice(0,4));
    if (!cand.length) return lessonWrong(after, m.to);
    st.path.push(uci); st.now = after;
    if (cand.some(l => l.length === st.path.length)) return stepDone();
    b.enabled = false; b.mark = {sq:m.to, ok:true}; b.render();
    setTimeout(() => {
      const u = cand[0][st.path.length], r = new Chess(st.now), mv = r.move(U(u));
      st.path.push(u); st.now = r.fen();
      b.set(st.now, {last:{from:mv.from, to:mv.to}}); b.enabled = true;
      feedback("", `Gegner: <b class="mono">${esc(de(mv.san))}</b>. Und jetzt?`);
    }, 450);
    return;
  }
  if (s.accept){
    if (s.accept.includes(uci.slice(0, 4)) || s.accept.includes(uci)){ st.now = after; b.mark = {sq:m.to, ok:true}; b.render(); return stepDone(); }
    return lessonWrong(after, m.to);
  }
  if (s.engine){
    TR.busy = true; b.enabled = false; feedback("", "Stockfish prüft deinen Zug …");
    try {
      if (st.best == null){ const r = await search(s.fen, 16); st.best = r.win; }
      const w = await moverWin(s.fen, uci, 16);
      TR.busy = false;
      if (w >= st.best - s.engine){ st.now = after; b.mark = {sq:m.to, ok:true}; b.render(); return stepDone(); }
      return lessonWrong(after, m.to, "Damit verschlechtert sich deine Stellung deutlich.");
    } catch(e){ TR.busy = false; b.enabled = true; feedback("bad", "Stockfish konnte nicht starten."); }
  }
}
function lessonSolution(){
  const st = TR.st, s = st.s, b = TR.board;
  const u = s.lines ? s.lines[0][st.path.length] : s.accept[0];
  b.arrows = [{u, c:"#81b64c"}]; b.render();
  feedback("", `Lösung: <b class="mono">${esc(de(sanOf(st.now, u)))}</b>. Zieh ihn selbst.`);
}
async function drillPlayMove(uci, m, after){
  const st = TR.st, s = st.s, b = TR.board;
  st.n++; st.now = after;
  b.set(after, {last:{from:m.from, to:m.to}});
  const cnt = pq("#tCount"); if (cnt) cnt.textContent = `Züge: ${st.n} / ${s.max}`;
  const c = new Chess(after);
  if (c.in_checkmate()) return s.goal === "mate" ? stepDone() : playFail("Matt gesetzt, aber das Ziel war die Umwandlung. Trotzdem stark!");
  if (c.game_over()) return playFail(c.in_stalemate() ? "Patt! Der König hat keinen Zug mehr, steht aber nicht im Schach. Das ist Remis." : "Remis.");
  TR.busy = true; b.enabled = false;
  try {
    const r = await search(after, 12);
    TR.busy = false;
    if (100 - r.win < 70) return playFail("Damit ist der Gewinn weg, wahrscheinlich ist eine Figur verloren gegangen.");
    if (s.goal === "promote" && m.promotion) return stepDone();
    if (st.n >= s.max) return playFail(`Die ${s.max} Züge sind um. Versuch es nochmal mit der Technik aus der Erklärung.`);
    const mv = c.move(U(r.best));
    st.now = c.fen();
    b.set(st.now, {last:{from:mv.from, to:mv.to}}); b.enabled = true;
    if (c.game_over()) return playFail("Remis.");
  } catch(e){ TR.busy = false; feedback("bad", "Stockfish konnte nicht starten."); }
}
function playFail(msg){
  TR.board.enabled = false;
  feedback("bad", msg);
  controls([{label:"Neu starten", primary:true, fn:showStep}, {label:"Übersicht", fn:() => lessonHome()}]);
}
function finishLesson(){
  const les = TR.ls.les;
  const first = !PR.lessons[les.id];
  PR.lessons[les.id] = true; saveProgress(); bump("l");
  if (les.opening){
    const nextP = LESSONS.find(l => l.opening === les.opening && !PR.lessons[l.id]);
    panel(`<div class="ttitle">Lektion abgeschlossen</div><div class="ttext">${first ? "Verstanden: " : "Wiederholt: "}<b>${esc(les.title)}</b>. Am besten setzt du das jetzt direkt um: Spiel die Varianten im Übungsmodus und achte auf die Warum-Fragen.</div><div id="tFb" class="fb"></div>`);
    controls([
      ...(nextP ? [{label:"Nächste Plan-Lektion", primary:true, fn:() => openLesson(nextP.id)}] : []),
      {label:"Varianten üben", primary:!nextP, fn:() => window.zwOpeningsDrill && window.zwOpeningsDrill()},
      {label:"Gegen Bot spielen", fn:() => window.zwOpeningsBot && window.zwOpeningsBot()},
      {label:"Übersicht", fn:() => lessonHome()}
    ]);
    if (window.zwOpeningsReload) window.zwOpeningsReload();
    return;
  }
  const next = TLESSONS().find(l => !PR.lessons[l.id]);
  panel(`<div class="ttitle">Lektion abgeschlossen</div><div class="ttext">${first ? "Neu gelernt: " : "Wiederholt: "}<b>${esc(les.title)}</b>. Festige es jetzt mit ein paar Rätseln.</div><div id="tFb" class="fb"></div>`);
  if (TR.session) return controls([{label:"Weiter im Tagestraining", primary:true, fn:sessionNext}, {label:"Übersicht", fn:() => lessonHome()}]);
  controls([
    {label:"Rätsel üben", primary:true, fn:() => startPuzzle(les.chapter === "Mattbilder" ? "mate" : "mix")},
    ...(next ? [{label:"Nächste Lektion", fn:() => openLesson(next.id)}] : []),
    {label:"Übersicht", fn:() => lessonHome()}
  ]);
}

/* ---------- Übersicht ---------- */
// Beendet Sondermodi (Sturm, Felder finden), bevor etwas anderes auf dem Trainingsbrett startet
function resetBoardMode(keepRush){
  const b = TR.trainBoard; if (!b) return;
  b.onSquare = null; b.el.classList.remove("nocoord");
  clearInterval(TR.coT); if (TR.co) TR.co.on = false;
  if (!keepRush && TR.rush){ clearInterval(TR.rushT); TR.rush = null; }
}
function showHomePanel(note){
  resetBoardMode(); TR.session = false;
  TR.mode = null; TR.board.enabled = false; TR.board.set(START_FEN, {orient:"w"});
  const next = TLESSONS().find(l => !PR.lessons[l.id]);
  const mist = loadMistakes().length, st = sessionStep(), d = today();
  const left = [];
  if (st.k !== "done"){
    if (d.l < GOAL.l && next) left.push("eine Lektion");
    if (d.p < GOAL.p) left.push(`${GOAL.p - d.p} Rätsel`);
    if (mist && d.m < GOAL.m) left.push(`${Math.min(GOAL.m - d.m, mist)} eigene Fehler`);
  }
  panel(`<div class="ttitle">Training</div>
    <div class="ttext">${note ? `<p class="fb bad">${note}</p>` : ""}${st.k === "done"
      ? `<p><b>Tagesziel erreicht.</b> Du kannst frei weiterüben oder eine Partie spielen und danach analysieren.</p>`
      : `<p>Das <b>Tagestraining</b> führt dich in etwa 15 Minuten durch alles, was heute noch offen ist: ${listDe(left)}.</p>`}</div>`);
  controls([
    ...(st.k === "done" ? [{label:"Rätsel starten", primary:true, fn:() => startPuzzle("mix")}] : [{label:d.p + d.l + d.m ? "Tagestraining fortsetzen" : "Tagestraining starten", primary:true, fn:sessionNext}, {label:"Nur Rätsel", fn:() => startPuzzle("mix")}]),
    ...(next ? [{label:"Lektion: " + esc(next.title), fn:() => openLesson(next.id)}] : []),
    ...(mist ? [{label:`Eigene Fehler (${mist})`, fn:() => startPuzzle("mistakes")}] : [])
  ]);
}

/* ---------- Tagestraining: geführte Einheit aus Lektion, Rätseln und eigenen Fehlern ---------- */
function sessionStep(){
  const d = today(), next = TLESSONS().find(l => !PR.lessons[l.id]), mist = loadMistakes().length;
  if (d.l < GOAL.l && next) return {k:"lesson", next};
  if (d.p < GOAL.p) return {k:"puzzle"};
  if (mist && d.m < GOAL.m) return {k:"mistake"};
  return {k:"done"};
}
function sessBar(){
  const d = today(), mist = loadMistakes().length, k = sessionStep().k;
  const it = (on, t) => `<span class="${on ? "on" : ""}">${t}</span>`;
  return `<div class="sess"><b>Tagestraining</b>${it(k === "lesson", `Lektion ${Math.min(d.l, GOAL.l)}/${GOAL.l}`)}${it(k === "puzzle", `Rätsel ${Math.min(d.p, GOAL.p)}/${GOAL.p}`)}${mist || d.m ? it(k === "mistake", `Eigene Fehler ${Math.min(d.m, GOAL.m)}/${GOAL.m}`) : ""}</div>`;
}
function sessionNext(){
  useCtx("training"); TR.session = true;
  const s = sessionStep();
  if (s.k === "lesson") return openLesson(s.next.id);
  if (s.k === "puzzle"){ const w = weakestMode(); return startPuzzle(w && today().p % 2 === 1 ? w : "mix"); }
  if (s.k === "mistake") return startPuzzle("mistakes");
  resetBoardMode(); TR.mode = null; TR.board.enabled = false;
  const st = streak();
  panel(`<div class="ttitle">Tagestraining geschafft!</div><div class="ttext"><p>Lektion, Rätsel und eigene Fehler sind für heute erledigt. ${st > 1 ? `Das ist dein <b>${st}. Tag in Folge</b>.` : "Morgen geht es weiter, dann beginnt deine Serie."}</p><p>Am meisten bringt es jetzt, eine <b>Partie zu spielen</b> und sie danach hier zu analysieren.</p></div><div id="tFb" class="fb"></div>`);
  TR.session = false;
  controls([
    {label:"Eröffnung üben", primary:true, fn:() => { location.hash = "#openings"; }},
    {label:"Rätsel-Sturm", fn:startRush},
    {label:"Noch mehr Rätsel", fn:() => startPuzzle("mix")},
    {label:"Übersicht", fn:() => showHomePanel()}
  ]);
}

/* ---------- Stärken und Schwächen nach Thema ---------- */
const THEMES = [["hanging","Figur schlagen"], ["fork","Gabel"], ["mate","Matt"], ["tactic","Taktik"]];
function themeStat(id){
  let ok = 0, fail = 0;
  Object.keys(PR.tags || {}).forEach(t => { if (t === id || (id === "mate" && t.startsWith("mate"))){ ok += PR.tags[t].ok || 0; fail += PR.tags[t].fail || 0; } });
  return {n:ok + fail, pct: ok + fail ? ok / (ok + fail) * 100 : null};
}
function weakestMode(){
  const c = THEMES.map(([id]) => Object.assign({id}, themeStat(id))).filter(x => x.n >= 5 && x.pct < 80).sort((a, b) => a.pct - b.pct)[0];
  return c ? c.id : null;
}
function themesHtml(){
  const weak = weakestMode();
  return `<div class="chap" style="margin-top:14px">Deine Trefferquote nach Thema</div>` + THEMES.map(([id, label]) => {
    const s = themeStat(id);
    return `<button class="trow" data-mode="${id}"><span>${label}${weak === id ? ' <span class="lt warn">Schwäche · hier üben</span>' : ""}</span><b class="nospell">${s.n >= 5 ? Math.round(s.pct) + " %" : "–"}</b>
      <span class="pbar"><i style="width:${s.n >= 5 ? s.pct : 0}%;${s.n >= 5 && s.pct < 60 ? "background:var(--c-mistake)" : ""}"></i></span>
      <span class="muted">${s.n >= 5 ? s.n + " gewertete Rätsel" : "noch zu wenig Rätsel für eine Aussage"}</span></button>`;
  }).join("");
}
function sparkHtml(){
  const pts = Object.keys(PR.days).sort().filter(k => PR.days[k].r).slice(-30).map(k => PR.days[k].r);
  if (pts.length < 2) return "";
  const lo = Math.min(...pts) - 20, hi = Math.max(...pts) + 20, W = 300, H = 46;
  const xy = pts.map((v, i) => [(i / (pts.length - 1) * W).toFixed(1), (H - (v - lo) / (hi - lo) * H).toFixed(1)]);
  const diff = pts[pts.length - 1] - pts[0];
  return `<div class="spark"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Verlauf der Rätselwertung"><polyline points="${xy.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <div class="muted">Rätselwertung über ${pts.length} Trainingstage: <b class="nospell" style="color:${diff >= 0 ? "var(--c-best)" : "var(--c-mistake)"}">${diff >= 0 ? "+" : ""}${diff}</b></div></div>`;
}

/* ---------- Rätsel-Sturm: 3 Minuten, 3 Leben, die Rätsel werden schwerer ---------- */
function startRush(){
  useCtx("training"); TR.session = false; clearInterval(TR.rushT);
  TR.rush = {lives:3, score:0, end:Date.now() + 180000, used:{}, level:400};
  TR.rushT = setInterval(rushTick, 250);
  rushNext();
}
const mmss = ms => { const t = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };
function rushHead(){
  const r = TR.rush;
  return `<div class="rushbar"><span class="big nospell" id="rushT">${mmss(r.end - Date.now())}</span><span class="hearts">${"♥".repeat(r.lives)}<i>${"♥".repeat(3 - r.lives)}</i></span><span><b class="nospell">${r.score}</b> gelöst</span><span class="muted">Rätsel-Sturm</span></div>`;
}
function rushNext(){
  const r = TR.rush; if (!r) return;
  const P = window.PUZZLES || [];
  const c = P.map((p, i) => ({p, i})).filter(x => !r.used[x.i]).map(x => ({x, s:Math.abs(x.p[3] - r.level) + Math.random() * 120})).sort((a, b) => a.s - b.s)[0];
  if (!c) return rushEnd();
  r.used[c.x.i] = 1;
  startPuzzle("rush", {p:c.x.p, i:c.x.i, rush:true});
}
function rushTick(){
  const r = TR.rush;
  if (!r || document.body.dataset.view !== "training"){ clearInterval(TR.rushT); TR.rush = null; return; }
  const el = pq("#rushT"); if (el) el.textContent = mmss(r.end - Date.now());
  if (Date.now() >= r.end) rushEnd();
}
function rushHit(){
  const r = TR.rush; if (!r) return;
  r.score++; r.level += 30;
  feedback("good", "Richtig!");
  setTimeout(() => { if (TR.rush === r) rushNext(); }, 350);
}
function rushMiss(sq){
  const r = TR.rush, pz = TR.pz, b = TR.board; if (!r) return;
  r.lives--; pz.done = true; b.enabled = false; b.mark = {sq, ok:false}; b.render();
  feedback("bad", `Falsch. Richtig war <b class="mono">${esc(de(sanOf(pz.now, pz.line[pz.step])))}</b>.`);
  setTimeout(() => { if (TR.rush !== r) return; if (r.lives <= 0) rushEnd(); else rushNext(); }, 1100);
}
function rushEnd(){
  const r = TR.rush; clearInterval(TR.rushT); TR.rush = null; if (!r) return;
  const best = Math.max(PR.rush || 0, r.score), record = r.score > (PR.rush || 0);
  PR.rush = best; saveProgress(); renderHome();
  if (TR.pz) TR.pz.done = true; TR.board.enabled = false; TR.mode = null;
  panel(`<div class="ttitle">Rätsel-Sturm beendet</div><div class="stats"><div><div class="big">${r.score}</div><div class="muted">gelöst</div></div><div><div class="big">${best}</div><div class="muted">Bestwert</div></div><div><div class="big">${r.lives}</div><div class="muted">Leben übrig</div></div></div>
    <div id="tFb" class="fb ${record ? "good" : ""}">${record && r.score ? "Neuer Bestwert!" : r.lives <= 0 ? "Alle Leben verbraucht. Lieber einen Moment länger hinschauen als raten." : "Zeit abgelaufen."}</div>`);
  controls([{label:"Nochmal", primary:true, fn:startRush}, {label:"Übersicht", fn:() => showHomePanel()}]);
}

/* ---------- Felder finden: Koordinaten in 30 Sekunden ---------- */
function startCoords(){
  useCtx("training"); resetBoardMode(); TR.session = false; TR.mode = "coords";
  const b = TR.board; b.enabled = false; b.set(START_FEN, {orient:"w"});
  panel(`<div class="ttitle">Felder finden</div><div class="ttext"><p>Jedes Feld hat einen Namen aus Buchstabe und Zahl. Die <b>Buchstaben a bis h</b> laufen aus Sicht von Weiß von links nach rechts, die <b>Zahlen 1 bis 8</b> von unten nach oben.</p><p>Gleich erscheint ein Feldname. Klick so schnell wie möglich auf das richtige Feld. Du hast 30 Sekunden.</p></div>
    <div class="muted">Bestwert: <b class="nospell">${PR.coords || 0}</b></div><div id="tFb" class="fb"></div>`);
  controls([{label:"Start als Weiß", primary:true, fn:() => coordsGo("w")}, {label:"Start als Schwarz", fn:() => coordsGo("b")}, {label:"Übersicht", fn:() => showHomePanel()}]);
}
function coordsGo(o){
  const b = TR.board;
  TR.co = {score:0, err:0, end:Date.now() + 30000, tgt:null, o, on:true};
  b.set(START_FEN, {orient:o}); b.el.classList.add("nocoord"); b.onSquare = coordsClick;
  clearInterval(TR.coT);
  TR.coT = setInterval(() => {
    const c = TR.co; if (!c || !c.on || document.body.dataset.view !== "training"){ clearInterval(TR.coT); return; }
    const el = pq("#coT"); if (el) el.textContent = mmss(c.end - Date.now());
    if (Date.now() >= c.end) coordsEnd();
  }, 200);
  coordsTarget();
  controls([{label:"Abbrechen", fn:startCoords}]);
}
function coordsTarget(msg){
  const c = TR.co; let t;
  do { t = FILES[Math.floor(Math.random() * 8)] + (1 + Math.floor(Math.random() * 8)); } while (t === c.tgt);
  if (!msg) c.tgt = t;
  panel(`<div class="rushbar"><span class="big nospell" id="coT">${mmss(c.end - Date.now())}</span><span><b class="nospell">${c.score}</b> richtig</span><span class="muted"><span class="nospell">${c.err}</span> falsch</span><span class="muted">Felder finden</span></div>
    <div class="coordbig nospell">${c.tgt}</div><div id="tFb" class="fb bad nospell">${msg || ""}</div>`);
}
function coordsClick(sq){
  const c = TR.co, b = TR.board; if (!c || !c.on) return;
  if (sq === c.tgt){ c.score++; b.mark = {sq, ok:true}; b.render(); coordsTarget(); }
  else { c.err++; b.mark = {sq, ok:false}; b.render(); coordsTarget(`Das war ${sq}.`); }
}
function coordsEnd(){
  const c = TR.co, b = TR.board; if (!c) return;
  c.on = false; clearInterval(TR.coT); b.onSquare = null; b.el.classList.remove("nocoord"); b.mark = null; b.render();
  const record = c.score > (PR.coords || 0);
  PR.coords = Math.max(PR.coords || 0, c.score); saveProgress(); renderHome();
  panel(`<div class="ttitle">Felder finden</div><div class="stats"><div><div class="big">${c.score}</div><div class="muted">richtig</div></div><div><div class="big">${c.err}</div><div class="muted">falsch</div></div><div><div class="big">${PR.coords}</div><div class="muted">Bestwert</div></div></div>
    <div id="tFb" class="fb ${record ? "good" : ""}">${record && c.score ? "Neuer Bestwert!" : c.score >= 20 ? "Sehr sicher. Die Notation sitzt." : "Ab etwa 20 Feldern in 30 Sekunden liest du Notation flüssig."}</div>`);
  controls([{label:"Nochmal als Weiß", primary:true, fn:() => coordsGo("w")}, {label:"Nochmal als Schwarz", fn:() => coordsGo("b")}, {label:"Übersicht", fn:() => showHomePanel()}]);
}
function bar(v, max){ const p = Math.min(100, v / max * 100); return `<div class="pbar"><i style="width:${p}%"></i></div>`; }
function renderHome(){
  if (!$("tToday")) return;
  const d = today(), mist = loadMistakes().length, st = streak();
  $("tToday").innerHTML = `
    <div class="stats">
      <div><div class="big">${PR.rating}</div><div class="muted">Rätselwertung</div></div>
      <div><div class="big">${st}</div><div class="muted">${st === 1 ? "Tag" : "Tage"} in Folge</div></div>
      <div><div class="big">${PR.solved}</div><div class="muted">Rätsel gelöst</div></div>
    </div>
    ${sparkHtml()}
    <div class="goals">
      <div class="goal"><span>Rätsel</span><b>${Math.min(d.p, GOAL.p)} / ${GOAL.p}</b>${bar(d.p, GOAL.p)}</div>
      <div class="goal"><span>Lektion</span><b>${Math.min(d.l, GOAL.l)} / ${GOAL.l}</b>${bar(d.l, GOAL.l)}</div>
      <div class="goal"><span>Eigene Fehler</span><b>${mist ? Math.min(d.m, GOAL.m) + " / " + GOAL.m : "–"}</b>${bar(mist ? d.m : 0, GOAL.m)}</div>
      <div class="goal"><span>Partie analysiert</span><b>${Math.min(d.a, 1)} / 1</b>${bar(d.a, 1)}</div>
    </div>`;
  const counts = {}; MODES.forEach(m => counts[m.id] = (window.PUZZLES || []).filter(m.f).length);
  $("tModes").innerHTML = MODES.map(m => `<button class="chipbtn" data-mode="${m.id}">${m.label} <small>${counts[m.id]}</small></button>`).join("") +
    `<button class="chipbtn${mist ? "" : " off"}" data-mode="mistakes">Eigene Fehler <small>${mist}</small></button>`;
  const due = Object.keys(PR.retry || {}).filter(i => PR.retry[i][1] <= Date.now()).length;
  $("tThemes").innerHTML = themesHtml() + (due ? `<div class="muted" style="margin-top:8px"><span class="nospell">${due}</span> verpatzte Rätsel sind zur Wiederholung fällig. Sie kommen beim Üben automatisch dran.</div>` : "");
  $("tGames").innerHTML = `
    <button class="gcard" data-g="rush"><b>Rätsel-Sturm</b><span class="muted">3 Minuten, 3 Leben, die Rätsel werden schwerer. Bestwert: <span class="nospell">${PR.rush || 0}</span></span></button>
    <button class="gcard" data-g="coords"><b>Felder finden</b><span class="muted">Notation lesen lernen: 30 Sekunden lang Felder anklicken. Bestwert: <span class="nospell">${PR.coords || 0}</span></span></button>
    <button class="gcard" data-g="bot"><b>Partie gegen den Bot</b><span class="muted">Ganze Partie in deiner Spielstärke, danach mit einem Klick analysieren.</span></button>`;
  const chapters = [...new Set(TLESSONS().map(l => l.chapter))];
  const next = TLESSONS().find(l => !PR.lessons[l.id]);
  $("tLessons").innerHTML = chapters.map(ch => `<div class="chap">${ch}</div>` +
    TLESSONS().filter(l => l.chapter === ch).map(l => `<button class="lesson${PR.lessons[l.id] ? " done" : ""}${next === l ? " next" : ""}" data-id="${l.id}">
      <span class="chk">${PR.lessons[l.id] ? "✓" : ""}</span><span>${esc(l.title)}</span>${next === l ? '<span class="tagnext">Als Nächstes</span>' : ""}</button>`).join("")).join("");
}
function initTraining(){
  if (TR.trainBoard) { useCtx("training"); renderHome(); return; }
  TR.trainBoard = TR.board = new TBoard($("tBoard"));
  useCtx("training");
  const top = () => { const r = $("tBoard").getBoundingClientRect(); if (r.top < 0 || r.top > innerHeight * .6) $("tBoard").scrollIntoView({block:"start", behavior:"smooth"}); };
  $("tModes").onclick = e => { const b = e.target.closest(".chipbtn"); if (b){ TR.session = false; startPuzzle(b.dataset.mode); top(); } };
  $("tThemes").onclick = e => { const b = e.target.closest(".trow"); if (b){ TR.session = false; startPuzzle(b.dataset.mode); top(); } };
  $("tGames").onclick = e => {
    const b = e.target.closest(".gcard"); if (!b) return;
    if (b.dataset.g === "rush"){ startRush(); top(); }
    if (b.dataset.g === "coords"){ startCoords(); top(); }
    if (b.dataset.g === "bot"){ location.hash = "#openings"; setTimeout(() => window.zwOpeningsBot && window.zwOpeningsBot(), 80); }
  };
  $("tLessons").onclick = e => { const b = e.target.closest(".lesson"); if (b){ TR.session = false; openLesson(b.dataset.id); top(); } };
  renderHome(); showHomePanel();
}
window.zwInitTraining = initTraining;
window.zwStartMistakes = () => { TR.session = false; startPuzzle("mistakes"); };
// Aus der Analyse direkt in eine Lektion oder ein Rätselthema springen
window.zwTrain = o => { location.hash = "#training"; setTimeout(() => { TR.session = false; if (o.lesson && LESSONS.some(l => l.id === o.lesson)) openLesson(o.lesson); else startPuzzle(o.mode || "mix"); }, 60); };

/* Tastatur im Training und bei den Eröffnungen: Eingabe oder Leertaste = grüner Knopf, H = Hinweis */
document.addEventListener("keydown", e => {
  const v = document.body.dataset.view; if (v !== "training" && v !== "openings") return;
  if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY/.test(e.target.tagName)) return;
  const ctl = $(v === "training" ? "tCtl" : "oCtl"); if (!ctl) return;
  if (e.key === "Enter" || e.key === " "){ const b = ctl.querySelector(".btn.primary:not(:disabled)"); if (b){ e.preventDefault(); b.click(); } }
  if (e.key === "h" || e.key === "H"){ const b = [...ctl.querySelectorAll(".btn:not(:disabled)")].find(x => /^(Hinweis|Tipp)/.test(x.textContent)); if (b) b.click(); }
});

/* ---------- Ansicht umschalten (#training) ---------- */
function route(){
  const v = location.hash === "#training" ? "training" : location.hash === "#openings" ? "openings" : "analyse";
  document.body.dataset.view = v;
  $("viewAnalyse").hidden = v !== "analyse"; $("viewTraining").hidden = v !== "training"; $("viewOpenings").hidden = v !== "openings";
  $("navAnalyse").setAttribute("aria-current", v === "analyse" ? "page" : "false");
  $("navTraining").setAttribute("aria-current", v === "training" ? "page" : "false");
  $("navOpenings").setAttribute("aria-current", v === "openings" ? "page" : "false");
  if (v !== "training" && TR.trainBoard && (TR.rush || (TR.co && TR.co.on))){ resetBoardMode(); showHomePanel(); }
  if (v === "training"){ liveRequest(null); initTraining(); }
  else if (v === "openings"){ liveRequest(null); window.zwInitOpenings(); }
  else render();
}
window.addEventListener("hashchange", route);
route();

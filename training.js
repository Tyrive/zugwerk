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
  return Object.assign({rating:400, solved:0, failed:0, seen:{}, lessons:{}, days:{}, cleared:{}, updated:0}, p || {});
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
    return {win, best:r.best, mate: r.type === "mate" ? r.val : null, cp: r.type === "cp" ? r.val : null};
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
function panel(html){ $("tPanel").innerHTML = html; }
function feedback(kind, html){ const f = $("tFb"); if (!f) return; f.className = "fb " + (kind || ""); f.innerHTML = html; }
function controls(btns){
  $("tCtl").innerHTML = btns.map((b, i) => `<button class="btn${b.primary ? " primary" : ""}" data-i="${i}"${b.disabled ? " disabled" : ""}>${b.label}</button>`).join("");
  $("tCtl").onclick = e => { const x = e.target.closest("button"); if (x && !x.disabled) btns[+x.dataset.i].fn(); };
}
const sideTxt = fen => fen.split(" ")[1] === "w" ? "Weiß" : "Schwarz";

/* ---------- Rätsel ---------- */
function pickPuzzle(modeId){
  const mode = MODES.find(m => m.id === modeId) || MODES[0];
  const all = (window.PUZZLES || []).map((p, i) => ({p, i})).filter(x => mode.f(x.p));
  if (!all.length) return null;
  const scored = all.map(x => ({x, s: Math.abs(x.p[3] - PR.rating) + Math.random() * 200 + (PR.seen[x.i] ? 600 : 0)}));
  scored.sort((a, b) => a.s - b.s);
  return scored[0].x;
}
function startPuzzle(modeId){
  TR.mode = "puzzle";
  let pz;
  if (modeId === "mistakes"){
    const list = loadMistakes();
    if (!list.length){ return showHomePanel("Noch keine eigenen Fehler gespeichert. Lade eine chess.com-Partie im Analyse-Bereich und lass sie analysieren."); }
    list.sort((a, b) => a.n - b.n || Math.random() - .5);
    const m = list[0];
    pz = {kind:"mistake", fen:m.fen, line:[m.best], tag:"mistake", r:null, ref:m.fen, mode:modeId, played:m.played, opp:m.opp};
  } else {
    const x = pickPuzzle(modeId);
    if (!x) return showHomePanel("Für diese Kategorie gibt es noch keine Rätsel.");
    const p = x.p;
    pz = {kind: p[2].startsWith("mate") ? "mate" : "tactic", fen:p[0], line:p[1].split(" "), tag:p[2], r:p[3], idx:x.i, mode:modeId};
  }
  Object.assign(pz, {step:0, now:pz.fen, failed:false, hinted:false, done:false, side:pz.fen.split(" ")[1]});
  TR.pz = pz;
  const b = TR.board;
  b.enabled = true; b.onMove = puzzleMove;
  b.set(pz.fen, {orient:pz.side});
  const title = pz.kind === "mistake" ? `Dein Fehler gegen ${esc(pz.opp || "?")}` : `${TAGS[pz.tag]} · ca. ${pz.r} Elo`;
  panel(`<div class="ttitle">${title}</div>
    <div class="ttext">${sideTxt(pz.fen)} am Zug. ${pz.kind === "mate" ? "Finde das Matt." : pz.kind === "mistake" ? `In der Partie hast du <b class="mono">${esc(de(sanOf(pz.fen, pz.played)))}</b> gespielt. Finde den besseren Zug.` : "Finde den besten Zug."}</div>
    <div id="tFb" class="fb"></div>`);
  controls([
    {label:"Hinweis", fn:puzzleHint},
    {label:"Lösung zeigen", fn:puzzleSolution},
    {label:"Überspringen", fn:() => startPuzzle(pz.mode)}
  ]);
}
function sanOf(fen, uci){ try { const c = new Chess(fen), m = c.move(U(uci)); return m ? m.san : uci; } catch(e){ return uci; } }
function rate(score){
  const pz = TR.pz; if (pz.rated || pz.kind === "mistake") return; pz.rated = true;
  const exp = 1 / (1 + Math.pow(10, (pz.r - PR.rating) / 400));
  PR.rating = Math.max(100, Math.round(PR.rating + 32 * (score - exp)));
  if (score >= .5) PR.solved++; else PR.failed++;
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
  if (!pz.failed){ pz.failed = true; rate(0); }
  b.enabled = false; b.mark = {sq:m.to, ok:false}; b.render();
  feedback("bad", "Das ist nicht der beste Zug. Versuch es nochmal.");
  setTimeout(() => { if (TR.pz === pz && !pz.done){ b.set(pz.now, {}); b.enabled = true; } }, 800);
}
function puzzleSolved(alt, sq){
  const pz = TR.pz, b = TR.board;
  pz.done = true; b.enabled = false;
  if (sq){ b.mark = {sq, ok:true}; b.render(); }
  if (!pz.failed) rate(pz.hinted ? .5 : 1);
  if (pz.kind === "mistake"){
    const list = loadMistakes(), m = list.find(x => x.fen === pz.ref);
    if (m){ m.n++; if (!pz.failed && !pz.hinted && m.n >= 2){ list.splice(list.indexOf(m), 1); PR.cleared[m.fen] = 1; saveProgress(); } saveMistakes(list); }
    bump("m");
  } else { PR.seen[pz.idx] = 1; saveProgress(); bump("p"); }
  const msg = pz.failed ? "Gelöst, aber nicht im ersten Versuch." : alt ? "Auch richtig! Dein Zug ist genauso stark." : "Gelöst!";
  feedback("good", `${msg}${pz.kind !== "mistake" ? ` Deine Rätselwertung: <b>${PR.rating}</b>` : ""}`);
  controls([
    {label:"Nächstes Rätsel", primary:true, fn:() => startPuzzle(pz.mode)},
    {label:"Lösung ansehen", fn:puzzleSolution},
    {label:"Übersicht", fn:() => showHomePanel()}
  ]);
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
  pz.done = true;
  const b = TR.board; b.enabled = false;
  const c = new Chess(pz.fen), sans = [];
  let i = 0;
  b.set(pz.fen, {});
  const stepFn = () => {
    if (i >= pz.line.length){ feedback("", `Lösung: <b class="mono">${esc(sans.join(" "))}</b>`); return; }
    const before = c.fen(), r = c.move(U(pz.line[i]));
    sans.push(i === 0 || r.color === "w" ? moveLabel(before, r.san) : de(r.san));
    b.set(c.fen(), {last:{from:r.from, to:r.to}}); i++;
    setTimeout(stepFn, 700);
  };
  setTimeout(stepFn, 300);
  controls([
    {label:"Nächstes Rätsel", primary:true, fn:() => startPuzzle(pz.mode)},
    {label:"Übersicht", fn:() => showHomePanel()}
  ]);
}

/* ---------- Lektionen ---------- */
function openLesson(id){
  const les = LESSONS.find(l => l.id === id); if (!les) return;
  TR.mode = "lesson"; TR.ls = {les, i:0};
  showStep();
}
function showStep(){
  const {les, i} = TR.ls, s = les.steps[i], b = TR.board;
  const side = s.fen.split(" ")[1];
  TR.st = {s, path:[], now:s.fen, done:s.type === "info", wrong:0, n:0};
  b.onMove = lessonMove;
  b.enabled = s.type !== "info";
  b.set(s.fen, {orient: s.orient || (s.type === "info" ? "w" : side), arrows:(s.arrows || []).map(u => ({u, c:"#ffaa00"}))});
  const intro = i === 0 && les.intro ? `<p class="muted">${les.intro}</p>` : "";
  panel(`<div class="ttitle">${esc(les.title)} <span class="muted">· Schritt ${i + 1} von ${les.steps.length}</span></div>
    ${intro}<div class="ttext">${s.text}</div>
    ${s.type === "play" ? `<div class="muted" id="tCount">Züge: 0 / ${s.max}</div>` : ""}
    <div id="tFb" class="fb"></div>`);
  lessonControls();
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
  btns.push({label:"Übersicht", fn:() => showHomePanel()});
  controls(btns);
}
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
  if (s.type === "play") return playMove(uci, m, after);
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
async function playMove(uci, m, after){
  const st = TR.st, s = st.s, b = TR.board;
  st.n++; st.now = after;
  b.set(after, {last:{from:m.from, to:m.to}});
  const cnt = $("tCount"); if (cnt) cnt.textContent = `Züge: ${st.n} / ${s.max}`;
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
  controls([{label:"Neu starten", primary:true, fn:showStep}, {label:"Übersicht", fn:() => showHomePanel()}]);
}
function finishLesson(){
  const les = TR.ls.les;
  const first = !PR.lessons[les.id];
  PR.lessons[les.id] = true; saveProgress(); bump("l");
  const next = LESSONS.find(l => !PR.lessons[l.id]);
  panel(`<div class="ttitle">Lektion abgeschlossen</div><div class="ttext">${first ? "Neu gelernt: " : "Wiederholt: "}<b>${esc(les.title)}</b>. Festige es jetzt mit ein paar Rätseln.</div><div id="tFb" class="fb"></div>`);
  controls([
    {label:"Rätsel üben", primary:true, fn:() => startPuzzle(les.chapter === "Mattbilder" ? "mate" : "mix")},
    ...(next ? [{label:"Nächste Lektion", fn:() => openLesson(next.id)}] : []),
    {label:"Übersicht", fn:() => showHomePanel()}
  ]);
}

/* ---------- Übersicht ---------- */
function showHomePanel(note){
  TR.mode = null; TR.board.enabled = false; TR.board.set(START_FEN, {orient:"w"});
  const next = LESSONS.find(l => !PR.lessons[l.id]);
  const mist = loadMistakes().length;
  panel(`<div class="ttitle">Training</div>
    <div class="ttext">${note ? `<p class="fb bad">${note}</p>` : ""}<p>Täglich 15 Minuten reichen: <b>10 Rätsel</b>, <b>eine Lektion</b> und deine <b>eigenen Fehler</b> aus analysierten Partien wiederholen.</p></div>`);
  controls([
    {label:"Rätsel starten", primary:true, fn:() => startPuzzle("mix")},
    ...(next ? [{label:"Nächste Lektion: " + esc(next.title), fn:() => openLesson(next.id)}] : []),
    ...(mist ? [{label:`Eigene Fehler (${mist})`, fn:() => startPuzzle("mistakes")}] : [])
  ]);
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
    <div class="goals">
      <div class="goal"><span>Rätsel</span><b>${Math.min(d.p, GOAL.p)} / ${GOAL.p}</b>${bar(d.p, GOAL.p)}</div>
      <div class="goal"><span>Lektion</span><b>${Math.min(d.l, GOAL.l)} / ${GOAL.l}</b>${bar(d.l, GOAL.l)}</div>
      <div class="goal"><span>Eigene Fehler</span><b>${mist ? Math.min(d.m, GOAL.m) + " / " + GOAL.m : "–"}</b>${bar(mist ? d.m : 0, GOAL.m)}</div>
      <div class="goal"><span>Partie analysiert</span><b>${Math.min(d.a, 1)} / 1</b>${bar(d.a, 1)}</div>
    </div>`;
  const counts = {}; MODES.forEach(m => counts[m.id] = (window.PUZZLES || []).filter(m.f).length);
  $("tModes").innerHTML = MODES.map(m => `<button class="chipbtn" data-mode="${m.id}">${m.label} <small>${counts[m.id]}</small></button>`).join("") +
    `<button class="chipbtn${mist ? "" : " off"}" data-mode="mistakes">Eigene Fehler <small>${mist}</small></button>`;
  const chapters = [...new Set(LESSONS.map(l => l.chapter))];
  const next = LESSONS.find(l => !PR.lessons[l.id]);
  $("tLessons").innerHTML = chapters.map(ch => `<div class="chap">${ch}</div>` +
    LESSONS.filter(l => l.chapter === ch).map(l => `<button class="lesson${PR.lessons[l.id] ? " done" : ""}${next === l ? " next" : ""}" data-id="${l.id}">
      <span class="chk">${PR.lessons[l.id] ? "✓" : ""}</span><span>${esc(l.title)}</span>${next === l ? '<span class="tagnext">Als Nächstes</span>' : ""}</button>`).join("")).join("");
}
function initTraining(){
  if (TR.board) { renderHome(); return; }
  TR.board = new TBoard($("tBoard"));
  $("tModes").onclick = e => { const b = e.target.closest(".chipbtn"); if (b) startPuzzle(b.dataset.mode); };
  $("tLessons").onclick = e => { const b = e.target.closest(".lesson"); if (b) openLesson(b.dataset.id); };
  renderHome(); showHomePanel();
}
window.zwInitTraining = initTraining;
window.zwStartMistakes = () => startPuzzle("mistakes");

/* ---------- Ansicht umschalten (#training) ---------- */
function route(){
  const tr = location.hash === "#training";
  document.body.dataset.view = tr ? "training" : "analyse";
  $("viewAnalyse").hidden = tr; $("viewTraining").hidden = !tr;
  $("navAnalyse").setAttribute("aria-current", tr ? "false" : "page");
  $("navTraining").setAttribute("aria-current", tr ? "page" : "false");
  if (tr){ liveRequest(null); initTraining(); } else render();
}
window.addEventListener("hashchange", route);
route();

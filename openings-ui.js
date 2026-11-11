/* Zugwerk – Eröffnungstrainer: Lernen (Zug für Zug mit Erklärung) und Üben (du spielst, Gegner antwortet aus allen Varianten).
   Nutzt Chess, TBoard, de, moveLabel, esc, $ und die Daten aus openings.js. */
"use strict";

const OP = {board:null, op:null, mode:null, line:null, ply:0, pr:null, timer:null};

/* ---------- Fortschritt ---------- */
function loadOpProgress(){ try { return JSON.parse(localStorage.getItem("zugwerk.openings")) || {}; } catch(e){ return {}; } }
function saveOpProgress(){ try { localStorage.setItem("zugwerk.openings", JSON.stringify(OP.pr)); } catch(e){} if (window.zwSyncSoon) zwSyncSoon(); }
function lineStat(id){ return OP.pr[id] || (OP.pr[id] = {seen:false, ok:0, err:0, last:0}); }

/* ---------- Hilfen ---------- */
const allLines = op => op.groups.flatMap(g => g.lines);
const mvList = line => line.moves.split(" ");
function fenAt(line, ply){ const c = new Chess(); mvList(line).slice(0, ply).forEach(s => c.move(s)); return c; }
function lastMove(line, ply){
  if (!ply) return null;
  const c = fenAt(line, ply - 1), m = c.move(mvList(line)[ply - 1]);
  return m ? {from:m.from, to:m.to} : null;
}
function commentFor(op, path, mine){
  if (!path.length) return "Ausgangsstellung. Weiß beginnt.";
  const c = op.comments[path.join(" ")];
  if (c) return c;
  const san = de(path[path.length - 1]);
  return mine ? `${san}: Weiter mit dem gewohnten Aufbau.` : `Der Gegner spielt ${san}.`;
}
const isMine = (op, ply) => (ply % 2 === 0) === (op.side === "w"); // Zug Nummer ply (0-basiert) gehört mir?

/* ---------- Übersicht rechts ---------- */
function renderOpList(){
  const op = OP.op, el = $("oInfo");
  const lines = allLines(op), learned = lines.filter(l => lineStat(l.id).seen).length;
  el.innerHTML = `
    <div class="ophead"><div><div class="ttitle">${esc(op.name)}</div><div class="muted">${op.side === "w" ? "Du spielst Weiß" : "Du spielst Schwarz"} · ${op.eco}</div></div>
      <div class="opcount"><b>${learned}</b>/${lines.length}<div class="muted">gelernt</div></div></div>
    <p class="ttext">${op.summary}</p>
    <details open><summary>Die Idee</summary><ul class="ttext">${op.idea.map(x => `<li>${x}</li>`).join("")}</ul></details>
    <details><summary>Typische Fehler</summary><ul class="ttext">${op.mistakes.map(x => `<li>${x}</li>`).join("")}</ul></details>
    <div class="row" style="margin-top:12px">
      <button class="btn primary" data-act="drill" data-set="system">Alle Varianten üben</button>
      <button class="btn" data-act="drill" data-set="ng5">Angriff 4. Sg5 üben</button>
    </div>`;
  $("oLines").innerHTML = op.groups.map(g => `<div class="chap">${esc(g.title)}</div><div class="muted gnote">${esc(g.note)}</div>` +
    g.lines.map(l => {
      const s = lineStat(l.id), tries = s.ok + s.err;
      const badge = l.practice === false ? '<span class="lt warn">nur ansehen</span>' : tries ? `<span class="lt">${Math.round(s.ok / tries * 100)} % richtig</span>` : "";
      const cur = OP.line === l ? " cur" : "";
      return `<div class="lrow${cur}"><span class="chk${s.seen ? " on" : ""}">${s.seen ? "✓" : ""}</span>
        <button class="lname" data-act="learn" data-id="${l.id}">${esc(l.name)}</button>${badge}
        ${l.practice === false ? "" : `<button class="btn sm" data-act="drill1" data-id="${l.id}">Üben</button>`}</div>`;
    }).join("")).join("");
}

/* ---------- Zugliste der aktuellen Variante ---------- */
function renderMoveList(){
  const el = $("oMoves"), line = OP.line;
  if (!line){ el.innerHTML = '<div class="empty">Wähle rechts eine Variante.</div>'; return; }
  const mv = mvList(line), visible = OP.mode === "learn" ? mv.length : OP.ply;
  const c = new Chess(); let h = "";
  mv.forEach((s, i) => {
    const before = c.fen(); c.move(s);
    if (i >= visible) return;
    if (i % 2 === 0) h += `<span class="mnum">${i / 2 + 1}.</span>`;
    h += `<button class="omv${OP.ply === i + 1 ? " cur" : ""}" data-ply="${i + 1}">${esc(de(s))}</button>`;
  });
  el.innerHTML = h || '<div class="empty">Noch keine Züge.</div>';
}

/* ---------- Lernen ---------- */
function learn(id, ply){
  const line = allLines(OP.op).find(l => l.id === id); if (!line) return;
  clearTimeout(OP.timer);
  OP.mode = "learn"; OP.line = line; OP.ply = ply || 0;
  showLearn();
  renderOpList();
}
function showLearn(){
  const op = OP.op, line = OP.line, mv = mvList(line), ply = OP.ply, b = OP.board;
  const c = fenAt(line, ply), path = mv.slice(0, ply);
  const next = mv[ply];
  let arrows = [];
  if (next){ const t = new Chess(c.fen()), m = t.move(next); arrows = [{u:m.from + m.to, c: isMine(op, ply) ? "rgba(129,182,76,.9)" : "rgba(255,170,0,.6)"}]; }
  b.enabled = !!next && isMine(op, ply); b.onMove = learnMove;
  b.set(c.fen(), {orient:op.side, last:lastMove(line, ply), arrows});
  const end = ply >= mv.length;
  $("oPanel").innerHTML = `<div class="ttitle">${esc(line.name)} <span class="muted">· Zug ${Math.ceil(ply / 2) || 0} von ${Math.ceil(mv.length / 2)}</span></div>
    <div class="ttext">${ply ? `<b class="mono">${esc(moveLabel(fenAt(line, ply - 1).fen(), mv[ply - 1]))}</b> ` : ""}${commentFor(op, path, ply ? isMine(op, ply - 1) : false)}</div>
    ${next ? `<div class="muted">${isMine(op, ply) ? "Dein nächster Zug ist grün markiert. Zieh ihn selbst oder klick auf Weiter." : "Orange: So antwortet der Gegner."}</div>` : `<div class="fb good">Variante zu Ende. Jetzt üben, damit sie sitzt.</div>`}
    <div id="oFb" class="fb"></div>`;
  if (end){ lineStat(line.id).seen = true; saveOpProgress(); renderOpList(); }
  const btns = [
    {label:"⏮", fn:() => { OP.ply = 0; showLearn(); }, disabled: ply === 0},
    {label:"◀", fn:() => { OP.ply--; showLearn(); }, disabled: ply === 0},
    {label:"Weiter ▶", primary:!end, fn:() => { OP.ply++; showLearn(); }, disabled: end}
  ];
  if (line.practice !== false) btns.push({label:"Diese Variante üben", primary:end, fn:() => drill([line])});
  btns.push({label:"Im Analysebrett öffnen", fn:openInAnalysis});
  opControls(btns);
  renderMoveList();
}
function learnMove(uci, m){
  const line = OP.line, next = mvList(line)[OP.ply];
  const t = fenAt(line, OP.ply), want = t.move(next);
  if (want && want.from === m.from && want.to === m.to){ OP.ply++; showLearn(); return; }
  OP.board.mark = {sq:m.to, ok:false}; OP.board.render();
  $("oFb").className = "fb bad"; $("oFb").textContent = `In der Theorie folgt ${de(next)}. Das ist grün markiert.`;
  setTimeout(() => showLearn(), 900);
}
function openInAnalysis(){
  const line = OP.line, mv = mvList(line).slice(0, Math.max(OP.ply, 1));
  const c = new Chess(); mv.forEach(s => c.move(s));
  c.header("Event", OP.op.name, "White", OP.op.side === "w" ? "Du" : "Gegner", "Black", OP.op.side === "w" ? "Gegner" : "Du");
  try {
    setGame(parseGame(c.pgn()), OP.op.side === "b");
    location.hash = "";
    setTimeout(() => go(Infinity), 50);
  } catch(e){}
}

/* ---------- Üben ---------- */
function drill(lines){
  lines = lines.filter(l => l.practice !== false);
  if (!lines.length) return;
  clearTimeout(OP.timer);
  OP.mode = "drill"; OP.pool = lines; OP.round = {ok:0, err:0, done:0};
  nextRound();
}
function pickLine(cands){
  // Schwache und lange nicht geübte Varianten kommen öfter dran
  const w = cands.map(l => { const s = lineStat(l.id); return 1 + s.err * 2 + (s.ok + s.err === 0 ? 3 : 0) + Math.min(3, (Date.now() - (s.last || 0)) / 864e5); });
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < cands.length; i++){ r -= w[i]; if (r <= 0) return cands[i]; }
  return cands[cands.length - 1];
}
function nextRound(){
  OP.path = []; OP.line = pickLine(OP.pool); OP.ply = 0; OP.missed = false;
  OP.board.onMove = drillMove;
  drillStep();
}
function candidates(){ return OP.pool.filter(l => { const mv = mvList(l); return OP.path.every((s, i) => mv[i] === s) && mv.length > OP.path.length; }); }
function drillStep(){
  const op = OP.op, b = OP.board;
  const c = new Chess(); OP.path.forEach(s => c.move(s));
  const ply = OP.path.length;
  const cands = candidates();
  if (!cands.length) return roundDone();
  if (!cands.includes(OP.line)) OP.line = pickLine(cands);
  b.set(c.fen(), {orient:op.side, last: ply ? lastMove({moves:OP.path.join(" ")}, ply) : null});
  if (isMine(op, ply)){
    b.enabled = true;
    drillPanel(ply === 0 ? "Du hast Weiß. Spiel den ersten Zug." : `Gegner: <b class="mono">${esc(moveLabel(fenAt({moves:OP.path.join(" ")}, ply - 1).fen(), OP.path[ply - 1]))}</b>. ${opponentHint(ply)} Dein Zug?`);
  } else {
    b.enabled = false;
    drillPanel("Der Gegner überlegt …");
    // Gegner wählt eine der Varianten, die zu dieser Stellung passen
    const line = pickLine(cands); OP.line = line;
    OP.timer = setTimeout(() => { OP.path.push(mvList(line)[ply]); OP.ply = OP.path.length; drillStep(); }, 500);
  }
  renderMoveListDrill();
}
function opponentHint(ply){
  const op = OP.op, path = OP.path.slice(0, ply), txt = op.comments[path.join(" ")];
  return txt && /Fehler|Falle|Achtung/.test(txt) ? "<b>Achtung, hier gibt es etwas zu holen!</b>" : "";
}
function drillPanel(msg){
  const r = OP.round;
  $("oPanel").innerHTML = `<div class="ttitle">Üben <span class="muted">· ${OP.pool.length === 1 ? esc(OP.pool[0].name) : OP.pool.length + " Varianten"}</span></div>
    <div class="ttext">${msg}</div><div id="oFb" class="fb"></div>
    <div class="muted">Diese Runde: ${r.done} Varianten, ${r.ok} richtige Züge, ${r.err} Fehler</div>`;
  opControls([
    {label:"Lösung zeigen", fn:showDrillSolution},
    {label:"Neue Variante", fn:nextRound},
    {label:"Zum Lernen", fn:() => learn(OP.line.id, OP.path.length)}
  ]);
}
function drillMove(uci, m, after){
  const op = OP.op, b = OP.board, ply = OP.path.length;
  const cands = candidates(), want = mvList(cands[0])[ply];
  const t = new Chess(); OP.path.forEach(s => t.move(s));
  const w = t.move(want);
  if (w && w.from === m.from && w.to === m.to && (w.promotion || "q") === (m.promotion || "q")){
    OP.round.ok++;
    OP.path.push(want); OP.ply = OP.path.length;
    b.set(after, {last:{from:m.from, to:m.to}, mark:{sq:m.to, ok:true}});
    const txt = op.comments[OP.path.join(" ")];
    b.enabled = false;
    const ends = !candidates().length;
    OP.timer = setTimeout(() => { drillStep(); if (txt && !ends) { const f = $("oFb"); if (f){ f.className = "fb"; f.innerHTML = `<span class="muted">Zu ${esc(de(want))}:</span> ${txt}`; } } }, 450);
    return;
  }
  OP.round.err++; OP.missed = true;
  const s = lineStat(OP.line.id); s.err++; s.last = Date.now(); saveOpProgress();
  b.set(after, {last:{from:m.from, to:m.to}, mark:{sq:m.to, ok:false}});
  b.enabled = false;
  const why = op.comments[[...OP.path, want].join(" ")] || "";
  const f = $("oFb"); f.className = "fb bad";
  f.innerHTML = `Nicht ganz. In dieser Stellung spielst du <b class="mono">${esc(de(want))}</b>. ${why}`;
  OP.timer = setTimeout(() => {
    const back = new Chess(); OP.path.forEach(x => back.move(x));
    b.set(back.fen(), {last: ply ? lastMove({moves:OP.path.join(" ")}, ply) : null, arrows:[{u:w.from + w.to, c:"rgba(129,182,76,.9)"}]});
    b.enabled = true;
  }, 1100);
}
function showDrillSolution(){
  if (OP.mode !== "drill") return;
  const ply = OP.path.length, cands = candidates(); if (!cands.length) return;
  if (!isMine(OP.op, ply)) return;
  const want = mvList(cands[0])[ply], c = new Chess(); OP.path.forEach(s => c.move(s));
  const w = c.move(want);
  OP.missed = true;
  OP.board.arrows = [{u:w.from + w.to, c:"rgba(129,182,76,.9)"}]; OP.board.render();
  const f = $("oFb"); f.className = "fb"; f.innerHTML = `Hier spielst du <b class="mono">${esc(de(want))}</b>.`;
}
function roundDone(){
  const line = OP.line, s = lineStat(line.id);
  if (!OP.missed) s.ok++;
  s.seen = true; s.last = Date.now(); saveOpProgress();
  OP.round.done++;
  renderOpList();
  OP.board.enabled = false;
  const last = OP.path.join(" "), txt = OP.op.comments[last] || "";
  $("oPanel").innerHTML = `<div class="ttitle">${OP.missed ? "Variante durchgespielt" : "Fehlerfrei!"} <span class="muted">· ${esc(line.name)}</span></div>
    <div class="ttext">${txt}</div><div id="oFb" class="fb ${OP.missed ? "" : "good"}">${OP.missed ? "Diese Variante kommt bald nochmal dran." : "Sitzt. Weiter mit der nächsten."}</div>
    <div class="muted">Diese Runde: ${OP.round.done} Varianten, ${OP.round.ok} richtige Züge, ${OP.round.err} Fehler</div>`;
  opControls([
    {label:"Nächste Variante", primary:true, fn:nextRound},
    {label:"Variante ansehen", fn:() => learn(line.id, mvList(line).length)},
    {label:"Im Analysebrett öffnen", fn:() => { OP.ply = OP.path.length; openInAnalysis(); }}
  ]);
  renderMoveListDrill();
}
function renderMoveListDrill(){
  const el = $("oMoves"), c = new Chess(); let h = "";
  OP.path.forEach((s, i) => { c.move(s); if (i % 2 === 0) h += `<span class="mnum">${i / 2 + 1}.</span>`; h += `<span class="omv">${esc(de(s))}</span>`; });
  el.innerHTML = h || '<div class="empty">Noch keine Züge.</div>';
}

/* ---------- Steuerung ---------- */
function opControls(btns){
  $("oCtl").innerHTML = btns.map((b, i) => `<button class="btn${b.primary ? " primary" : ""}" data-i="${i}"${b.disabled ? " disabled" : ""}>${b.label}</button>`).join("");
  $("oCtl").onclick = e => { const x = e.target.closest("button"); if (x && !x.disabled) btns[+x.dataset.i].fn(); };
}
function initOpenings(){
  OP.pr = loadOpProgress();
  if (OP.board){ renderOpList(); return; }
  OP.op = OPENINGS[0];
  OP.board = new TBoard($("oBoard"));
  $("oInfo").onclick = e => { const b = e.target.closest("[data-act]"); if (!b) return; if (b.dataset.act === "drill") drill(allLines(OP.op).filter(l => l.set === b.dataset.set)); };
  $("oLines").onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const line = allLines(OP.op).find(l => l.id === b.dataset.id);
    if (b.dataset.act === "learn") learn(line.id, 0);
    if (b.dataset.act === "drill1") drill([line]);
  };
  $("oMoves").onclick = e => { const b = e.target.closest(".omv[data-ply]"); if (b && OP.mode === "learn"){ OP.ply = +b.dataset.ply; showLearn(); } };
  document.addEventListener("keydown", e => {
    if (document.body.dataset.view !== "openings" || OP.mode !== "learn" || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" && OP.ply < mvList(OP.line).length){ OP.ply++; showLearn(); e.preventDefault(); }
    if (e.key === "ArrowLeft" && OP.ply > 0){ OP.ply--; showLearn(); e.preventDefault(); }
  });
  renderOpList();
  learn(allLines(OP.op)[0].id, 0);
}
window.zwInitOpenings = initOpenings;
window.zwOpeningsReload = () => { OP.pr = loadOpProgress(); if (OP.board) renderOpList(); };

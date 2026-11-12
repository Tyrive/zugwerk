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
      <button class="btn" data-act="bot">Gegen Bot spielen</button>
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
  clearTimeout(OP.timer); BOT.tok++;
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
  clearTimeout(OP.timer); BOT.tok++;
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


/* ---------- Eigene Partien mit dieser Eröffnung ---------- */
const OG = {games:null, user:"", sel:null};
async function fetchRecentGames(user, months){
  const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(user)}/games/archives`);
  if (r.status === 404) throw new Error(`Spieler „${user}“ wurde auf chess.com nicht gefunden.`);
  if (!r.ok) throw new Error(`chess.com antwortet mit Status ${r.status}.`);
  const {archives} = await r.json();
  let games = [];
  for (const a of (archives || []).slice(-months).reverse()){
    const res = await fetch(a); if (!res.ok) continue;
    const d = await res.json(); games = games.concat(d.games || []);
  }
  return games.filter(g => g.rules === "chess" && g.pgn).sort((a, b) => b.end_time - a.end_time);
}
// Vergleicht eine Partie mit dem Repertoire: Wie lange war sie in der Theorie, und wer ist zuerst abgewichen?
function compareWithTheory(op, sans, myColor){
  const lines = allLines(op).filter(l => l.practice !== false).sort((a, b) => (a.set === "system" ? 0 : 1) - (b.set === "system" ? 0 : 1));
  const path = [];
  let best = lines[0], trap = null;
  for (let i = 0; i < sans.length; i++){
    const cands = lines.filter(l => { const mv = mvList(l); return path.every((s, k) => mv[k] === s) && mv.length > i; });
    if (!cands.length) return {inTheory:i, dev:null, line:best, trap, end:true};
    best = cands[0];
    const s = sans[i], match = cands.find(l => mvList(l)[i] === s);
    const mine = (i % 2 === 0) === (myColor === "w");
    if (!match) return {inTheory:i, dev:{ply:i, by: mine ? "me" : "opp", played:s, expected:mvList(cands[0])[i]}, line:cands[0], trap};
    best = match; path.push(s);
    const c = op.comments[path.join(" ")] || "";
    if (mine && !trap && /Fehler|Ungenau/.test(c)){
      // Bessere Alternative aus dem Repertoire an derselben Stelle (ein Zug ohne Fehler-Kommentar)
      const alt = [...new Set(cands.map(l => mvList(l)[i]))].find(m => m !== s && !/Fehler|Ungenau/.test(op.comments[[...path.slice(0, -1), m].join(" ")] || ""));
      trap = {ply:i, text:c, played:s, better:alt || null};
    }
  }
  return {inTheory:sans.length, dev:null, line:best, trap, end:false};
}
async function loadOpeningGames(){
  const op = OP.op, inp = $("ogUser"), user = (inp.value || "").trim().toLowerCase(), msg = $("ogMsg");
  if (!user){ msg.className = "msg err"; msg.textContent = "Bitte deinen chess.com-Namen eingeben."; return; }
  try { localStorage.setItem("zugwerk.user", user); } catch(e){}
  msg.className = "msg"; msg.textContent = "Lade deine Partien der letzten 3 Monate …"; $("ogList").innerHTML = "";
  try {
    const raw = await fetchRecentGames(user, 3), out = [];
    for (const g of raw){
      const meW = g.white.username.toLowerCase() === user;
      let sans;
      try { const c = new Chess(); if (!c.load_pgn(g.pgn, {sloppy:true})) continue; sans = c.history(); } catch(e){ continue; }
      // Als Weiß: alles nach 1. e4 e5 2. Sf3 (dein Repertoire). Als Schwarz: wenn der Gegner Italienisch spielt.
      const ok = meW ? sans.slice(0, 3).join(" ") === "e4 e5 Nf3" : sans.slice(0, 5).join(" ") === "e4 e5 Nf3 Nc6 Bc4";
      if (!ok) continue;
      const me = meW ? g.white : g.black, opp = meW ? g.black : g.white;
      const res = me.result === "win" ? "win" : ["agreed","repetition","stalemate","insufficient","50move","timevsinsufficient"].includes(me.result) ? "draw" : "loss";
      out.push({g, sans, meW, opp, res, cmp:compareWithTheory(op, sans, meW ? "w" : "b"), date:new Date(g.end_time * 1000)});
      if (out.length >= 30) break;
    }
    OG.games = out; OG.user = user;
    msg.textContent = out.length ? `${out.length} Partien mit dieser Eröffnung gefunden.` : "Keine Partien mit dieser Eröffnung in den letzten 3 Monaten gefunden.";
    renderOpeningGames();
  } catch(e){
    msg.className = "msg err";
    msg.textContent = e instanceof TypeError ? "chess.com ist gerade nicht erreichbar." : e.message;
  }
}
function renderOpeningGames(){
  const el = $("ogList"), gs = OG.games || [];
  if (!gs.length){ el.innerHTML = ""; $("ogSummary").innerHTML = ""; return; }
  // Zusammenfassung: wo weichst du am häufigsten ab?
  const mine = gs.filter(x => x.cmp.dev && x.cmp.dev.by === "me");
  const count = {};
  mine.forEach(x => { const k = x.cmp.dev.ply + "|" + x.cmp.dev.played + "|" + x.cmp.dev.expected; count[k] = (count[k] || 0) + 1; });
  const top = Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const avg = Math.round(gs.reduce((a, x) => a + x.cmp.inTheory, 0) / gs.length / 2 * 10) / 10;
  $("ogSummary").innerHTML = `<div class="stats">
      <div><div class="big">${gs.length}</div><div class="muted">Partien</div></div>
      <div><div class="big">${avg}</div><div class="muted">Züge in der Theorie (Schnitt)</div></div>
      <div><div class="big">${mine.length}</div><div class="muted">selbst abgewichen</div></div></div>
    ${top.length ? `<div class="ttext"><b>Deine häufigsten Abweichungen:</b><ul>${top.map(([k, n]) => { const [ply, p, e] = k.split("|"); return `<li>Zug ${Math.floor(+ply / 2) + 1}: <b class="mono">${esc(de(p))}</b> statt <b class="mono">${esc(de(e))}</b> (${n}×)</li>`; }).join("")}</ul></div>` : ""}`;
  const RES = {win:"Sieg", loss:"Niederlage", draw:"Remis"};
  el.innerHTML = gs.map((x, i) => {
    const d = x.cmp.dev, n = d ? Math.floor(d.ply / 2) + 1 : 0;
    const tag = x.cmp.trap ? `<span class="lt bad">Falle</span>` : d ? (d.by === "me" ? `<span class="lt bad">Du: Zug ${n}</span>` : `<span class="lt warn">Gegner: Zug ${n}</span>`) : `<span class="lt good">Theorie</span>`;
    return `<button class="game${OG.sel === i ? " sel" : ""}" data-i="${i}" style="grid-template-columns:10px minmax(0,1fr) auto auto">
      <span class="dot ${x.meW ? "w" : "b"}"></span>
      <span class="opp">${esc(x.opp.username)} <small>${x.opp.rating}</small><br><small>${x.date.toLocaleDateString("de-DE", {day:"2-digit", month:"2-digit"})} · <span class="res ${x.res}">${RES[x.res]}</span> · ${esc(x.cmp.line.name)}</small></span>
      ${tag}<span></span></button>`;
  }).join("");
}
function showOpeningGame(i, ply){
  const x = OG.games[i]; if (!x) return;
  clearTimeout(OP.timer);
  OG.sel = i; OP.mode = "game"; OP.line = x.cmp.line; BOT.tok++;
  const op = OP.op, d = x.cmp.dev, sans = x.sans;
  const focus = ply != null ? ply : x.cmp.trap ? x.cmp.trap.ply : d ? d.ply : x.cmp.inTheory;
  OG.ply = Math.max(0, Math.min(sans.length, focus));
  const c = new Chess(); sans.slice(0, OG.ply).forEach(s => c.move(s));
  const atDev = d && OG.ply === d.ply, tr = x.cmp.trap, atTrap = tr && OG.ply === tr.ply;
  let arrows = [];
  if (atTrap){
    const t1 = new Chess(c.fen()), p = t1.move(tr.played);
    if (p) arrows.push({u:p.from + p.to, c:"rgba(241,92,92,.85)"});
    if (tr.better){ const t2 = new Chess(c.fen()), e = t2.move(tr.better); if (e) arrows.push({u:e.from + e.to, c:"rgba(129,182,76,.9)"}); }
  }
  if (atDev){
    const t1 = new Chess(c.fen()), p = t1.move(d.played), t2 = new Chess(c.fen()), e = t2.move(d.expected);
    if (p) arrows.push({u:p.from + p.to, c:"rgba(241,92,92,.85)"});
    if (e) arrows.push({u:e.from + e.to, c:"rgba(129,182,76,.9)"});
  }
  let last = null;
  if (OG.ply){ const t = new Chess(); sans.slice(0, OG.ply - 1).forEach(s => t.move(s)); const m = t.move(sans[OG.ply - 1]); last = {from:m.from, to:m.to}; }
  OP.board.enabled = false;
  OP.board.set(c.fen(), {orient: x.meW ? "w" : "b", last, arrows});
  const n = Math.floor(OG.ply / 2) + 1;
  let txt;
  if (atDev && d.by === "me"){
    const why = op.comments[[...sans.slice(0, d.ply), d.expected].join(" ")] || "";
    txt = `<b>Hier hast du die Theorie verlassen.</b> Gespielt: <b class="mono">${esc(de(d.played))}</b> (rot). Richtig ist <b class="mono">${esc(de(d.expected))}</b> (grün). ${why}<div id="ogEng" class="texp"></div>`;
  } else if (atDev){
    txt = `<b>Hier hat dein Gegner die Theorie verlassen</b> mit <b class="mono">${esc(de(d.played))}</b>. In deinem Repertoire steht <b class="mono">${esc(de(d.expected))}</b>. Ab hier gilt der Plan: Figuren entwickeln, rochieren, Zentrum halten. Achte darauf, ob der Zug etwas einstellt.<div id="ogEng" class="texp"></div>`;
  } else if (atTrap){
    txt = `<b>Hier bist du in eine bekannte Falle gelaufen.</b> Gespielt: <b class="mono">${esc(de(tr.played))}</b> (rot). ${tr.text}${tr.better ? ` Besser ist <b class="mono">${esc(de(tr.better))}</b> (grün): ${op.comments[[...sans.slice(0, tr.ply), tr.better].join(" ")] || ""}` : ""} Klick auf ▶, um zu sehen, wie es weitergeht.`;
  } else if (OG.ply <= x.cmp.inTheory){
    const bf = (() => { const t = new Chess(); sans.slice(0, Math.max(0, OG.ply - 1)).forEach(s => t.move(s)); return t.fen(); })();
    txt = (OG.ply ? `<b class="mono">${esc(moveLabel(bf, sans[OG.ply - 1]))}</b>: ` : "") + (commentFor(op, sans.slice(0, OG.ply), OG.ply ? ((OG.ply - 1) % 2 === 0) === x.meW : false)) + ` <span class="muted">(Theorie)</span>`;
  } else {
    txt = `Zug ${n}: Außerhalb der Theorie. Für eine genaue Bewertung öffne die Partie im Analysebrett.`;
  }
  const status = x.cmp.dev ? `${x.cmp.inTheory} Halbzüge nach Theorie` : `komplett nach Theorie (${x.cmp.inTheory} Halbzüge)`;
  $("oPanel").innerHTML = `<div class="ttitle">Gegen ${esc(x.opp.username)} <span class="muted">· ${status}</span></div><div class="ttext">${txt}</div><div id="oFb" class="fb"></div>`;
  // Engine: Was kostet die Abweichung bzw. was ist die beste Antwort?
  if (atDev){
    (async () => {
      try {
        const fen = c.fen();
        if (d.by === "me"){
          const wP = await moverWin(fen, uciOf(fen, d.played), 14), wE = await moverWin(fen, uciOf(fen, d.expected), 14);
          const diff = Math.round(wE - wP);
          const box = $("ogEng"); if (box && OG.sel === i && OG.ply === d.ply)
            box.innerHTML = diff >= 3 ? `Stockfish: Dein Zug kostet etwa <b>${diff} %</b> Gewinnchance (${Math.round(wP)} % statt ${Math.round(wE)} %).` : `Stockfish: Dein Zug ist praktisch gleichwertig (${Math.round(wP)} % gegenüber ${Math.round(wE)} %). Trotzdem lohnt es sich, beim Repertoire zu bleiben.`;
        } else {
          const t = new Chess(fen); t.move(d.played);
          const r = await search(t.fen(), 14), steps = walk(t.fen(), r.pv, 3);
          const box = $("ogEng"); if (box && OG.sel === i && OG.ply === d.ply)
            box.innerHTML = `Stockfish empfiehlt als Antwort: <b>${lineTxt(steps, 3)}</b>. Gewinnchance danach: ${Math.round(r.win)} % für dich.`;
        }
      } catch(e){}
    })();
  }
  opControls([
    {label:"◀", disabled: OG.ply === 0, fn:() => showOpeningGame(i, OG.ply - 1)},
    {label:"▶", disabled: OG.ply >= sans.length, fn:() => showOpeningGame(i, OG.ply + 1)},
    ...(d ? [{label:"Zur Abweichung", fn:() => showOpeningGame(i, d.ply)}] : []),
    ...(tr ? [{label:"Zur Falle", fn:() => showOpeningGame(i, tr.ply)}] : []),
    {label:"Variante lernen", primary:true, fn:() => learn(x.cmp.line.id, Math.min(d ? d.ply : x.cmp.inTheory, mvList(x.cmp.line).length))},
    {label:"Partie analysieren", fn:() => { try { setGame(parseGame(x.g.pgn), !x.meW); S.me = x.meW ? "w" : "b"; location.hash = ""; setTimeout(() => { go(OG.ply); runAnalysis(); }, 50); } catch(e){} }}
  ]);
  // Zugliste: Theorie grün, Abweichung rot
  let h = "";
  sans.forEach((s, k) => {
    if (k % 2 === 0) h += `<span class="mnum">${k / 2 + 1}.</span>`;
    const cls = d && k === d.ply ? " dev" : k < x.cmp.inTheory ? " th" : "";
    h += `<button class="omv${cls}${OG.ply === k + 1 ? " cur" : ""}" data-gply="${k + 1}">${esc(de(s))}</button>`;
  });
  $("oMoves").innerHTML = h;
  renderOpeningGames();
}
function uciOf(fen, san){ const c = new Chess(fen), m = c.move(san); return m ? m.from + m.to + (m.promotion || "") : ""; }
function initOpeningGames(){
  let u = ""; try { u = localStorage.getItem("zugwerk.user") || ""; } catch(e){}
  $("ogUser").value = u;
  $("ogForm").onsubmit = e => { e.preventDefault(); loadOpeningGames(); };
  $("ogList").onclick = e => { const b = e.target.closest(".game"); if (b) showOpeningGame(+b.dataset.i); };
}


/* ---------- Bot: Eröffnung in einer echten Partie üben ---------- */
const BOT = {eng:null, ready:null, g:null, tok:0};
const BOT_LEVELS = [
  {id:"400",  name:"Anfänger (~400)",       depth:5,  mpv:6, blunder:.20, spread:400},
  {id:"700",  name:"Einsteiger (~700)",     depth:7,  mpv:5, blunder:.09, spread:220},
  {id:"1000", name:"Fortgeschritten (~1000)", depth:9, mpv:4, blunder:.04, spread:110},
  {id:"1400", name:"Vereinsspieler (~1400)", depth:12, mpv:3, blunder:.01, spread:45},
  {id:"max",  name:"Stockfish (volle Stärke)", depth:18, mpv:1, blunder:0, spread:0}
];
function botCfg(){ try { return Object.assign({color:"w", level:"400"}, JSON.parse(localStorage.getItem("zugwerk.botcfg")) || {}); } catch(e){ return {color:"w", level:"400"}; } }
function saveBotCfg(c){ try { localStorage.setItem("zugwerk.botcfg", JSON.stringify(c)); } catch(e){} }
function botEngine(){ if (!BOT.ready) BOT.ready = makeEngine().then(e => { BOT.eng = e; }); return BOT.ready; }
async function botLines(fen, depth, mpv){
  await botEngine();
  const e = BOT.eng, lines = {};
  e.send("setoption name MultiPV value " + mpv);
  const f = l => {
    if (!l.startsWith("info") || !l.includes(" pv ") || /bound/.test(l)) return;
    const k = +(l.match(/ multipv (\d+)/) || [0, 1])[1], s = l.match(/score (cp|mate) (-?\d+)/); if (!s) return;
    const v = +s[2], cp = s[1] === "mate" ? (v > 0 ? 100000 - v : -100000 - v) : v;
    lines[k] = {uci:l.match(/ pv (\S+)/)[1], cp};
  };
  e.ls.push(f); e.send("position fen " + fen); e.send("go depth " + depth);
  const bm = await e.until(l => l.startsWith("bestmove"));
  e.ls = e.ls.filter(x => x !== f);
  const out = Object.values(lines);
  return out.length ? out : [{uci:bm.split(" ")[1], cp:0}];
}
// Schwächere Stufen wählen nicht immer den besten Zug und patzen gelegentlich
async function botChoose(fen, lv){
  const c = new Chess(fen), legal = c.moves({verbose:true});
  if (Math.random() < lv.blunder){ const m = legal[Math.floor(Math.random() * legal.length)]; return m.from + m.to + (m.promotion || ""); }
  const lines = await botLines(fen, lv.depth, lv.mpv);
  const best = Math.max(...lines.map(x => x.cp));
  const ok = lines.filter(x => x.cp >= best - lv.spread);
  const w = ok.map(x => 1 / (1 + (best - x.cp) / 60));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < ok.length; i++){ r -= w[i]; if (r <= 0) return ok[i].uci; }
  return ok[0].uci;
}
const bookLines = () => allLines(OP.op).filter(l => l.practice !== false);
function bookCands(path){ return bookLines().filter(l => { const mv = mvList(l); return path.every((s, i) => mv[i] === s) && mv.length > path.length; }); }

function showBotSetup(){
  clearTimeout(OP.timer); BOT.tok++;
  OP.mode = "botsetup"; OP.board.enabled = false;
  const cfg = botCfg();
  OP.board.set(START_FEN, {orient:cfg.color});
  $("oPanel").innerHTML = `<div class="ttitle">Gegen den Bot spielen</div>
    <div class="ttext">Der Bot spielt die ersten Züge nach der Theorie und wählt dabei zufällig verschiedene Varianten, auch die Fallen. Weichst du ab, sagt er dir, was die Theorie wäre. Danach spielt er in der gewählten Stärke weiter.</div>
    <div class="botopts">
      <label>Deine Farbe <select id="botColor"><option value="w"${cfg.color === "w" ? " selected" : ""}>Weiß (dein Repertoire)</option><option value="b"${cfg.color === "b" ? " selected" : ""}>Schwarz (gegen Italienisch)</option></select></label>
      <label>Stärke <select id="botLevel">${BOT_LEVELS.map(l => `<option value="${l.id}"${cfg.level === l.id ? " selected" : ""}>${l.name}</option>`).join("")}</select></label>
    </div><div id="oFb" class="fb"></div>`;
  opControls([{label:"Partie starten", primary:true, fn:() => {
    const c = {color:$("botColor").value, level:$("botLevel").value}; saveBotCfg(c); startBot(c);
  }}]);
  $("oMoves").innerHTML = '<div class="empty">Noch keine Züge.</div>';
}
function startBot(cfg){
  clearTimeout(OP.timer);
  BOT.tok++;
  BOT.g = {color:cfg.color, lv:BOT_LEVELS.find(l => l.id === cfg.level) || BOT_LEVELS[0], sans:[], left:null, over:null, msg:"", warn:null};
  OP.mode = "bot"; OP.board.onMove = botUserMove;
  botRender();
  if (cfg.color === "b") botTurn();
  else { BOT.g.msg = "Du hast Weiß. Spiel deinen ersten Zug."; botRender(); }
}
function botGameObj(){ const c = new Chess(); BOT.g.sans.forEach(s => c.move(s)); return c; }
function botRender(){
  const g = BOT.g, c = botGameObj(), b = OP.board, n = g.sans.length;
  let last = null;
  if (n){ const t = new Chess(); g.sans.slice(0, -1).forEach(s => t.move(s)); const m = t.move(g.sans[n - 1]); last = {from:m.from, to:m.to}; }
  const myTurn = !g.over && (c.turn() === g.color);
  b.enabled = myTurn && !g.warn; b.onMove = botUserMove;
  b.set(c.fen(), {orient:g.color, last, arrows:g.arrows || []});
  const book = g.left === null ? `<span class="lt good">in der Theorie (${Math.ceil(n / 2)}. Zug)</span>` : `<span class="lt warn">Theorie verlassen bei Zug ${Math.floor(g.left / 2) + 1}</span>`;
  $("oPanel").innerHTML = `<div class="ttitle">Partie gegen ${esc(g.lv.name)} ${book}</div>
    <div class="ttext">${g.msg || ""}</div>
    ${g.warn ? `<div class="fb bad">${g.warn}</div>` : ""}
    ${g.over ? `<div class="fb ${/gewonnen!|Du hast gewonnen/.test(g.over) ? "good" : /Bot hat gewonnen|aufgegeben/.test(g.over) ? "bad" : ""}">${g.over}</div>` : myTurn ? `<div class="muted">Du bist am Zug.</div>` : `<div class="muted">Der Bot überlegt …</div>`}
    <div id="oFb" class="fb"></div>`;
  const btns = [];
  if (g.warn) btns.push({label:"Zug zurücknehmen", primary:true, fn:() => { g.sans.pop(); g.warn = null; g.arrows = []; g.msg = "Zurückgenommen. Versuch den Theoriezug."; botRender(); }},
                        {label:"Trotzdem weiterspielen", fn:() => { g.warn = null; g.arrows = []; if (g.left === null) g.left = g.sans.length - 1; botRender(); botTurn(); }});
  else if (!g.over){
    btns.push({label:"Tipp", fn:botHint});
    btns.push({label:"Zug zurück", disabled: n < 2 || !myTurn, fn:() => { g.sans.splice(-2, 2); if (g.left !== null && g.left >= g.sans.length) g.left = null; g.msg = "Zwei Halbzüge zurückgenommen."; g.arrows = []; botRender(); }});
    btns.push({label:"Aufgeben", fn:() => { g.over = "Du hast aufgegeben."; botRender(); }});
  }
  btns.push({label:"Neue Partie", primary:!!g.over, fn:() => startBot({color:g.color, level:g.lv.id})});
  btns.push({label:"Einstellungen", fn:showBotSetup});
  if (n) btns.push({label:"Partie analysieren", fn:botToAnalysis});
  opControls(btns);
  let h = "";
  const t = new Chess();
  g.sans.forEach((s, k) => { t.move(s); if (k % 2 === 0) h += `<span class="mnum">${k / 2 + 1}.</span>`; const cls = g.left === null || k < g.left ? " th" : ""; h += `<span class="omv${cls}">${esc(de(s))}</span>`; });
  $("oMoves").innerHTML = h || '<div class="empty">Noch keine Züge.</div>';
}
function botCheckEnd(){
  const g = BOT.g, c = botGameObj();
  if (c.in_checkmate()) g.over = c.turn() === g.color ? "Matt. Der Bot hat gewonnen. Schau dir die Partie im Analysebrett an." : "Matt! Du hast gewonnen.";
  else if (c.in_stalemate()) g.over = "Patt. Remis.";
  else if (c.in_threefold_repetition()) g.over = "Dreifache Stellungswiederholung. Remis.";
  else if (c.insufficient_material()) g.over = "Zu wenig Material. Remis.";
  else if (c.in_draw()) g.over = "Remis (50-Züge-Regel).";
  return !!g.over;
}
function botUserMove(uci, m){
  const g = BOT.g; if (!g || g.over || g.warn) return;
  const path = g.sans.slice(), op = OP.op;
  const cands = g.left === null ? bookCands(path) : [];
  g.sans.push(m.san); g.arrows = [];
  if (cands.length){
    const inTree = cands.find(l => mvList(l)[path.length] === m.san);
    const txt = op.comments[[...path, m.san].join(" ")] || "";
    if (inTree && /Fehler|Ungenau/.test(txt)){
      g.warn = `Achtung: ${esc(de(m.san))} ist ein bekannter Fehler. ${txt}`;
      const alt = [...new Set(cands.map(l => mvList(l)[path.length]))].find(s => !/Fehler|Ungenau/.test(op.comments[[...path, s].join(" ")] || ""));
      if (alt){ const t = new Chess(); path.forEach(s => t.move(s)); const a = t.move(alt); g.arrows = [{u:a.from + a.to, c:"rgba(129,182,76,.9)"}]; g.warn += ` Besser: <b class="mono">${esc(de(alt))}</b> (grün).`; }
      return botRender();
    }
    if (!inTree){
      if (g.color === op.side){
        const want = mvList(cands.find(l => l.set === "system") || cands[0])[path.length];
        const t = new Chess(); path.forEach(s => t.move(s)); const a = t.move(want);
        g.arrows = [{u:a.from + a.to, c:"rgba(129,182,76,.9)"}];
        g.warn = `Das ist nicht die Theorie. In deinem Repertoire steht <b class="mono">${esc(de(want))}</b> (grün). ${op.comments[[...path, want].join(" ")] || ""}`;
        return botRender();
      }
      g.left = path.length; g.msg = `Mit <b class="mono">${esc(de(m.san))}</b> verlässt du die Theorie. Ab hier spielst du nach eigenen Plänen.`;
    } else g.msg = txt ? `<b class="mono">${esc(de(m.san))}</b>: ${txt}` : "";
  } else g.msg = "";
  if (botCheckEnd()) return botRender();
  botRender();
  botTurn();
}
async function botTurn(){
  const g = BOT.g, tok = ++BOT.tok, op = OP.op;
  if (!g || g.over) return;
  botRender();
  const path = g.sans.slice(), fen = botGameObj().fen();
  let san = null, fromBook = false;
  if (g.left === null){
    const cands = bookCands(path);
    if (cands.length){ const line = pickLine(cands); san = mvList(line)[path.length]; fromBook = true; }
    else g.left = path.length;
  }
  try {
    if (!san){
      const uci = await botChoose(fen, g.lv);
      const t = new Chess(fen), m = t.move({from:uci.slice(0,2), to:uci.slice(2,4), promotion:uci[4] || "q"});
      san = m ? m.san : null;
    }
  } catch(e){ g.msg = "Stockfish konnte nicht starten."; return botRender(); }
  await new Promise(r => { OP.timer = setTimeout(r, fromBook ? 600 : 300 + Math.random() * 500); });
  if (tok !== BOT.tok || BOT.g !== g || !san || OP.mode !== "bot") return;
  g.sans.push(san);
  const txt = fromBook ? (op.comments[g.sans.join(" ")] || "") : "";
  const prev = g.msg && g.msg.startsWith("<b class=\"mono\">") && path.length ? g.msg + "<br>" : "";
  g.msg = fromBook ? `${prev}Bot: <b class="mono">${esc(de(san))}</b>${txt ? " – " + txt : ""}` : (g.left === path.length ? `${prev}Der Bot verlässt die Theorie mit <b class="mono">${esc(de(san))}</b>. Ab hier gilt dein Plan: entwickeln, rochieren, Zentrum halten, auf Drohungen achten.` : "");
  botCheckEnd();
  botRender();
}
async function botHint(){
  const g = BOT.g, fen = botGameObj().fen();
  const f = $("oFb"); f.className = "fb"; f.textContent = "Stockfish denkt …";
  try {
    const r = await search(fen, 14), steps = walk(fen, r.pv, 3);
    const m = new Chess(fen).move({from:r.best.slice(0,2), to:r.best.slice(2,4), promotion:r.best[4] || "q"});
    g.arrows = [{u:r.best.slice(0, 4), c:"rgba(72,193,249,.85)"}]; botRender();
    const f2 = $("oFb"); f2.className = "fb"; f2.innerHTML = `Tipp: <b class="mono">${esc(de(m.san))}</b> (blau). Idee: <b>${lineTxt(steps, 3)}</b>`;
  } catch(e){ f.textContent = "Stockfish konnte nicht starten."; }
}
function botToAnalysis(){
  const g = BOT.g, c = new Chess(); g.sans.forEach(s => c.move(s));
  const me = g.color === "w";
  c.header("Event", "Zugwerk-Bot", "White", me ? "Du" : "Bot " + g.lv.name, "Black", me ? "Bot " + g.lv.name : "Du");
  try { setGame(parseGame(c.pgn()), !me); S.me = g.color; location.hash = ""; setTimeout(() => runAnalysis(), 50); } catch(e){}
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
  $("oInfo").onclick = e => { const b = e.target.closest("[data-act]"); if (!b) return; if (b.dataset.act === "drill") drill(allLines(OP.op).filter(l => l.set === b.dataset.set)); if (b.dataset.act === "bot") showBotSetup(); };
  $("oLines").onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const line = allLines(OP.op).find(l => l.id === b.dataset.id);
    if (b.dataset.act === "learn") learn(line.id, 0);
    if (b.dataset.act === "drill1") drill([line]);
  };
  $("oMoves").onclick = e => {
    const b = e.target.closest(".omv[data-ply]"); if (b && OP.mode === "learn"){ OP.ply = +b.dataset.ply; showLearn(); return; }
    const g = e.target.closest(".omv[data-gply]"); if (g && OP.mode === "game") showOpeningGame(OG.sel, +g.dataset.gply);
  };
  initOpeningGames();
  document.addEventListener("keydown", e => {
    if (document.body.dataset.view !== "openings" || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (OP.mode === "game"){ const g = OG.games[OG.sel]; if (e.key === "ArrowRight" && OG.ply < g.sans.length) showOpeningGame(OG.sel, OG.ply + 1); if (e.key === "ArrowLeft" && OG.ply > 0) showOpeningGame(OG.sel, OG.ply - 1); return; }
    if (OP.mode !== "learn") return;
    if (e.key === "ArrowRight" && OP.ply < mvList(OP.line).length){ OP.ply++; showLearn(); e.preventDefault(); }
    if (e.key === "ArrowLeft" && OP.ply > 0){ OP.ply--; showLearn(); e.preventDefault(); }
  });
  renderOpList();
  learn(allLines(OP.op)[0].id, 0);
}
window.zwInitOpenings = initOpenings;
window.zwOpeningsReload = () => { OP.pr = loadOpProgress(); if (OP.board) renderOpList(); };

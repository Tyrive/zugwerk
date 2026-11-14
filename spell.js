/* Zugwerk – Züge in Erklärungen ausschreiben („Bauer nach d4“ statt „d4“).
   Arbeitet auf den Textknoten der Erklärungsbereiche; Zuglisten und Engine-Linien bleiben in Kurzschrift.
   Abschaltbar über den Knopf oben rechts. */
"use strict";
(function(){
  const PN = {K:"König", D:"Dame", T:"Turm", L:"Läufer", S:"Springer"};
  const PROMO = {D:"Dame", T:"Turm", L:"Läufer", S:"Springer"};
  const ROOTS = ["viewOpenings", "viewTraining", "comment"];
  const SKIP = ".omoves,#moves,#lines,.omv,.mv,.lname,.opp,.tagnext,.varbar,#plyinfo,.lt,.chip,.co,.badge-sq,input,textarea,select,option,script,style,.nospell,.big,.goal";
  const ORIG = new WeakMap(), CONV = new WeakMap();
  // Wörter vor einem Feldnamen, nach denen es sich um einen Zug handelt (sonst ist es ein Feld, z. B. „auf e4“, „deckt e4“)
  const MOVE_PREV = new Set(["mit","bereitet","sofort","später","plan","dann","statt","kommt","spielt","spielst","spielen","gelingt",
    "vorstoß","danach","zuerst","erst","vorher","verhindert","droht","sofortige","späteres","zug","folgt","empfiehlt","gespielt",
    "richtig","besser","stärker","idee","fortsetzung","moment","frühes","frühen","zahme","durchbruch","hebel","gegenhebel","lohnt","sondern"]);
  const NEXT_SQ = new Set(["ist","gedeckt","hängt","fällt","steht","genug","wird","bleibt","sind"]);
  let on = true;
  try { on = localStorage.getItem("zugwerk.spell") !== "0"; } catch(e){}

  const RE_PIECE = /^([KDTLS])([a-h]?[1-8]?)(x?)([a-h][1-8])(=[DTLS])?([+#]?)$/;
  const RE_PCAP = /^([a-h])x([a-h][1-8])(=[DTLS])?([+#]?)$/;
  const RE_PUSH = /^([a-h][1-8])(=[DTLS])?([+#]?)$/;
  const RE_CASTLE = /^(O-O-O|O-O|0-0-0|0-0)([+#]?)$/;
  const RE_NUM = /^\d+(\.|…)$/;
  const suffix = (promo, chk) => (promo ? ` und wird zur ${PROMO[promo[1]]}` : "") + (chk === "+" ? " mit Schach" : chk === "#" ? ", Matt" : "");
  function san2words(tok){
    let m;
    if ((m = tok.match(RE_CASTLE))) return (m[1].length > 3 ? "lange Rochade" : "kurze Rochade") + suffix(null, m[2]);
    if ((m = tok.match(RE_PIECE))) return `${PN[m[1]]} ${m[3] ? "schlägt auf" : "nach"} ${m[4]}` + suffix(m[5], m[6]);
    if ((m = tok.match(RE_PCAP))) return `Bauer schlägt auf ${m[2]}` + suffix(m[3], m[4]);
    if ((m = tok.match(RE_PUSH))) return `Bauer nach ${m[1]}` + suffix(m[2], m[3]);
    return null;
  }
  const isSan = t => RE_CASTLE.test(t) || RE_PIECE.test(t) || RE_PCAP.test(t) || RE_PUSH.test(t);

  // Routen: „Sbd2–f1–g3“ und Bauernvorstöße „d3–d4“
  function routes(s){
    s = s.replace(/(^|[^\w])([a-h][1-8])\/([a-h][1-8])(?!\w)/g, "$1Bauern nach $2 und $3");
    s = s.replace(/(^|[^\wäöüÄÖÜ])…?([KDTLS])[a-h]?([a-h][1-8])((?:–[a-h][1-8])+)/g, (all, pre, p, first, rest) => {
      const sq = [first, ...rest.split("–").filter(Boolean)], last = sq.pop();
      return `${pre}${PN[p]} über ${sq.join(" und ")} nach ${last}`;
    });
    s = s.replace(/(^|[^\wäöüÄÖÜ–])…?([a-h])([1-8])–([a-h])([1-8])(?![–\w])/g, (all, pre, f1, r1, f2, r2) =>
      f1 === f2 && Math.abs(r2 - r1) <= 2 ? `${pre}Bauer von ${f1}${r1} nach ${f2}${r2}` : all);
    return s;
  }

  function split(raw){
    const m = raw.match(/^([(„"]*)(…|\.\.\.)?(.*?)([),.:;!?“"]*)$/);
    return {lead:m[1], ell:m[2] || "", core:m[3], trail:m[4]};
  }
  const SQUARE_PREV = new Set(["ziel","feld","felder","feldern","punkt","punkte","auf","nach","von","über","gegen","deckt","decken","greift","um","bis","vor","hinter","linie","bauern","bauer","läufer","springer","turm","dame","könig"]);
  function convertText(text, seqMode){
    const s = routes(text);
    const parts = s.split(/(\s+)/);
    const W = [];
    parts.forEach((p, i) => { if (!/^\s*$/.test(p)) W.push({p, i}); });
    // 1. Pass: Wörter zerlegen und sichere Fälle einordnen
    W.forEach((w, k) => {
      const bare = w.p.replace(/^[(„"]+/, "");
      const jm = bare.match(/^(\d+)(…|\.)(\S+)$/);
      if (jm){ const t = split(jm[3]); if (isSan(t.core)){ Object.assign(w, {kind:"jmove", num:jm[1] + jm[2], pre:w.p.slice(0, w.p.length - bare.length)}, t); return; } }
      if (/^\d+(\.|…)$/.test(bare)){ w.kind = "num"; return; }
      Object.assign(w, split(w.p));
      if (isSan(w.core)) w.kind = RE_PUSH.test(w.core) && !/[+#=]/.test(w.core) ? "push?" : "move";
      else w.kind = "word";
    });
    const low = w => w ? (w.core || w.p).toLowerCase().replace(/[^a-zäöüß.]/g, "") : "";
    const isMoveLike = w => w && (w.kind === "move" || w.kind === "jmove" || (w.kind === "word" && /^(rochade|rochieren)$/i.test(w.core)));
    // 2. Pass: Bauernzüge von Feldnamen unterscheiden
    W.forEach((w, k) => {
      if (w.kind !== "push?") return;
      const pw = W[k - 1], nx = W[k + 1], pl = low(pw);
      if (nx && NEXT_SQ.has(low(nx))) return;
      const seqNext = nx && (nx.kind === "move" || nx.kind === "jmove") && !w.trail;
      if (SQUARE_PREV.has(pl) && !seqNext){ w.kind = "square"; return; }
      if (seqMode || w.ell) { w.kind = "move"; return; }
      if (pw && (pw.kind === "num")) { w.kind = "move"; return; }
      if (MOVE_PREV.has(pl)) { w.kind = "move"; return; }
      if (w.trail.startsWith(":") && !SQUARE_PREV.has(pl)) { w.kind = "move"; return; }
      if (pw && (pw.kind === "move" || pw.kind === "jmove") && !pw.trail) { w.kind = "move"; return; }
      if (pw && isMoveLike(pw) && pw.trail === ",") { w.kind = "move"; return; }
      if (nx && (nx.kind === "move" || nx.kind === "jmove") && !w.trail) { w.kind = "move"; return; }
    });
    // 3. Pass: Listen und „und/oder“-Verbindungen rückwärts und vorwärts auffüllen
    for (let rep = 0; rep < 3; rep++){
      for (let k = W.length - 1; k >= 0; k--){
        const w = W[k]; if (w.kind !== "push?") continue;
        const nx = W[k + 1], nx2 = W[k + 2];
        if (w.trail === "," && isMoveLike(nx)) w.kind = "move";
        else if (!w.trail && nx && /^(und|oder)$/i.test(nx.p) && nx2 && nx2.kind === "move") w.kind = "move";
      }
      for (let k = 0; k < W.length; k++){
        const w = W[k]; if (w.kind !== "push?") continue;
        const pw = W[k - 1], pw2 = W[k - 2];
        if (pw && /^(und|oder)$/i.test(pw.p) && pw2 && pw2.kind === "move" && !pw2.trail && !SQUARE_PREV.has(low(W[k - 3]))) w.kind = "move";
        if (pw && isMoveLike(pw) && pw.trail === ",") w.kind = "move";
      }
    }
    // 4. Ausgabe mit Kommas zwischen aufeinanderfolgenden Zügen
    let out = parts.slice(0, W.length ? W[0].i : parts.length).join(""), prevMove = false, changed = s !== text;
    W.forEach((w, k) => {
      const gap = k ? parts.slice(W[k - 1].i + 1, w.i).join("") : "";
      if (w.kind === "move" || w.kind === "jmove" || w.kind === "num"){
        if (prevMove && k) out += ", "; else out += gap;
        if (w.kind === "num"){ out += w.p; prevMove = false; return; }
        out += (w.kind === "jmove" ? w.pre + w.num + " " : "") + w.lead + san2words(w.core) + w.trail;
        prevMove = !w.trail; changed = true;
      } else { out += gap + w.p; prevMove = false; }
    });
    if (W.length) out += parts.slice(W[W.length - 1].i + 1).join("");
    return changed ? out : text;
  }

  function seqModeFor(node){
    const p = node.parentElement; if (!p) return false;
    if (!(p.tagName === "B" || p.tagName === "STRONG" || p.classList.contains("mono") || p.classList.contains("seq"))) return false;
    const toks = node.nodeValue.trim().split(/\s+/).map(t => t.replace(/^[(„…]+|[),.:;!?“]+$/g, "")).filter(Boolean);
    return toks.length > 0 && toks.every(t => RE_NUM.test(t) || isSan(t));
  }
  function convertNode(node){
    if (!on || !node.nodeValue || !/[a-h][1-8]|O-O/.test(node.nodeValue)) return;
    const p = node.parentElement; if (!p || p.closest(SKIP)) return;
    if (CONV.has(node) && CONV.get(node) === node.nodeValue) return;
    const orig = node.nodeValue, next = convertText(orig, seqModeFor(node));
    if (next !== orig){ ORIG.set(node, orig); CONV.set(node, next); node.nodeValue = next; }
  }
  function walk(root, fn){
    if (!root) return;
    if (root.nodeType === 3){ fn(root); return; }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) fn(n);
  }
  const obs = new MutationObserver(list => {
    if (!on) return;
    for (const m of list){
      if (m.type === "characterData") convertNode(m.target);
      else m.addedNodes.forEach(n => walk(n, convertNode));
    }
  });
  ROOTS.forEach(id => { const r = document.getElementById(id); if (r){ walk(r, convertNode); obs.observe(r, {subtree:true, childList:true, characterData:true}); } });

  function setOn(v){
    on = v;
    try { localStorage.setItem("zugwerk.spell", v ? "1" : "0"); } catch(e){}
    ROOTS.forEach(id => walk(document.getElementById(id), n => {
      if (!v && ORIG.has(n)){ const o = ORIG.get(n); ORIG.delete(n); CONV.delete(n); n.nodeValue = o; }
      else if (v) convertNode(n);
    }));
    btn.textContent = v ? "Züge: in Worten" : "Züge: Kurzschrift";
    btn.setAttribute("aria-pressed", v);
  }
  const btn = document.getElementById("spellBtn");
  if (btn){ btn.onclick = () => setOn(!on); btn.textContent = on ? "Züge: in Worten" : "Züge: Kurzschrift"; btn.setAttribute("aria-pressed", on); }
  window.zwSpell = {convertText};
})();

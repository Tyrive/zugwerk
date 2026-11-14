/* Zugwerk – Plan-Lektionen zur Italienischen Partie (Stellungen aus build.js erzeugt, Züge mit Stockfish geprüft) */
window.LESSONS = (window.LESSONS || []).concat([
 {
  "id": "it-plan-idee",
  "chapter": "Italienisch verstehen",
  "opening": "italienisch",
  "title": "Worum es geht: f7, d4 und …d5",
  "intro": "Bevor du Züge lernst: Was wollen beide Seiten in der Italienischen Partie? Wer das weiß, findet auch ohne Theorie gute Züge.",
  "steps": [
   {
    "type": "info",
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    "text": "<p>Dein Läufer zielt auf <b>f7</b>. Dieses Feld deckt am Anfang nur der schwarze König. Deshalb drehen sich viele Fallen und Angriffe um f7.</p><p>Aber: Gegen einen Gegner, der normal verteidigt, gewinnst du f7 nicht einfach. Der Läufer macht dort vor allem <b>Druck</b>, der Schwarz später in seinen Möglichkeiten einschränkt.</p>",
    "arrows": [
     "c4f7"
    ],
    "orient": "w"
   },
   {
    "type": "quiz",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 5",
    "text": "Beide Seiten haben ein Bauernpaar im Zentrum. Welcher Bauernzug ist der <b>Haupthebel von Weiß</b>, also der Vorstoß, auf den der ganze Aufbau hinarbeitet?",
    "opts": [
     {
      "t": "d3–d4: Ein zweiter Bauer ins Zentrum",
      "ok": true
     },
     {
      "t": "f2–f4: Angriff auf e5",
      "why": "f4 geht nicht, solange dein Springer auf f3 steht, und es schwächt deinen König."
     },
     {
      "t": "a2–a4: Raum am Damenflügel",
      "why": "a4 ist ein nützlicher Nebenplan, aber nicht der Kern. Der Kampf findet im Zentrum statt."
     },
     {
      "t": "g2–g4: Angriff am Königsflügel",
      "why": "g4 reißt deine eigene Königsstellung auf."
     }
    ],
    "done": "Richtig. Weiß spielt erst d3 (ruhig) und bereitet dann d3–d4 vor. Gelingt d4 in einem guten Moment, hast du zwei Bauern im Zentrum und mehr Platz.",
    "orient": "w"
   },
   {
    "type": "quiz",
    "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6",
    "text": "Und was ist der <b>Gegenhebel von Schwarz</b>?",
    "opts": [
     {
      "t": "…d6–d5: Angriff auf e4 und Öffnung des Zentrums",
      "ok": true
     },
     {
      "t": "…f7–f5",
      "why": "…f5 ist hier sehr riskant: Dein Läufer c4 zielt direkt auf den geschwächten König."
     },
     {
      "t": "…a7–a5",
      "why": "…a5 gewinnt etwas Raum, ändert aber nichts im Zentrum."
     },
     {
      "t": "…g7–g5",
      "why": "…g5 schwächt den eigenen König."
     }
    ],
    "done": "Genau. Schwarz will …d5 durchsetzen. Viele schwarze Züge (…Le6, …Te8, …h6) bereiten genau das vor. Merke: <b>Weiß will d4, Schwarz will …d5.</b>",
    "orient": "w"
   },
   {
    "type": "info",
    "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 6",
    "text": "<p><b>Warum nicht sofort d4?</b> Ein früher Vorstoß öffnet das Zentrum, bevor dein König sicher steht und bevor e4 genug gedeckt ist. Schwarz bekommt dann Gegenspiel gegen e4 und deinen König.</p><p>Deshalb der langsame Weg: <b>erst rochieren, Te1 (deckt e4), Sbd2, h3</b>. Dann steht nach d4 exd4 cxd4 alles bereit, und e4 fällt nicht.</p><p>Das ist die wichtigste Intuition: <b>Jeder Aufbauzug bereitet d4 vor oder verhindert eine schwarze Idee.</b></p>",
    "arrows": [
     "d3d4",
     "d6d5"
    ],
    "orient": "w"
   }
  ]
 },
 {
  "id": "it-plan-aufbau",
  "chapter": "Italienisch verstehen",
  "opening": "italienisch",
  "title": "Der Aufbau: Jeder Zug hat eine Aufgabe",
  "intro": "Hier spielst du den Standardaufbau selbst, aber diesmal mit der Frage, welche Aufgabe jeder Zug erfüllt.",
  "steps": [
   {
    "type": "quiz",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5",
    "text": "Schwarz greift mit …Sf6 deinen Bauern e4 an. Welcher Zug passt zum <b>ruhigen Plan</b>?",
    "opts": [
     {
      "t": "d3: deckt e4 und öffnet den Läufer c1",
      "ok": true
     },
     {
      "t": "d4: sofort ins Zentrum",
      "why": "Möglich, aber scharf: Nach …exd4 cxd4 Lb4+ öffnet sich alles, bevor du rochiert hast. Für den ruhigen Plan ist d3 besser."
     },
     {
      "t": "De2: Dame deckt e4",
      "why": "De2 deckt e4 auch, aber die Dame steht früh im Weg und wird von …Sd4 angegriffen. d3 ist natürlicher."
     },
     {
      "t": "Sg5: Angriff auf f7",
      "why": "Nach …O-O hast du nur Zeit verloren, und e4 hängt."
     }
    ],
    "done": "d3 deckt e4 dauerhaft. Danach kann Schwarz e4 nicht mehr einfach angreifen, und du baust in Ruhe auf.",
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7",
    "text": "Beide haben rochiert. <b>Welcher Zug stellt deinen Turm hinter den e-Bauern</b> und macht dabei f1 frei, damit der Springer später über f1 laufen kann?",
    "accept": [
     "f1e1"
    ],
    "hint": "Der Turm von f1 zieht auf die e-Linie.",
    "done": "Te1. Der Turm deckt e4 (wichtig für den späteren d4-Vorstoß) und räumt f1 für den Springer: Der Weg b1–d2–f1–g3 ist jetzt offen."
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8",
    "text": "Schwarz spielt …a6. Das droht <b>…b5 und …Sa5</b>, um deinen Läufer zu jagen und abzutauschen. <b>Reagiere vorbeugend.</b>",
    "accept": [
     "c4b3",
     "a2a4"
    ],
    "hint": "Entweder zieht der Läufer jetzt freiwillig auf ein sicheres Feld, oder du verhinderst …b5 mit einem Bauernzug.",
    "done": "Lb3 bringt den Läufer in Sicherheit und hält den Druck auf f7. a4 ist auch gut: Es verhindert …b5 ganz und gewinnt Raum. Beides folgt derselben Idee: <b>Den guten Läufer nicht billig hergeben.</b>"
   },
   {
    "type": "quiz",
    "fen": "r1bq1rk1/bpp2ppp/p1np1n2/4p3/4P3/1BPP1N2/PP3PPP/RNBQR1K1 w - - 2 9",
    "text": "In der Hauptvariante spielt Weiß jetzt <b>h3</b>. Warum?",
    "opts": [
     {
      "t": "Verhindert …Lg4, das den Springer f3 an die Dame fesseln würde",
      "ok": true
     },
     {
      "t": "Bereitet g4 und einen Königsangriff vor",
      "why": "g4 würde deinen eigenen König schwächen. h3 ist rein vorbeugend."
     },
     {
      "t": "Gibt dem König ein Fluchtfeld gegen Grundreihenmatt",
      "why": "Das ist ein netter Nebeneffekt, aber nicht der Hauptgrund. Es geht um …Lg4."
     },
     {
      "t": "Deckt den Bauern e4",
      "why": "h3 deckt e4 nicht."
     }
    ],
    "done": "Richtig. Nach …Lg4 wäre dein Springer f3 gefesselt, und Schwarz könnte mit …Sd4 oder …Lxf3 Druck machen. h3 nimmt dem Läufer das Feld g4 weg.",
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/bpp2pp1/p1np1n1p/4p3/4P3/1BPP1N1P/PP3PP1/RNBQR1K1 w - - 0 10",
    "text": "Eine Figur hat noch gar nichts getan. <b>Bring sie ins Spiel, ohne den Bauern c3 zu blockieren.</b>",
    "accept": [
     "b1d2"
    ],
    "hint": "Der Springer b1 darf nicht nach c3 (dort steht dein Bauer). Welches Feld bleibt?",
    "done": "Sbd2. Der Springer deckt e4 zusätzlich, und von d2 geht es weiter über f1 nach g3."
   },
   {
    "type": "info",
    "fen": "r1bqr1k1/bpp2pp1/p1np1n1p/4p3/4P3/1BPP1N1P/PP3PP1/R1BQRNK1 b - - 3 11",
    "text": "<p><b>Aufbau fertig.</b> Der Springer ist über d2 nach f1 gelaufen und springt als Nächstes nach <b>g3</b>. Von dort zielt er auf <b>f5</b>, ein Feld direkt vor dem schwarzen König.</p><p>Jetzt beginnt das Mittelspiel. Die drei Pläne dafür lernst du in der nächsten Lektion.</p>",
    "arrows": [
     "f1g3",
     "g3f5",
     "c1e3"
    ],
    "orient": "w"
   }
  ]
 },
 {
  "id": "it-plan-mittelspiel",
  "chapter": "Italienisch verstehen",
  "opening": "italienisch",
  "title": "Die drei Pläne nach dem Aufbau",
  "intro": "Der Aufbau steht. Und jetzt? Es gibt drei typische Pläne. Welcher passt, hängt davon ab, was Schwarz macht.",
  "steps": [
   {
    "type": "info",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/1BPP1N1P/PP3PP1/R1BQRNK1 w - - 4 12",
    "text": "<ol><li><b>Plan A, Le3:</b> Den gefährlichen Läufer a7 abtauschen. Er zielt auf f2 und deinen König. Danach springt dein Springer über e3 oder g3 nach f5.</li><li><b>Plan B, d4:</b> Der Zentrumsdurchbruch. Erst wenn e4 sicher gedeckt ist und Schwarz ungenau spielt.</li><li><b>Plan C, a4 und b4:</b> Raum am Damenflügel, um die schwarzen Figuren dort zu verdrängen.</li></ol><p>Intuition: <b>Die Figur, die dich am meisten stört, tauschst du ab. Die Figur, die am schlechtesten steht, verbesserst du.</b></p>",
    "arrows": [
     "c1e3",
     "d3d4",
     "a2a4"
    ],
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/1BPP1N1P/PP3PP1/R1BQRNK1 w - - 4 12",
    "text": "<b>Plan A:</b> Der Läufer a7 zielt durch das ganze Brett auf f2. <b>Biete den Tausch an</b> und bring dabei deine letzte Figur ins Spiel.",
    "accept": [
     "c1e3"
    ],
    "hint": "Der Läufer c1 hat noch nicht gezogen. Welches Feld stellt sich dem Läufer a7 in den Weg?",
    "done": "Le3! Nimmt Schwarz, schlägst du mit dem Springer zurück: Sxe3 steht dann super und springt später nach f5 oder d5. Der Läufer a7, die aktivste schwarze Figur, ist weg."
   },
   {
    "type": "move",
    "fen": "r2qr1k1/bpp2pp1/2npbn1p/p3p3/4P3/2PP1N1P/PPB2PP1/R1BQRNK1 w - - 0 13",
    "text": "<b>Plan B:</b> Hier hat Weiß Lc2 gespielt, und Schwarz hat mit …a5 einen Zug verschwendet. <b>Jetzt ist der Moment für den Durchbruch im Zentrum.</b>",
    "accept": [
     "d3d4"
    ],
    "hint": "Welcher Bauernzug war das Ziel des ganzen Aufbaus?",
    "done": "d4! Jetzt funktioniert es: e4 ist durch Te1 und Lc2 gedeckt, dein König steht sicher. Nach …exd4 cxd4 hast du zwei Bauern im Zentrum und viel Platz."
   },
   {
    "type": "quiz",
    "fen": "r2qr1k1/bpp2pp1/2npbn1p/p3p3/3PP3/2P2N1P/PPB2PP1/R1BQRNK1 b - - 0 13",
    "text": "Woran erkennst du, dass <b>d4 jetzt gut</b> ist?",
    "opts": [
     {
      "t": "e4 ist gedeckt, mein König steht sicher, und Schwarz hat gerade keinen sinnvollen Zug gemacht",
      "ok": true
     },
     {
      "t": "Sobald der Gegner rochiert hat",
      "why": "Rochade allein reicht nicht. Wenn e4 nach d4 exd4 cxd4 hängt, verlierst du einen Bauern."
     },
     {
      "t": "d4 ist immer gut",
      "why": "Zu früh öffnet d4 das Spiel zu deinem Nachteil. Deshalb der lange Aufbau."
     },
     {
      "t": "Wenn meine Dame auf b3 steht",
      "why": "Die Damenstellung ist nicht entscheidend. Wichtig sind die Deckung von e4 und dein König."
     }
    ],
    "done": "Genau. Prüfe vor d4 immer: Hängt nach d4 exd4 cxd4 der Bauer e4? Steht mein König sicher? Wenn beides passt: los.",
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8",
    "text": "<b>Plan C:</b> Gewinne Raum am Damenflügel, damit der Läufer c5 später gejagt werden kann. <b>Welcher Randbauern-Zug bereitet b4 vor?</b>",
    "accept": [
     "a2a4"
    ],
    "hint": "Der a-Bauer verhindert …b5 und stützt einen späteren Vorstoß b4.",
    "done": "a4 verhindert …b5 und bereitet b4 vor. Dann muss der Läufer c5 nach a7 oder b6, und du hast am Damenflügel mehr Platz. Stockfish hält das hier sogar für den besten Zug."
   }
  ]
 },
 {
  "id": "it-plan-schwarz",
  "chapter": "Italienisch verstehen",
  "opening": "italienisch",
  "title": "Was will Schwarz?",
  "intro": "Die Hälfte der Intuition ist, die Ideen des Gegners zu erkennen. Hier lernst du die vier typischen schwarzen Pläne und deine Antwort.",
  "steps": [
   {
    "type": "quiz",
    "fen": "r2qk2r/ppp2ppp/2np1n2/2b1p3/2B1P1b1/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 2 7",
    "text": "Schwarz spielt <b>…Lg4</b>. Was will er?",
    "opts": [
     {
      "t": "Den Springer f3 an die Dame fesseln und dann mit …Sd4 Druck machen",
      "ok": true
     },
     {
      "t": "Den Läufer c4 angreifen",
      "why": "Der Läufer g4 greift c4 nicht an. Er zielt auf f3 und dahinter auf deine Dame d1."
     },
     {
      "t": "Matt auf h2 vorbereiten",
      "why": "Dafür fehlen Schwarz die Figuren. Es geht um die Fesselung."
     },
     {
      "t": "Den Bauern e4 schlagen",
      "why": "Der Läufer g4 kann e4 nicht erreichen."
     }
    ],
    "done": "Richtig. Gefesselte Figuren sind schwach. Darum spielt Weiß oft vorher h3. Hier, wo der Läufer schon steht, fragst du ihn mit h3 oder spielst b4 und Sbd2.",
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r2qk2r/ppp2ppp/2np1n2/2b1p3/2B1P1b1/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 2 7",
    "text": "<b>Wie reagierst du auf die Fesselung?</b>",
    "accept": [
     "h2h3",
     "b2b4"
    ],
    "hint": "Frag den Läufer, ob er tauschen oder zurück will. Oder greif den Läufer c5 mit einem Bauern an.",
    "done": "Beides ist stark. h3 zwingt den Läufer zur Entscheidung: Nach …Lxf3 Dxf3 hast du das Läuferpaar, nach …Lh5 kann die Fesselung später mit g4 gelöst werden. b4 gewinnt Raum mit Tempo gegen den Läufer c5."
   },
   {
    "type": "quiz",
    "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 2 7",
    "text": "Schwarz spielt <b>…Sa5</b>. Was will er?",
    "opts": [
     {
      "t": "Den Läufer c4 abtauschen, der auf f7 zielt",
      "ok": true
     },
     {
      "t": "Den Turm a1 angreifen",
      "why": "Von a5 erreicht der Springer a1 nicht. Er zielt auf c4."
     },
     {
      "t": "Den Bauern b2 schlagen",
      "why": "Möglich wäre das später, aber das Ziel ist dein starker Läufer."
     },
     {
      "t": "Den Damenflügel verteidigen",
      "why": "…Sa5 ist ein Angriffszug gegen deinen Läufer."
     }
    ],
    "done": "Genau. Der Läufer auf c4 ist deine beste Figur. Normalerweise ziehst du ihn rechtzeitig nach b3 oder c2. Hier hat Schwarz aber die Rochade vergessen …",
    "orient": "w"
   },
   {
    "type": "move",
    "fen": "r1bqk2r/ppp2ppp/3p1n2/n1b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w kq - 2 7",
    "text": "Schwarz hat noch nicht rochiert, und der Springer steht am Rand. <b>Bestrafe das mit Schach.</b>",
    "accept": [
     "c4b5",
     "d1a4"
    ],
    "hint": "Ein Schach auf der Diagonale a4–e8.",
    "done": "Lb5+! Nach …c6 La4 b5 b4! gerät der Läufer c5 in Not: Schwarz verliert Material. Stockfish bewertet das mit fast zwei Bauern Vorteil. Merke: <b>Springer am Rand und König in der Mitte sind ein Signal zum Angriff.</b>"
   },
   {
    "type": "quiz",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/1BPP1N1P/PP3PP1/R1BQRNK1 w - - 4 12",
    "text": "Schwarz spielt <b>…Le6</b>. Was ist die Idee?",
    "opts": [
     {
      "t": "Deinen starken Läufer b3 abtauschen und …d5 vorbereiten",
      "ok": true
     },
     {
      "t": "f2 angreifen",
      "why": "Der Läufer e6 zielt auf b3, nicht auf f2. Den Druck auf f2 macht der Läufer a7."
     },
     {
      "t": "Den Springer f1 einsperren",
      "why": "Der Läufer e6 hat mit f1 nichts zu tun."
     },
     {
      "t": "Den König schützen",
      "why": "Ein Nebeneffekt, aber die Hauptidee ist der Tausch gegen deinen Läufer und das Feld d5."
     }
    ],
    "done": "Richtig. Nach …Lxb3 ist dein Läufer weg, und …d5 wird leichter. Deine Antworten: Lc2 (Läufer behalten) oder Le3 (selbst tauschen, siehe Plan A).",
    "orient": "w"
   },
   {
    "type": "quiz",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/1BPP1NNP/PP3PP1/R1BQR1K1 b - - 5 12",
    "text": "Schwarz ist am Zug. <b>Mit welchem Zug kämpft er jetzt um das Zentrum?</b>",
    "opts": [
     {
      "t": "…d5: der Gegenhebel gegen e4",
      "ok": true
     },
     {
      "t": "…g5: Angriff auf den Springer g3",
      "why": "…g5 schwächt den eigenen König schwer, dein Springer springt nach f5."
     },
     {
      "t": "…Sh7",
      "why": "Ein passiver Rückzug, der nichts für das Zentrum tut."
     },
     {
      "t": "…b5",
      "why": "Raum am Damenflügel, aber das Zentrum bleibt unberührt."
     }
    ],
    "done": "Genau: …d5. Danach entscheidet sich die Stellung im Zentrum. Stockfish bewertet sie als ausgeglichen. Dein Plan: mit exd5 Lxd5 und Lc2 den Läufer behalten und Druck auf e5 machen.",
    "orient": "w"
   }
  ]
 },
 {
  "id": "it-plan-taktik",
  "chapter": "Italienisch verstehen",
  "opening": "italienisch",
  "title": "Typische Taktiken in der Italienischen",
  "intro": "Diese Muster kommen auf deinem Niveau immer wieder vor. Wer sie kennt, gewinnt schnell Material.",
  "steps": [
   {
    "type": "move",
    "fen": "r1bqk2r/pppp1ppp/1bn2n2/8/2BPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7",
    "text": "Du hast hier früh d4 gespielt, und Schwarz hat den Läufer passiv nach b6 zurückgezogen. Deine zwei Zentrumsbauern stehen nebeneinander. <b>Lass sie vorstürmen.</b>",
    "accept": [
     "d4d5",
     "e4e5"
    ],
    "hint": "Ein Bauernzug, der einen schwarzen Springer angreift.",
    "done": "Die <b>Bauernwalze</b>: e5 jagt den Springer f6, d5 den Springer c6. Beide Züge sind stark, die schwarzen Figuren werden zurückgedrängt. Merke: <b>Zwei Zentrumsbauern nebeneinander gegen passive Figuren heißt vorrücken.</b>"
   },
   {
    "type": "move",
    "fen": "r2qkb1r/ppp2ppp/2npbn2/4p1N1/2B1P3/2N5/PPPP1PPP/R1BQK2R w KQkq - 4 6",
    "text": "Springer g5 und Läufer c4 greifen f7 an. Schwarz deckt mit dem Läufer e6. <b>Beseitige den Verteidiger.</b>",
    "accept": [
     "g5e6"
    ],
    "hint": "Tausch die Figur ab, die f7 und den Läufer c4 blockiert.",
    "done": "Sxe6 fxe6 Lxe6: Der Verteidiger ist weg, der Bauer e6 fällt, und der schwarze König kann nicht mehr rochieren. Muster: <b>Was einen wichtigen Punkt verteidigt, wird abgetauscht.</b>"
   },
   {
    "type": "quiz",
    "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4",
    "text": "Wann lohnt sich ein Angriff auf f7 mit Springer und Läufer, wie hier mit Sg5?",
    "opts": [
     {
      "t": "Wenn f7 nur vom König gedeckt ist und Schwarz noch nicht rochiert hat",
      "ok": true
     },
     {
      "t": "Immer, f7 ist der schwächste Punkt",
      "why": "Nach der Rochade deckt der Turm f8 den Punkt f7. Dann verpufft der Angriff."
     },
     {
      "t": "Nur wenn die Dame mitspielt",
      "why": "Hier reichen Springer und Läufer, weil f7 nur einmal gedeckt ist."
     },
     {
      "t": "Wenn der Gegner …h6 gespielt hat",
      "why": "Nach …h6 wird der Springer auf g5 sofort angegriffen."
     }
    ],
    "done": "Richtig. Angreifer zählen: Springer plus Läufer gegen nur den König. Schwarz muss sofort reagieren (…d5). Nach der Rochade ist f7 durch den Turm gedeckt, und solche Angriffe funktionieren nur noch mit mehr Figuren.",
    "orient": "w"
   },
   {
    "type": "info",
    "fen": "r2q1bnr/ppp1kBpp/2np4/3NN3/4P3/7P/PPPP1PP1/R1BbK2R b KQ - 2 8",
    "text": "<p><b>Das Seekadettenmatt</b> kennst du aus den Fallen. Das Muster dahinter: Eine Fesselung gegen die Dame ist nur eine <b>scheinbare</b> Fesselung. Du darfst den gefesselten Springer trotzdem ziehen, wenn dafür etwas Größeres herauskommt.</p><p>Frage dich bei jeder Fesselung: <b>Was passiert, wenn ich die gefesselte Figur trotzdem ziehe?</b></p>",
    "orient": "w"
   }
  ]
 }
]);

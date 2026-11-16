/* Zugwerk – Plan-Lektionen zu den Schwarz-Repertoires (Stellungen aus build.js erzeugt, Züge mit Stockfish geprüft) */
window.LESSONS = (window.LESSONS || []).concat([
 {
  "id": "e5-plan-idee",
  "chapter": "Gegen 1. e4 verstehen",
  "opening": "e5",
  "title": "Worum es geht: e5 halten, f7 schützen",
  "intro": "Bevor du Varianten lernst: Was willst du mit 1…e5 erreichen, und wo liegt deine Schwäche? Mit diesen Ideen findest du auch gegen unbekannte Züge eine gute Antwort.",
  "steps": [
   {
    "type": "info",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    "text": "<p>Dein Bauer <b>e5</b> ist der Anker deiner Stellung. Er hält dagegen, nimmt Weiß die Felder <b>d4</b> und <b>f4</b> und öffnet deine Dame und den Läufer f8.</p><p>Fast alles, was Weiß in den nächsten Zügen macht, richtet sich gegen diesen Bauern: Sf3 greift ihn an, d4 will ihn abtauschen.</p>",
    "arrows": [
     "e5d4",
     "e5f4"
    ],
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
    "text": "Weiß greift mit dem Springer deinen Bauern e5 an. <b>Welche Antwort ist am besten?</b>",
    "opts": [
     {
      "t": "Springer nach c6: deckt e5 und entwickelt eine Figur",
      "ok": true
     },
     {
      "t": "Bauer nach d6: deckt e5",
      "why": "Deckt auch, sperrt aber deinen Läufer f8 hinter den Bauern. Der Springer deckt und entwickelt gleichzeitig."
     },
     {
      "t": "Bauer nach f6: deckt e5",
      "why": "Schwächt deinen König. Weiß kann trotzdem auf e5 schlagen, weil danach Dh5 mit Schach kommt."
     },
     {
      "t": "Dame nach e7: deckt e5",
      "why": "Die Dame blockiert deinen Läufer f8 und steht früh im Weg."
     }
    ],
    "done": "Richtig. Eine gute Verteidigung entwickelt gleichzeitig eine Figur.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    "text": "Der weiße Läufer zielt auf f7. <b>Welche deiner Figuren deckt f7 gerade?</b>",
    "arrows": [
     "c4f7"
    ],
    "opts": [
     {
      "t": "Nur der König",
      "ok": true
     },
     {
      "t": "Die Dame d8",
      "why": "Die Dame steht auf d8 und sieht f7 nicht. Ihre Diagonale geht über e7 nach h4."
     },
     {
      "t": "Der Springer g8",
      "why": "Der Springer g8 deckt e7, f6 und h6, aber nicht f7."
     }
    ],
    "done": "Genau. Deshalb ist f7 dein Schwachpunkt bis zur Rochade. Danach deckt der Turm f8 mit.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    "text": "<b>Entwickle eine Figur</b> so, dass du bald rochieren kannst.",
    "accept": [
     "f8c5",
     "g8f6",
     "f8e7"
    ],
    "hint": "Einer deiner beiden Königsflügel-Figuren muss raus: der Läufer f8 oder der Springer g8.",
    "done": "Gut. …Lc5 und …Sf6 sind die aktivsten Züge, …Le7 ist der solide Weg. Alle drei machen die Rochade möglich.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7",
    "text": "<p>Merke dir die Grundregel der offenen Spiele:</p><ul><li><b>Weiß will d4</b>, einen zweiten Bauern ins Zentrum.</li><li><b>Du willst …d5</b>, den Gegenstoß, der das weiße Zentrum angreift.</li></ul><p>Fast jeder Zug im Mittelspiel bereitet einen dieser beiden Vorstöße vor oder verhindert ihn.</p>",
    "arrows": [
     "d3d4",
     "d6d5"
    ],
    "orient": "b"
   }
  ]
 },
 {
  "id": "e5-plan-aufbau",
  "chapter": "Gegen 1. e4 verstehen",
  "opening": "e5",
  "title": "Dein Aufbau gegen Italienisch",
  "intro": "Gegen die Italienische Partie baust du dich fast immer gleich auf. Hier spielst du den Aufbau selbst und lernst, welche Aufgabe jeder Zug hat.",
  "steps": [
   {
    "type": "move",
    "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4",
    "text": "Weiß bereitet mit c3 den Vorstoß d4 vor. <b>Entwickle eine Figur und greife dabei etwas an.</b>",
    "accept": [
     "g8f6"
    ],
    "hint": "Welcher Springerzug greift den Bauern e4 an?",
    "done": "…Sf6 greift e4 an. Weiß muss reagieren: d3 deckt, d4 öffnet sofort das Zentrum.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R b KQkq - 0 5",
    "text": "Weiß hat e4 ruhig gedeckt. <b>Welcher Bauernzug deckt e5 fest und öffnet deinen Läufer c8?</b>",
    "accept": [
     "d7d6"
    ],
    "hint": "Der Bauer vor deiner Dame.",
    "done": "…d6. Jetzt ist e5 doppelt gedeckt, und der Läufer c8 kann über e6 oder g4 ins Spiel.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 b - - 3 7",
    "text": "In dieser Stellung spielst du <b>…a6</b>. <b>Warum?</b>",
    "opts": [
     {
      "t": "Damit der Läufer c5 nach a7 zurück kann, bevor b4 oder d4 ihn angreift",
      "ok": true
     },
     {
      "t": "Um mit …b5 den weißen König anzugreifen",
      "why": "Der weiße König steht auf g1, weit weg vom Damenflügel."
     },
     {
      "t": "Um deinem König Luft zu verschaffen",
      "why": "Luft für den König schafft ein Bauer vor dem König, zum Beispiel …h6."
     }
    ],
    "done": "Richtig. Auf a7 ist der Läufer vor Bauernangriffen sicher und zielt weiter auf f2.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/4P3/1BPP1N2/PP3PPP/RNBQR1K1 b - - 1 8",
    "text": "Weiß wird bald d4 spielen und deinen Läufer angreifen. <b>Bring ihn vorbeugend in Sicherheit.</b>",
    "accept": [
     "c5a7"
    ],
    "hint": "Das Feld hast du gerade mit …a6 vorbereitet.",
    "done": "…La7. Der Läufer steht sicher und zielt weiter durch das ganze Brett auf f2.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r1bq1rk1/bpp2ppp/p1np1n2/4p3/4P3/1BPP1N1P/PP3PP1/RNBQR1K1 b - - 0 9",
    "text": "Als Nächstes kommt <b>…h6</b>. <b>Was verhindert dieser Zug?</b>",
    "opts": [
     {
      "t": "Lg5, das deinen Springer an die Dame fesseln würde, und Sg5",
      "ok": true
     },
     {
      "t": "Er bereitet …g5 und einen Angriff vor",
      "why": "…g5 würde deinen eigenen König öffnen. …h6 ist vorbeugend gemeint."
     },
     {
      "t": "Er deckt den Bauern g7",
      "why": "g7 ist nicht angegriffen. Es geht um das Feld g5."
     }
    ],
    "done": "Genau. Nach …h6 kann weder der Läufer noch der Springer nach g5.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/1BPP1N1P/PP3PP1/R1BQRNK1 w - - 4 12",
    "text": "<p><b>Aufbau fertig.</b> Der Turm e8 stützt e5, der Läufer e6 bietet den Tausch des starken weißen Läufers b3 an.</p><p>Als Nächstes folgt der Gegenstoß <b>…d5</b>. Damit greifst du e4 an und öffnest das Zentrum, sobald deine Figuren bereitstehen.</p>",
    "arrows": [
     "e6b3",
     "d6d5"
    ],
    "orient": "b"
   }
  ]
 },
 {
  "id": "e5-plan-d5",
  "chapter": "Gegen 1. e4 verstehen",
  "opening": "e5",
  "title": "Der Gegenstoß …d5 und frühes d4",
  "intro": "Wann ist der Moment für …d5, und was tust du, wenn Weiß früh mit d4 das Zentrum öffnet?",
  "steps": [
   {
    "type": "move",
    "fen": "r2qr1k1/bpp2pp1/p1npbn1p/4p3/4P3/2PP1N1P/PPB2PP1/R1BQRNK1 b - - 5 12",
    "text": "Weiß weicht dem Läufertausch mit Lc2 aus. Turm e8 stützt e5, Läufer e6 stützt d5. <b>Spiel den Gegenstoß.</b>",
    "accept": [
     "d6d5"
    ],
    "hint": "Der Bauer d6 geht einen Schritt vor.",
    "done": "…d5! Du greifst e4 an und öffnest das Zentrum. Deine Figuren stehen bereit, deshalb funktioniert das jetzt.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r2qr1k1/bpp2pp1/p1n1bn1p/3pp3/4P3/2PP1N1P/PPB2PP1/R1BQRNK1 w - - 0 13",
    "text": "<b>Was bringt dir …d5?</b>",
    "opts": [
     {
      "t": "Es greift e4 an und öffnet Linien für deine gut entwickelten Figuren",
      "ok": true
     },
     {
      "t": "Es gewinnt sofort einen Bauern",
      "why": "Nach exd5 schlägst du zurück. Das Material bleibt gleich."
     },
     {
      "t": "Es bereitet ein Matt auf g2 vor",
      "why": "Dafür fehlen dir noch viele Figuren. Es geht um das Zentrum."
     }
    ],
    "done": "Richtig. Wer besser entwickelt ist, öffnet das Zentrum.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r2qr1k1/bpp2pp1/p1npBn1p/4p3/4P3/2PP1N1P/PP3PP1/R1BQRNK1 b - - 0 12",
    "text": "Weiß tauscht auf e6. <b>Wie schlägst du zurück?</b>",
    "accept": [
     "e8e6",
     "f7e6"
    ],
    "hint": "Du kannst mit dem Turm oder mit dem Bauern f7 zurückschlagen.",
    "done": "Beides ist gut. Mit dem Turm bleibt deine Bauernstruktur heil. Mit dem Bauern bekommst du die halboffene f-Linie und eine Stütze für …d5.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5",
    "text": "Hier spielt Weiß sofort d4 und greift e5 und deinen Läufer an. <b>Was spielst du?</b>",
    "accept": [
     "e5d4"
    ],
    "hint": "Halte das Zentrum offen.",
    "done": "…exd4. Nach cxd4 hat Weiß zwei Bauern im Zentrum, aber dein Läufer hat einen starken Ausweichzug.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6",
    "text": "Dein Läufer ist angegriffen. <b>Weiche so aus, dass Weiß sofort reagieren muss.</b>",
    "accept": [
     "c5b4"
    ],
    "hint": "Ein Läuferzug mit Schach.",
    "done": "…Lb4+! Mit Schach verlierst du keine Zeit. Danach tauschst du auf d2 und spielst …d5 gegen das Zentrum.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r1bqk2r/ppp2ppp/2n2n2/3p4/2BPP3/5N2/PP1N1PPP/R2QK2R w KQkq d6 0 9",
    "text": "<p><b>Merke für große weiße Zentren:</b></p><ol><li>Schlagen, nicht passiv decken.</li><li>Mit Tempo ausweichen, zum Beispiel mit Schach.</li><li>Figuren tauschen, damit das Zentrum weniger Kraft hat.</li><li>Dann mit …d5 das Zentrum angreifen.</li></ol>",
    "arrows": [
     "d5e4",
     "f6e4"
    ],
    "orient": "b"
   }
  ]
 },
 {
  "id": "e5-plan-taktik",
  "chapter": "Gegen 1. e4 verstehen",
  "opening": "e5",
  "title": "Fallen und Taktik gegen 1. e4",
  "intro": "Auf deinem Niveau versucht Weiß oft schnelle Angriffe auf f7. Hier lernst du, sie abzuwehren und Fehler von Weiß zu bestrafen.",
  "steps": [
   {
    "type": "move",
    "fen": "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2",
    "text": "Die Dame greift deinen Bauern e5 an. <b>Decke ihn und entwickle dabei eine Figur.</b>",
    "accept": [
     "b8c6"
    ],
    "hint": "Derselbe Springer wie gegen 2. Sf3.",
    "done": "…Sc6. Nicht sofort …g6: Dann schlägt die Dame auf e5 mit Schach und gewinnt danach den Turm h8.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    "text": "Jetzt droht Weiß Matt auf f7. <b>Welcher Zug ist richtig?</b>",
    "arrows": [
     "h5f7",
     "c4f7"
    ],
    "opts": [
     {
      "t": "Bauer nach g6: wehrt das Matt ab und vertreibt die Dame",
      "ok": true
     },
     {
      "t": "Springer nach f6: entwickelt und greift die Dame an",
      "why": "Dann schlägt die Dame auf f7, und es ist Matt. Die Drohung geht vor."
     },
     {
      "t": "Springer nach d4: greift die Dame und c2 an",
      "why": "Auch hier schlägt die Dame auf f7, und es ist Matt."
     }
    ],
    "done": "Richtig. Jetzt ist e5 gedeckt, deshalb klappt …g6. Auch …De7 wäre möglich.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqk1nr/pppp1ppp/2n5/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4",
    "text": "Weiß greift mit dem Springer f7 an, hat aber etwas übersehen. <b>Bestrafe den Fehler.</b>",
    "accept": [
     "d8g5"
    ],
    "hint": "Deine Dame schaut über e7 und f6 auf g5.",
    "done": "…Dxg5. Der Springer war ungedeckt. Prüfe bei jedem Gegnerzug: Steht die gezogene Figur sicher?",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbqk1nr/pppp1ppp/8/2b1P3/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 3",
    "text": "Im Königsgambit hat Weiß gierig auf e5 geschlagen. Die Diagonale zum weißen König ist offen. <b>Nutze das aus.</b>",
    "accept": [
     "d8h4"
    ],
    "hint": "Ein Damenschach auf der Diagonale e1–h4.",
    "done": "…Dh4+! Nach g3 schlägt die Dame auf e4 mit Schach und gewinnt danach den Turm h1.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/1Q6/PPPP1PPP/RNB1K1NR b KQkq - 3 5",
    "text": "Weiß zielt noch einmal auf f7 und lässt dabei c2 ungedeckt. <b>Finde den starken Springerzug.</b>",
    "accept": [
     "c6d4"
    ],
    "hint": "Ein Springerzug, der die Dame angreift und eine Gabel auf c2 droht.",
    "done": "…Sd4! Greift die Dame an und droht …Sxc2+ mit Gabel auf König und Turm. Schlägt Weiß auf f7, fängst du den Läufer.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 1 6",
    "text": "<p><b>Merke:</b></p><ul><li>Bis zur Rochade ist <b>f7</b> deine Schwachstelle. Zielen zwei weiße Figuren darauf, hat die Abwehr Vorrang.</li><li>Frühe Damenausflüge bestrafst du mit <b>Entwicklung mit Tempo</b>: Figuren raus, die die Dame angreifen.</li><li>Nach der Rochade deckt der Turm f8 den Punkt f7, und die meisten Fallen funktionieren nicht mehr.</li></ul>",
    "orient": "b"
   }
  ]
 },
 {
  "id": "d5-plan-idee",
  "chapter": "Gegen 1. d4 verstehen",
  "opening": "d5",
  "title": "Die Mauer: d5 und e6",
  "intro": "Gegen 1. d4 baust du eine feste Mauer im Zentrum. Hier lernst du, warum sie hält und wo ihr Haken liegt.",
  "steps": [
   {
    "type": "info",
    "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
    "text": "<p>Das <b>Damengambit</b>: Weiß greift deinen Bauern d5 mit dem c-Bauern an.</p><p>Es ist kein echtes Opfer. Nimmst du auf c4, holt sich Weiß den Bauern fast immer zurück und hat dann ein großes Zentrum. Deshalb hältst du d5 lieber fest.</p>",
    "arrows": [
     "c4d5"
    ],
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2",
    "text": "<b>Welcher Zug stützt d5 am solidesten?</b>",
    "opts": [
     {
      "t": "Bauer nach e6: Ein Bauer deckt d5",
      "ok": true
     },
     {
      "t": "Bauer schlägt auf c4",
      "why": "Möglich, aber den Bauern behältst du nicht, und Weiß bekommt das Zentrum."
     },
     {
      "t": "Springer nach c6",
      "why": "Der Springer verstellt deinen c-Bauern. Nach cxd5 Dxd5 Sc3 verlierst du mit der Dame Zeit."
     }
    ],
    "done": "Richtig. Schlägt Weiß jetzt auf d5, schlägst du mit dem e-Bauern zurück und behältst einen Bauern im Zentrum.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
    "text": "<b>Was ist der Nachteil von …e6?</b>",
    "arrows": [
     "c8e6"
    ],
    "opts": [
     {
      "t": "Der Läufer c8 steht hinter dem Bauern e6 und kommt schwer ins Spiel",
      "ok": true
     },
     {
      "t": "Dein König wird unsicher",
      "why": "Im Gegenteil: …e6 öffnet den Läufer f8, du kannst schnell rochieren."
     },
     {
      "t": "Der Bauer d5 wird schwächer",
      "why": "Der Bauer e6 deckt d5. Die Mauer wird stärker."
     }
    ],
    "done": "Genau. Den Läufer c8 zu befreien ist später deine wichtigste Aufgabe.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
    "text": "Weiß stellt einen zweiten Angreifer auf d5. <b>Stelle einen zweiten Verteidiger dazu und entwickle dabei eine Figur.</b>",
    "accept": [
     "g8f6"
    ],
    "hint": "Ein Springer, der d5 deckt.",
    "done": "…Sf6. Zwei Angreifer, zwei Verteidiger. Der Springer deckt außerdem h7.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4",
    "text": "Der Läufer fesselt deinen Springer an die Dame. <b>Welcher Läuferzug hebt die Fesselung auf?</b>",
    "accept": [
     "f8e7"
    ],
    "hint": "Stell eine Figur zwischen Springer und Dame.",
    "done": "…Le7. Jetzt ist der Springer nicht mehr gefesselt, und du kannst rochieren. Auch …Sbd7 ist gut, das lernst du in der Elefantenfalle.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7",
    "text": "<p><b>Dein Grundaufbau</b> gegen fast alles mit 1. d4:</p><p class=\"seq\">…d5, …e6, …Sf6, …Le7, Rochade, …Sbd7</p><p>Danach kommt …c6 oder …c5, und dann befreist du den Läufer c8. Das zeigt dir die nächste Lektion.</p>",
    "orient": "b"
   }
  ]
 },
 {
  "id": "d5-plan-befreien",
  "chapter": "Gegen 1. d4 verstehen",
  "opening": "d5",
  "title": "Den Läufer c8 befreien",
  "intro": "Deine Mauer steht, aber der Läufer c8 schläft. Hier lernst du die zwei typischen Wege, ihn ins Spiel zu bringen.",
  "steps": [
   {
    "type": "info",
    "fen": "r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7",
    "text": "<p>Zwei Wege für den Läufer c8:</p><ol><li><b>…dxc4 und dann …e5:</b> Der Bauer e6 verschwindet, der Läufer hat die Diagonale nach g4 und f5.</li><li><b>…b6 und …Lb7:</b> Der Läufer geht auf die lange Diagonale und drückt auf e4.</li></ol>",
    "arrows": [
     "e6e5",
     "c8b7"
    ],
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/pp1nbppp/2p1pn2/3p2B1/2PP4/2NBPN2/PP3PPP/2RQK2R b K - 1 8",
    "text": "Weiß hat den Läufer gerade nach d3 gezogen. <b>Schlag jetzt auf c4</b>, damit er gleich noch einmal ziehen muss.",
    "accept": [
     "d5c4"
    ],
    "hint": "Dein Bauer d5 schlägt.",
    "done": "…dxc4. Der Läufer zieht zweimal, du gewinnst Zeit.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1bq1rk1/pp1nbppp/2p1pn2/6B1/2BP4/2N1PN2/PP3PPP/2RQK2R b K - 0 9",
    "text": "Deine Stellung ist noch etwas eng. <b>Biete einen Figurentausch an.</b>",
    "accept": [
     "f6d5"
    ],
    "hint": "Der Springer f6 springt ins Zentrum und greift den Läufer g5 an.",
    "done": "…Sd5. Nach dem Tausch der Läufer und Springer hast du mehr Platz für deine Figuren.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "r1b2rk1/pp1nqppp/2p1p3/8/2BP4/2R1PN2/PP3PPP/3Q1RK1 b - - 0 12",
    "text": "Zwei Figurenpaare sind getauscht. <b>Jetzt der Befreiungszug.</b>",
    "accept": [
     "e6e5"
    ],
    "hint": "Der Bauer e6 geht zwei Felder vor.",
    "done": "…e5! Der Läufer c8 ist frei, und du kämpfst um das Zentrum. Die Stellung ist ausgeglichen.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbq1rk1/ppp1bppp/4pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R b KQ - 2 6",
    "text": "Weiß spielt ruhig und hat seinen Läufer c1 selbst hinter e3 eingesperrt. <b>Bring deinen Läufer c8 über die lange Diagonale ins Spiel.</b>",
    "accept": [
     "b7b6",
     "d5c4"
    ],
    "hint": "Ein Bauernzug macht das Feld b7 für den Läufer frei.",
    "done": "…b6 und danach …Lb7. Auch …dxc4 mit späterem …c5 ist gut. Hauptsache, der Läufer bleibt nicht eingesperrt.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "rn1q1rk1/pbp1bppp/1p2pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 2 8",
    "text": "<p><b>Merke:</b> Bei jedem Zug im Damengambit fragst du dich: <b>Was macht mein Läufer c8?</b></p><p>Steht er nach zwanzig Zügen noch auf c8, hast du praktisch eine Figur weniger.</p>",
    "orient": "b"
   }
  ]
 },
 {
  "id": "d5-plan-london",
  "chapter": "Gegen 1. d4 verstehen",
  "opening": "d5",
  "title": "Gegen das Londoner System",
  "intro": "Viele Gegner online spielen das Londoner System. Weiß baut immer gleich auf. Deshalb kannst du dich gut darauf vorbereiten.",
  "steps": [
   {
    "type": "info",
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 1 6",
    "text": "<p>Im <b>Londoner System</b> stellt Weiß den Läufer nach f4, bevor e3 kommt. Danach folgen fast immer c3, Sd2, Sf3 und Ld3.</p><p>Der Aufbau ist solide, aber langsam. Gegen das Londoner System spielst du deshalb <b>aktiver</b>: …c5 greift d4 an, …Ld6 tauscht den starken Läufer f4.</p>",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2",
    "text": "<b>Greife das Zentrum sofort an</b>, bevor Weiß mit c3 alles festmacht.",
    "accept": [
     "c7c5",
     "g8f6"
    ],
    "hint": "Ein Bauernzug neben deinem Bauern d5.",
    "done": "…c5 greift d4 an. Auch …Sf6 ist gut, danach kommt …c5 im nächsten Zug.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 1 6",
    "text": "Jetzt spielst du <b>…Ld6</b>. <b>Warum?</b>",
    "opts": [
     {
      "t": "Der Läufer bietet den Tausch des starken Läufers f4 an",
      "ok": true
     },
     {
      "t": "Er bereitet einen Angriff auf den weißen König vor",
      "why": "Der weiße König steht noch in der Mitte. Es geht um den Läufer f4."
     },
     {
      "t": "Er deckt den Bauern e5",
      "why": "Auf e5 steht kein Bauer. Der Läufer stellt sich dem Läufer f4 entgegen."
     }
    ],
    "done": "Richtig. Der Läufer f4 ist die beste weiße Figur. Nach dem Tausch fehlt Weiß die Kontrolle über e5.",
    "orient": "b"
   },
   {
    "type": "move",
    "fen": "rnbqkbnr/pp2pppp/8/2Pp4/5B2/8/PPP1PPPP/RN1QKBNR b KQkq - 0 3",
    "text": "Weiß nimmt den Bauern. <b>Wie holst du ihn zurück?</b>",
    "accept": [
     "e7e6",
     "b8c6",
     "d8a5"
    ],
    "hint": "Mach den Weg für deinen Läufer f8 frei, er schlägt dann auf c5.",
    "done": "Gut. Der Bauer c5 kommt sicher zurück. Versucht Weiß ihn mit b4 zu halten, sprengst du mit …a5.",
    "orient": "b"
   },
   {
    "type": "quiz",
    "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR b KQkq - 3 3",
    "text": "Hier hat Weiß früh Sc3 und Lf4 gespielt. Er droht <b>Sb5</b> mit Angriff auf c7. <b>Was spielst du?</b>",
    "arrows": [
     "c3b5",
     "b5c7"
    ],
    "opts": [
     {
      "t": "Bauer nach a6: nimmt dem Springer das Feld b5",
      "ok": true
     },
     {
      "t": "Bauer nach e6: öffnet den Läufer f8",
      "why": "Dann kommt Sb5, und auf c7 droht eine Gabel auf König und Turm."
     },
     {
      "t": "Läufer nach f5: spiegelt den weißen Aufbau",
      "why": "Auch danach kommt Sb5 mit Druck auf c7."
     }
    ],
    "done": "Richtig. Mit …a6 ist die Hauptidee von Weiß erledigt. Danach spielst du …e6 und …c5.",
    "orient": "b"
   },
   {
    "type": "info",
    "fen": "r1bq1rk1/p4ppp/1pnbpn2/2pp4/3P4/2PBPNB1/PP1N1PPP/R2QK2R w KQ - 0 9",
    "text": "<p><b>Dein Plan gegen das Londoner System:</b></p><ol><li>…c5 gegen d4</li><li>…Sc6, …Sf6, …e6</li><li>…Ld6 gegen den Läufer f4</li><li>Rochade, dann …b6 und …Lb7</li></ol><p>Damit stehst du aktiv und hast keine Schwächen.</p>",
    "orient": "b"
   }
  ]
 }
]);

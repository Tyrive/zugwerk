/* Zugwerk – Lektionen für Einsteiger (ca. 300–1000 Elo)
   Schrittarten:
   - info:   Text + Stellung zum Anschauen
   - move:   Aufgabe; "lines" = Lösungsfolgen (eigene Züge und Antworten des Gegners im Wechsel),
             "accept" = Liste guter Züge, oder "engine: tol" = jeder Zug, der höchstens tol % Gewinnchance schlechter ist als der beste
   - play:   Gegen Stockfish ausspielen; goal "mate" oder "promote", max = maximale eigene Züge
*/
window.LESSONS = [
{
  id:"blundercheck", chapter:"Grundlagen", title:"Der Blunder-Check",
  intro:"Bei 400 Elo entscheidet fast immer, wer zuerst eine Figur einstellt. Diese Gewohnheit bringt dir die meisten Punkte.",
  steps:[
    {type:"info", fen:"r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
     text:"<p>Stell dir <b>vor jedem Zug</b> drei Fragen:</p><ol><li><b>Was will der Gegner?</b> Was greift sein letzter Zug an, was droht er?</li><li><b>Hängt etwas?</b> Steht eine meiner Figuren angegriffen und ungedeckt?</li><li><b>Schach, Schlagen, Drohungen:</b> Gibt es für mich oder den Gegner ein Schach, einen Schlagzug oder einen Angriff auf eine Figur?</li></ol><p>Erst danach ziehst du. Das kostet 10 Sekunden und spart dir jede zweite Partie.</p>"},
    {type:"move", fen:"rnb1kbnr/pppp1ppp/8/4p1q1/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
     text:"Schwarz hat gerade die Dame nach g5 gezogen. Frage 2 an den Gegner gestellt: Hängt bei ihm etwas? <b>Nutze es aus.</b>",
     lines:[["f3g5"]], hint:"Welche deiner Figuren greift g5 an?",
     done:"Genau. Die Dame war ungedeckt. Bevor du selbst ziehst, schau immer, ob der Gegner gerade etwas eingestellt hat."},
    {type:"move", fen:"rnbqkb1r/p1pp1ppp/5n2/1p2p3/2B1P3/2N5/PPPP1PPP/R1BQK1NR w KQkq b6 0 4",
     text:"Schwarz hat mit ...b5 deinen Läufer angegriffen. Frage 1: Was will der Gegner? <b>Reagiere richtig.</b>",
     engine:6, hint:"Der Läufer auf c4 wird vom Bauern b5 angegriffen. Weg damit oder schlag zurück, wenn es sicher ist.",
     done:"Gut. Wenn eine Figur angegriffen wird: wegziehen, decken oder den Angreifer schlagen."},
    {type:"move", fen:"r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3", orient:"b",
     text:"Du spielst Schwarz. Weiß droht etwas sehr Gefährliches mit Dame und Läufer. <b>Verhindere es.</b>",
     accept:["g7g6","d8e7","d8f6"], hint:"Dame h5 und Läufer c4 zielen beide auf f7. Danach wäre Dxf7 Matt.",
     done:"Richtig. Weiß drohte Dxf7#. Mit ...g6 greifst du sogar die Dame an. Achtung: ...Sf6?? wäre hier Matt."}
  ]
},
{
  id:"werte", chapter:"Grundlagen", title:"Figurenwerte und Abtausch",
  intro:"Wer weiß, was seine Figuren wert sind, tauscht nicht mehr schlecht.",
  steps:[
    {type:"info", fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
     text:"<p>Faustregel für den Wert der Figuren:</p><ul><li>Bauer = <b>1</b></li><li>Springer = <b>3</b>, Läufer = <b>3</b></li><li>Turm = <b>5</b></li><li>Dame = <b>9</b></li><li>König = unbezahlbar</li></ul><p>Tausche nur, wenn du gleich viel oder mehr bekommst. Ein Turm gegen einen Springer ist ein Verlust von 2 Punkten.</p>"},
    {type:"info", fen:"6k1/pp3ppp/4p3/3n4/8/1BN5/PP3PPP/6K1 w - - 0 1",
     arrows:["c3d5","b3d5","e6d5"],
     text:"<p><b>Angreifer und Verteidiger zählen:</b> Der Springer auf d5 wird von zwei weißen Figuren angegriffen (Springer c3, Läufer b3), aber nur vom Bauern e6 verteidigt.</p><p>Zwei Angreifer gegen einen Verteidiger: Hier gewinnt Weiß Material.</p>"},
    {type:"move", fen:"6k1/pp3ppp/4p3/3n4/8/1BN5/PP3PPP/6K1 w - - 0 1",
     text:"<b>Gewinne Material</b>, indem du auf d5 abtauschst und dann noch einmal schlägst.",
     lines:[["c3d5","e6d5","b3d5"],["b3d5","e6d5","c3d5"]], hint:"Schlag zuerst auf d5. Nach ...exd5 schlägst du mit der zweiten Figur wieder.",
     done:"Sauber: Springer gegen Springer getauscht und einen Bauern mitgenommen."}
  ]
},
{
  id:"eroeffnung", chapter:"Eröffnung", title:"Die drei Eröffnungsregeln",
  intro:"Du brauchst keine Eröffnungstheorie. Diese drei Regeln reichen bis 1200 Elo.",
  steps:[
    {type:"info", fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
     arrows:["e2e4","d2d4"],
     text:"<ol><li><b>Kämpfe um das Zentrum</b>: Die Felder e4, d4, e5 und d5 sind die wichtigsten. Starte mit e4 oder d4.</li><li><b>Entwickle deine Figuren</b>: Springer und Läufer raus, möglichst jede Figur nur einmal ziehen.</li><li><b>Bring den König in Sicherheit</b>: Rochiere früh, meist bis zum 7. bis 10. Zug.</li></ol>"},
    {type:"move", fen:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
     text:"<b>Spiele einen guten ersten Zug</b> nach Regel 1.",
     accept:["e2e4","d2d4","c2c4","g1f3"], hint:"Ein Bauer ins Zentrum oder ein Springer Richtung Zentrum.",
     done:"Gut. Zentrum zuerst."},
    {type:"move", fen:"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
     text:"Nach 1. e4 e5: <b>Entwickle eine Figur</b>, am besten mit Angriff.",
     accept:["g1f3","b1c3","f1c4","d2d4"], hint:"Der Springer von g1 hat ein Feld, auf dem er sofort den Bauern e5 angreift.",
     done:"Genau so. Sf3 entwickelt und greift gleichzeitig e5 an."},
    {type:"move", fen:"r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
     text:"Springer und Läufer auf dem Königsflügel sind entwickelt. <b>Bring deinen König in Sicherheit.</b>",
     accept:["e1g1"], hint:"Der König zieht zwei Felder Richtung Turm (kurze Rochade).",
     done:"Rochade! Der König steht sicher, und der Turm kommt ins Spiel."},
    {type:"info", fen:"rnb1kbnr/pppp1ppp/8/4p3/4P2q/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3",
     text:"<p>Typische Eröffnungsfehler bei Einsteigern:</p><ul><li><b>Dame zu früh raus</b> (wie hier ...Dh4): Sie wird gejagt, und du verlierst Zeit.</li><li><b>Randbauern ziehen</b> (a4, h4) statt Figuren zu entwickeln.</li><li><b>Dieselbe Figur mehrmals ziehen</b>, während der Rest schläft.</li><li><b>Rochade vergessen</b>: Der König in der Mitte ist ein Ziel.</li></ul>"}
  ]
},
{
  id:"schaefer", chapter:"Eröffnung", title:"Schäfermatt erkennen und abwehren",
  intro:"Das häufigste schnelle Matt auf niedrigem Niveau. Einmal verstanden, fällst du nie wieder darauf rein.",
  steps:[
    {type:"move", fen:"r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
     text:"Schwarz hat gerade ...Sf6 gespielt und die Drohung übersehen. <b>Setze matt.</b>",
     lines:[["h5f7"]], hint:"Dame und Läufer zielen auf denselben schwachen Bauern.",
     done:"Matt! f7 wird nur vom König gedeckt, deshalb ist es am Anfang der schwächste Punkt von Schwarz."},
    {type:"move", fen:"r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3", orient:"b",
     text:"Jetzt bist du Schwarz und siehst die Drohung rechtzeitig. <b>Wehre sie ab.</b>",
     accept:["g7g6","d8e7","d8f6"], hint:"Entweder f7 decken oder die Dame vertreiben.",
     done:"Richtig. ...g6 vertreibt die Dame mit Tempo, ...De7 deckt f7."},
    {type:"move", fen:"r1bqkbnr/pppp1p1p/2n3p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 1 4", orient:"b",
     text:"Nach ...g6 kommt die Dame nach f3 und droht wieder Dxf7#. <b>Verteidige f7 und entwickle dich dabei.</b>",
     accept:["g8f6","d8f6","d8e7"], hint:"Ein Springer kann sich zwischen Dame und f7 stellen.",
     done:"Perfekt. ...Sf6 blockiert die f-Linie und entwickelt eine Figur."}
  ]
},
{
  id:"gabel", chapter:"Taktik", title:"Die Gabel",
  intro:"Eine Figur greift zwei Ziele gleichzeitig an. Der Gegner kann nur eines retten.",
  steps:[
    {type:"move", fen:"4k3/5ppp/r7/3N4/8/8/5PPP/6K1 w - - 0 1",
     text:"<b>Springergabel:</b> Finde den Zug, der König und Turm gleichzeitig angreift.",
     lines:[["d5c7","e8d7","c7a6"],["d5c7","e8e7","c7a6"],["d5c7","e8d8","c7a6"],["d5c7","e8f8","c7a6"]],
     hint:"Springer mögen Felder, die zwei wertvolle Figuren gleichzeitig erreichen. Schau auf c7.",
     done:"Springergabel mit Schach! Der König muss weg, der Turm fällt."},
    {type:"move", fen:"rn2k1nr/ppp2ppp/4p3/8/7b/8/PP3PPP/RNBQK1NR w KQkq - 0 1",
     text:"<b>Damengabel:</b> Der schwarze Läufer auf h4 ist ungedeckt. Greife ihn mit Schach an.",
     accept:["d1a4"], hint:"Die Dame kann von a4 aus gleichzeitig e8 und h4 angreifen.",
     done:"Da4+ greift König und Läufer an. Nach der Abwehr des Schachs schlägst du auf h4."},
    {type:"move", fen:"6k1/ppp2ppp/3n1n2/8/3PP3/8/PPP2PPP/5RK1 w - - 0 1",
     text:"<b>Bauerngabel:</b> Auch der kleinste Soldat kann zwei Figuren angreifen.",
     lines:[["e4e5"]], hint:"Welcher Bauernzug greift d6 und f6 zugleich an?",
     done:"e5 greift beide Springer an. Einer geht verloren."}
  ]
},
{
  id:"fesselung", chapter:"Taktik", title:"Die Fesselung",
  intro:"Eine Figur darf nicht ziehen, weil sonst eine wertvollere Figur dahinter angegriffen wäre.",
  steps:[
    {type:"info", fen:"r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
     arrows:["b5c6","c6e8"],
     text:"<p>Der Läufer b5 <b>fesselt</b> den Springer c6 an den König e8. Weil der König dahinter steht, darf der Springer gar nicht ziehen (absolute Fesselung).</p><p>Gefesselte Figuren sind schwach: Greif sie mit Bauern an, die kann man nicht ignorieren.</p>"},
    {type:"move", fen:"4k2r/1pp2ppp/2n5/1B6/3P4/8/PPP2PPP/R5K1 w k - 0 1",
     text:"Der Springer c6 ist gefesselt. <b>Gewinne ihn.</b>",
     lines:[["d4d5"]], hint:"Greife die gefesselte Figur mit einem Bauern an.",
     done:"d5! Der Springer kann nicht weg, ohne dass der König im Schach stünde."}
  ]
},
{
  id:"spiess", chapter:"Taktik", title:"Spieß und Abzugsangriff",
  intro:"Zwei Motive, mit denen Einsteiger oft die Dame verlieren oder gewinnen.",
  steps:[
    {type:"move", fen:"4q3/pp4pp/8/4k3/8/8/5PPP/R5K1 w - - 0 1",
     text:"<b>Spieß:</b> Gib Schach so, dass nach dem Ausweichen des Königs die Dame dahinter fällt.",
     lines:[["a1e1","e5d4","e1e8"],["a1e1","e5d5","e1e8"],["a1e1","e5d6","e1e8"],["a1e1","e5f4","e1e8"],["a1e1","e5f5","e1e8"],["a1e1","e5f6","e1e8"]],
     hint:"König und Dame stehen auf derselben Linie.",
     done:"Spieß! Wie bei der Fesselung, nur steht die wertvollere Figur vorne."},
    {type:"move", fen:"3q2k1/ppp2ppp/8/8/8/3B4/PPP2PPP/3R2K1 w - - 0 1",
     text:"<b>Abzugsangriff:</b> Der Läufer d3 versperrt dem Turm die Linie zur Dame. Zieh ihn mit Schach weg.",
     lines:[["d3h7","g8h7","d1d8"],["d3h7","g8f8","d1d8"],["d3h7","g8h8","d1d8"]],
     hint:"Wenn der Läufer Schach gibt, hat Schwarz keine Zeit, die Dame zu retten.",
     done:"Lxh7+ und danach Txd8. Der Turm war die ganze Zeit auf die Dame gerichtet."}
  ]
},
{
  id:"grundreihe", chapter:"Mattbilder", title:"Das Grundreihenmatt",
  intro:"Der König steht hinter seinen eigenen Bauern eingesperrt. Ein Turm auf der letzten Reihe reicht.",
  steps:[
    {type:"move", fen:"6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
     text:"<b>Setze matt.</b>",
     lines:[["e1e8"]], hint:"Die eigenen Bauern f7, g7, h7 nehmen dem König alle Fluchtfelder.",
     done:"Grundreihenmatt. Die drei Bauern vor dem König werden zum Gefängnis."},
    {type:"move", fen:"4r1k1/R4ppp/8/8/8/8/5PPP/6K1 w - - 0 1",
     text:"Jetzt die andere Seite: Schwarz droht <b>...Te1#</b>. Du bist am Zug. <b>Verhindere das Matt.</b>",
     engine:15, hint:"Gib deinem König ein Fluchtfeld (Luft), zum Beispiel mit einem Bauernzug.",
     done:"Richtig. Ein „Luftloch“ wie h3 oder g3 kostet einen Zug und beseitigt die Gefahr für den Rest der Partie."}
  ]
},
{
  id:"zweituerme", chapter:"Mattbilder", title:"Treppenmatt mit zwei Türmen",
  intro:"Das einfachste Matt gegen einen einzelnen König. Hier übst du es gegen Stockfish.",
  steps:[
    {type:"info", fen:"8/8/8/4k3/8/8/8/R6R w - - 0 1",
     arrows:["a1a4","h1h5"],
     text:"<p>Die Türme arbeiten wie eine Treppe: Ein Turm sperrt eine Reihe ab, der andere gibt auf der nächsten Reihe Schach. Dann rückt der hintere Turm über den vorderen vor.</p><p>Wichtig: Kommt der König einem Turm zu nahe, zieh den Turm weit weg auf die andere Seite.</p>"},
    {type:"play", fen:"8/8/8/4k3/8/8/8/R5KR w - - 0 1", goal:"mate", max:15,
     text:"<b>Setze den König matt</b> in höchstens 15 Zügen. Stockfish verteidigt sich so gut es geht.",
     done:"Matt! Diese Technik brauchst du auch mit Dame und Turm."}
  ]
},
{
  id:"damenmatt", chapter:"Mattbilder", title:"Matt mit Dame und König",
  intro:"Kommt in jeder zweiten Partie vor, die du gewinnst. Wer es nicht kann, spielt oft Patt.",
  steps:[
    {type:"info", fen:"8/8/8/4k3/8/8/8/4K2Q w - - 0 1",
     text:"<ol><li><b>Box verkleinern:</b> Stell die Dame einen Springerzug vom König entfernt. Sie folgt ihm und drängt ihn zum Rand.</li><li><b>Vorsicht Patt:</b> Steht der König am Rand und hat keinen Zug mehr, aber kein Schach, ist es Remis.</li><li><b>König holen:</b> Sobald der König am Rand ist, bring deinen eigenen König heran.</li><li><b>Matt:</b> Dame gibt Schach direkt vor dem gegnerischen König, gedeckt von deinem König.</li></ol>"},
    {type:"play", fen:"8/8/8/4k3/8/8/8/4K2Q w - - 0 1", goal:"mate", max:20,
     text:"<b>Setze matt</b> in höchstens 20 Zügen. Achte auf Patt!",
     done:"Geschafft. Diese Technik solltest du blind beherrschen."}
  ]
},
{
  id:"turmmatt", chapter:"Mattbilder", title:"Matt mit Turm und König",
  intro:"Schwieriger als mit der Dame, weil der Turm nur gerade zieht. Der König muss mithelfen.",
  steps:[
    {type:"info", fen:"8/8/8/3k4/8/8/8/R3K3 w - - 0 1",
     text:"<ol><li>Der Turm sperrt den König in ein Rechteck.</li><li>Dein König läuft heran, bis er dem gegnerischen König gegenübersteht (Opposition).</li><li>Steht der König gegenüber, gibt der Turm von der Seite Schach und verkleinert das Rechteck.</li><li>Wird der Turm angegriffen, zieh ihn auf die andere Seite des Bretts.</li></ol>"},
    {type:"play", fen:"8/8/8/3k4/8/8/8/R3K3 w - - 0 1", goal:"mate", max:30,
     text:"<b>Setze matt</b> in höchstens 30 Zügen.",
     done:"Stark. Turmmatt ist eine echte Technik, die viele bis 1000 Elo nicht sicher können."}
  ]
},
{
  id:"mittelspiel", chapter:"Mittelspiel", title:"Pläne im Mittelspiel",
  intro:"Was tun, wenn keine Taktik da ist? Diese Faustregeln geben dir immer einen Plan.",
  steps:[
    {type:"info", fen:"r4rk1/ppp1bppp/2n5/4p3/4P3/5N2/PPP1BPPP/R4RK1 w - - 0 12",
     text:"<ol><li><b>Schlechteste Figur verbessern:</b> Welche Figur macht gerade nichts? Bring sie ins Spiel.</li><li><b>Türme auf offene Linien:</b> Eine Linie ohne Bauern ist eine Autobahn für Türme.</li><li><b>Bei Materialvorteil tauschen:</b> Je weniger Figuren auf dem Brett, desto leichter gewinnt der, der mehr hat.</li><li><b>Springer in die Mitte:</b> „Ein Springer am Rand bringt Kummer und Schand.“</li></ol>"},
    {type:"move", fen:"r4rk1/ppp1bppp/2n5/4p3/4P3/5N2/PPP1BPPP/R4RK1 w - - 0 12",
     text:"Die d-Linie ist offen. <b>Besetze sie mit einem Turm.</b>",
     accept:["f1d1","a1d1"], hint:"Welcher Turm erreicht d1?",
     done:"Genau. Ein Turm auf der offenen Linie kann später bis d7 eindringen."},
    {type:"move", fen:"3rk3/ppp2ppp/8/8/8/2N5/PPP2PPP/3R2K1 w - - 0 25",
     text:"Du hast einen Springer mehr. Schwarz bietet den Turmtausch an. <b>Was machst du?</b>",
     accept:["d1d8"], hint:"Wer mehr Material hat, will tauschen.",
     done:"Richtig. Nach dem Tausch bleibt ein klar gewonnenes Springerendspiel."}
  ]
},
{
  id:"bauernendspiel", chapter:"Endspiel", title:"Quadratregel und Opposition",
  intro:"Im Endspiel wird der König zur Angriffsfigur. Zwei Regeln entscheiden fast jedes Bauernendspiel.",
  steps:[
    {type:"info", fen:"k7/8/8/8/p6P/4K3/8/8 w - - 0 1",
     arrows:["a4a1"],
     text:"<p><b>Quadratregel:</b> Zeichne vom Bauern aus ein Quadrat bis zur Umwandlungsreihe (hier a4 bis d1). Kann dein König mit seinem Zug in dieses Quadrat ziehen, holt er den Bauern ein.</p>"},
    {type:"move", fen:"k7/8/8/8/p6P/4K3/8/8 w - - 0 1",
     text:"<b>Halte den schwarzen Bauern auf.</b>",
     engine:10, hint:"Zieh den König in das Quadrat a1–d1–d4–a4.",
     done:"Dein König ist im Quadrat und holt den Bauern ein. Dein eigener h-Bauer gewinnt dann die Partie."},
    {type:"info", fen:"4k3/8/4K3/4P3/8/8/8/8 w - - 0 1",
     text:"<p><b>Opposition:</b> Zwei Könige stehen sich mit einem Feld Abstand gegenüber. Wer <b>nicht</b> ziehen muss, hat die Opposition und gewinnt das Duell, denn der andere muss zur Seite ausweichen.</p><p>Faustregel: Steht dein König <b>vor</b> deinem Bauern auf der 6. Reihe, gewinnst du immer (außer mit dem Randbauern).</p>"},
    {type:"play", fen:"4k3/8/4K3/4P3/8/8/8/8 w - - 0 1", goal:"promote", max:15,
     text:"<b>Wandle den Bauern in eine Dame um</b>, ohne dass sie verloren geht oder es Patt wird.",
     done:"Umgewandelt. Mit der Dame setzt du jetzt matt wie in der Lektion davor."}
  ]
}
];

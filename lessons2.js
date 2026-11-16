/* Zugwerk – weitere Lektionen (Drohungen, Verteidiger beseitigen, Mattbilder, Vorteil verwerten, Endspiel).
   Format wie in lessons.js; zusätzlich "quiz": Frage mit Antworten (ok = richtig, why = Erklärung zur falschen Antwort). */
window.LESSONS = (window.LESSONS || []).concat([
{
  id:"drohungen", chapter:"Grundlagen", title:"Drohungen erkennen",
  intro:"Die meisten Figuren gehen nicht durch geniale Züge des Gegners verloren, sondern weil man seine Drohung nicht gesehen hat.",
  steps:[
    {type:"info", fen:"r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3", orient:"b",
     arrows:["h5f7","c4f7"],
     text:"<p>Jeder Zug des Gegners hat einen Grund. Stell dir nach <b>jedem</b> Gegnerzug drei Fragen:</p><ol><li><b>Was greift die gezogene Figur jetzt an?</b></li><li><b>Was droht im nächsten Zug?</b> Stell dir vor, der Gegner dürfte gleich noch einmal ziehen.</li><li><b>Was deckt die Figur nicht mehr?</b> Wer wegzieht, lässt oft etwas ungeschützt zurück.</li></ol><p>Hier zielen Dame und Läufer gemeinsam auf f7. Dürfte Weiß noch einmal ziehen, wäre es Matt.</p>"},
    {type:"quiz", fen:"r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4", orient:"b",
     arrows:["g5f7","c4f7"],
     text:"Weiß hat gerade den Springer nach g5 gezogen. <b>Was droht Weiß?</b>",
     opts:[
       {t:"Der Springer schlägt auf f7 und greift Dame und Turm gleichzeitig an.", ok:true},
       {t:"Der Springer schlägt auf h7 und gewinnt einen Bauern.", why:"Auf h7 würde der Turm h8 einfach zurückschlagen. Das ist keine Drohung."},
       {t:"Nichts. Der Springer steht auf g5 nur am Rand herum.", why:"Springer und Läufer zielen beide auf f7, und f7 deckt nur der König."}
     ],
     done:"Genau. Zwei Angreifer auf f7, nur ein Verteidiger. Auf f7 wäre der Springer eine Gabel auf Dame und Turm."},
    {type:"move", fen:"r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4", orient:"b",
     text:"Du hast die Drohung erkannt. <b>Wehre sie ab</b>, indem du dem Läufer c4 den Weg nach f7 versperrst.",
     accept:["d7d5"], hint:"Ein Bauer kann sich zwischen Läufer und f7 stellen und greift dabei den Läufer an.",
     done:"Richtig. Der Bauer d5 unterbricht die Diagonale des Läufers. Nach exd5 spielst du am sichersten …Sa5."},
    {type:"move", fen:"3r2k1/pp3ppp/8/3p4/4n3/2N5/PP3PPP/3R2K1 w - - 0 1",
     text:"Frage 3: <b>Was deckt die Figur nicht mehr?</b> Schwarz hat gerade den Springer von f6 nach e4 gezogen und greift deinen Springer an. <b>Bestrafe den Zug.</b>",
     engine:8, hint:"Der Bauer d5 müsste auf e4 zurückschlagen. Aber was passiert dann auf der d-Linie?",
     done:"Stark. Der Springer auf e4 hängt: Schlägt der Bauer d5 zurück, ist die d-Linie offen und der Turm setzt auf d8 matt."},
    {type:"quiz", fen:"rnbqk1nr/pppp1ppp/8/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3", orient:"b",
     arrows:["f3f7","c4f7"],
     text:"Du spielst Schwarz. Weiß hat die Dame nach f3 gezogen. <b>Welcher Zug wehrt die Drohung ab und entwickelt dabei eine Figur?</b>",
     opts:[
       {t:"Springer nach f6: Er stellt sich zwischen Dame und f7.", ok:true},
       {t:"Springer nach c6: Entwickelt eine Figur.", why:"Dann schlägt die Dame auf f7 und es ist Matt. Die Drohung geht immer vor."},
       {t:"Bauer nach d6: Öffnet den Läufer c8.", why:"Auch danach schlägt die Dame auf f7 mit Schach. Dein König muss ins Freie und verliert das Recht zu rochieren."}
     ],
     done:"Richtig. Der Springer blockiert die f-Linie. Erst die Drohung abwehren, dann der eigene Plan."},
    {type:"info", fen:"rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
     text:"<p><b>Merke:</b></p><ul><li>Nach jedem Gegnerzug zuerst: <b>Was will er?</b></li><li>Eine Drohung kannst du abwehren, indem du <b>wegziehst</b>, <b>deckst</b>, <b>etwas dazwischenstellst</b> oder den <b>Angreifer schlägst</b>.</li><li>Am besten ist eine Abwehr, die gleichzeitig eine Figur entwickelt oder selbst etwas droht.</li></ul>"}
  ]
},
{
  id:"kandidaten", chapter:"Grundlagen", title:"So findest du deinen Zug",
  intro:"Ein fester Ablauf im Kopf verhindert, dass du einfach den ersten Zug spielst, der dir einfällt.",
  steps:[
    {type:"info", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 5",
     text:"<p>Geh in jeder Stellung dieselben vier Schritte durch:</p><ol><li><b>Gegner:</b> Was droht er nach seinem letzten Zug?</li><li><b>Zwingende Züge:</b> Gibt es für mich ein <b>Schach</b>, einen <b>Schlagzug</b> oder eine <b>Drohung</b>? Diese Züge zuerst durchrechnen, denn der Gegner muss darauf reagieren.</li><li><b>Sonst verbessern:</b> Welche meiner Figuren steht am schlechtesten? Die kommt als Nächstes ins Spiel.</li><li><b>Blunder-Check:</b> Bevor du loslässt: Ist das Zielfeld sicher, hängt danach etwas?</li></ol>"},
    {type:"quiz", fen:"r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 5",
     text:"<b>Warum prüfst du Schach, Schlagen und Drohungen zuerst?</b>",
     opts:[
       {t:"Weil der Gegner auf solche Züge reagieren muss. Seine Antworten sind leicht vorherzusehen.", ok:true},
       {t:"Weil ein Schach immer ein guter Zug ist.", why:"Ein Schach ohne Folge hilft oft nur dem Gegner. Du prüfst es zuerst, spielst es aber nur, wenn es etwas bringt."},
       {t:"Weil man möglichst viele Figuren tauschen soll.", why:"Tauschen lohnt sich nur, wenn du gleich viel oder mehr bekommst oder schon Material mehr hast."}
     ],
     done:"Genau. Zwingende Züge lassen dem Gegner wenig Auswahl. So kannst du zwei, drei Züge im Voraus rechnen."},
    {type:"move", fen:"3r2k1/pp3ppp/8/3n4/8/1B6/PP3PPP/3R2K1 w - - 0 1",
     text:"Schritt 2 in der Praxis: <b>Gibt es einen Schlagzug, der etwas gewinnt?</b> Zähle Angreifer und Verteidiger auf d5 und rechne die Schlagfolge zu Ende.",
     lines:[["b3d5","d8d5","d1d5"],["d1d5","d8d5","b3d5"]], hint:"Zwei deiner Figuren greifen den Springer d5 an, aber nur der Turm d8 deckt ihn.",
     done:"Gut gerechnet. Zwei Angreifer gegen einen Verteidiger: Am Ende bleibt dir eine Figur mehr."},
    {type:"quiz", fen:"r4rk1/ppp2ppp/2n1bn2/3p4/3P4/2N1PN2/PP2BPPP/R4RK1 w - - 0 12",
     text:"Keine Drohung, kein Schach, nichts zu schlagen. <b>Was jetzt?</b>",
     opts:[
       {t:"Die Figur verbessern, die am wenigsten tut, zum Beispiel einen Turm auf die offene c-Linie stellen.", ok:true},
       {t:"Einen Randbauern zwei Felder vorziehen, damit etwas passiert.", why:"Bauernzüge ohne Plan schaffen Schwächen und lassen sich nicht zurücknehmen."},
       {t:"Mit dem König in die Mitte laufen.", why:"Solange Damen oder viele Figuren auf dem Brett sind, bleibt der König hinter seinen Bauern."}
     ],
     done:"Richtig. Ohne Taktik gilt: schlechteste Figur verbessern, Türme auf offene Linien."}
  ]
},
{
  id:"verteidiger", chapter:"Taktik", title:"Den Verteidiger beseitigen",
  intro:"Eine Figur ist nur so sicher wie ihr Verteidiger. Schlag ihn weg oder lenk ihn ab, dann fällt, was er gedeckt hat.",
  steps:[
    {type:"move", fen:"r4rk1/ppq1bppp/2n2n2/6B1/8/3Q1N2/PPB2PPP/R4RK1 w - - 0 1",
     arrows:["d3h7"],
     text:"Dame und Läufer zielen auf h7. Nur der Springer f6 deckt das Feld. <b>Beseitige den Verteidiger und setze matt.</b>",
     lines:[["g5f6","e7f6","d3h7"]], hint:"Schlag zuerst den Springer f6. Danach deckt niemand mehr h7.",
     done:"Matt! Der Läufer hat zwar zurückgeschlagen, aber h7 war nicht mehr gedeckt."},
    {type:"move", fen:"r1bqk2r/pppp1ppp/2n5/1B2p3/Qb2P3/5N2/PP1P1PPP/RNB2RK1 w kq - 0 1",
     arrows:["c6b4"],
     text:"Der Läufer b4 wird nur vom Springer c6 gedeckt. <b>Gewinne den Läufer.</b>",
     lines:[["b5c6","d7c6","a4b4"],["b5c6","b7c6","a4b4"]], hint:"Schlag zuerst den Springer, der den Läufer deckt.",
     done:"Sauber. Erst den Verteidiger schlagen, dann die Figur abholen, die er gedeckt hat."},
    {type:"move", fen:"3r2k1/5ppp/8/3b4/8/1B6/5PPP/4R1K1 w - - 0 1",
     text:"<b>Überlastung:</b> Der Turm d8 hat zwei Aufgaben. Er deckt den Läufer d5 und bewacht die Grundreihe. Beides zugleich schafft er nicht. <b>Nutze das aus.</b>",
     lines:[["b3d5","d8d5","e1e8"]], hint:"Schlag den Läufer. Wenn der Turm zurückschlägt, verlässt er die Grundreihe.",
     done:"Genau. Eine Figur mit zwei Aufgaben ist überlastet. Schlägt der Turm zurück, ist es Matt auf der Grundreihe."}
  ]
},
{
  id:"damehelfer", chapter:"Mattbilder", title:"Matt mit Dame und Helfer",
  intro:"Die Dame setzt fast nie allein matt. Sie braucht eine zweite Figur, die das Feld deckt, auf dem sie Schach gibt.",
  steps:[
    {type:"info", fen:"r1bq1rk1/ppp2ppp/2n5/3p3Q/3P4/3B4/PPP2PPP/R4RK1 w - - 0 1",
     arrows:["h5h7","d3h7"],
     text:"<p>Die typischen Ziele vor dem rochierten König sind <b>h7, g7 und f7</b> (bei Weiß h2, g2, f2).</p><p>Das Muster ist immer gleich: Die Dame schlägt oder zieht direkt vor den König, und ein <b>Helfer</b> deckt sie. Der König darf die Dame dann nicht schlagen.</p><p>Hier ist der Läufer d3 der Helfer für die Dame auf h7.</p>"},
    {type:"move", fen:"r1bq1rk1/ppp2ppp/2n5/3p3Q/3P4/3B4/PPP2PPP/R4RK1 w - - 0 1",
     text:"<b>Setze matt.</b>",
     lines:[["h5h7"]], hint:"Der Läufer d3 deckt h7.",
     done:"Matt. Der König kann die Dame nicht schlagen, weil der Läufer sie deckt, und f8 ist vom eigenen Turm besetzt."},
    {type:"move", fen:"r5k1/5ppp/8/5N2/6Q1/8/q4PPP/6K1 w - - 0 1",
     text:"Jetzt ist ein Springer der Helfer. <b>Setze matt.</b>",
     lines:[["g4g7"]], hint:"Der Springer f5 deckt das Feld g7.",
     done:"Matt auf g7. Springer auf f5 und Dame auf der g-Linie sind ein Muster, das du dir merken solltest."},
    {type:"move", fen:"r4rk1/ppp2p1p/5Pp1/8/8/7Q/PPP3PP/6K1 w - - 0 1",
     text:"Auch ein Bauer kann helfen. Der Bauer f6 deckt g7. <b>Setze in zwei Zügen matt.</b>",
     lines:[["h3h6","g8h8","h6g7"]], hint:"Die Dame muss zuerst nach h6. Von dort droht sie, auf g7 mattzusetzen.",
     done:"Matt. Ein weit vorgerückter Bauer auf f6 ist für den König lebensgefährlich."},
    {type:"move", fen:"r1bq1rk1/ppp2ppp/2n5/3p3Q/3P4/3B4/PPP2PPP/R4RK1 b - - 0 1", orient:"b",
     text:"Seitenwechsel: Du bist Schwarz, und Weiß droht Matt auf h7. <b>Wehre die Drohung ab.</b>",
     engine:6, hint:"Ein Bauer kann der Dame oder dem Läufer den Weg nach h7 versperren.",
     done:"Gut verteidigt. Sobald Dame und Läufer auf h7 zielen, brauchst du einen Bauern oder eine Figur dazwischen."}
  ]
},
{
  id:"vorteil", chapter:"Mittelspiel", title:"Einen Vorteil verwerten",
  intro:"Eine Figur mehr zu haben reicht nicht, man muss die Partie auch nach Hause bringen. Auf niedrigem Niveau gehen viele gewonnene Stellungen noch verloren.",
  steps:[
    {type:"info", fen:"3q1rk1/5ppp/8/8/8/8/5PPP/R2QR1K1 w - - 0 1",
     text:"<p>Mit Material mehr gelten vier Regeln:</p><ol><li><b>Figuren tauschen, Bauern behalten.</b> Je weniger Figuren, desto weniger Gegenspiel hat der Gegner.</li><li><b>Zuerst die Sicherheit:</b> Hat dein König ein Luftloch? Hängt etwas?</li><li><b>Kein Risiko:</b> Du brauchst keinen Angriff. Einfach, sicher, Schritt für Schritt.</li><li><b>Achtung Patt:</b> Hat der Gegner nur noch den König, muss er immer einen Zug haben, bis es Matt ist.</li></ol>"},
    {type:"move", fen:"3q1rk1/5ppp/8/8/8/8/5PPP/R2QR1K1 w - - 0 1",
     text:"Du hast einen Turm mehr. <b>Vereinfache die Stellung.</b>",
     accept:["d1d8"], hint:"Tausche die stärkste Figur des Gegners ab.",
     done:"Richtig. Ohne Damen kann Schwarz dir nicht mehr gefährlich werden, und der Turm mehr gewinnt."},
    {type:"quiz", fen:"k7/8/1K6/8/8/8/8/3Q4 w - - 0 1",
     text:"Du bist am Zug und kannst sofort mattsetzen. <b>Welcher Zug ist richtig?</b>",
     opts:[
       {t:"Dame nach d8: Schach auf der Grundreihe.", ok:true},
       {t:"Dame nach c7: Der König ist eingesperrt.", why:"Das ist Patt! Der König steht nicht im Schach, hat aber kein Feld mehr. Die Partie endet remis."},
       {t:"Dame nach a1: Schach auf der a-Linie.", why:"Der König weicht nach b8 aus. Es geht noch weiter, obwohl ein Matt in einem Zug möglich war."}
     ],
     done:"Matt. Prüfe bei einem nackten König immer: Hat er nach meinem Zug noch ein Feld, oder steht er im Schach?"},
    {type:"quiz", fen:"6k1/5ppp/8/8/8/2N5/5PPP/3R2K1 w - - 0 1",
     text:"Du hast Turm und Springer mehr. Der Gegner hat nur noch Bauern. <b>Was ist der sicherste Weg zum Sieg?</b>",
     opts:[
       {t:"Mit Turm und Springer die Bauern einsammeln, einen eigenen Bauern umwandeln und dann mattsetzen.", ok:true},
       {t:"Sofort alle Bauern nach vorn stürmen, auch die vor dem eigenen König.", why:"Dann steht dein König offen. Mit so viel Material mehr brauchst du kein Risiko."},
       {t:"Remis anbieten, bevor etwas schiefgeht.", why:"Die Stellung ist klar gewonnen. Spiel sie ruhig zu Ende."}
     ],
     done:"Genau. Erst das Material des Gegners abräumen, dann umwandeln, dann matt."}
  ]
},
{
  id:"freibauer", chapter:"Endspiel", title:"Freibauern",
  intro:"Ein Freibauer ist ein Bauer, dem kein gegnerischer Bauer mehr im Weg steht. Im Endspiel entscheidet er oft die Partie.",
  steps:[
    {type:"info", fen:"8/5kpp/8/P7/8/8/6PP/6K1 w - - 0 1",
     arrows:["a5a8"],
     text:"<p>Der Bauer a5 ist ein <b>Freibauer</b>: Auf der a-Linie und der b-Linie steht kein schwarzer Bauer, der ihn aufhalten oder schlagen kann.</p><p>Faustregeln:</p><ul><li><b>Freibauern müssen laufen.</b> Jeder Schritt bringt ihn der Umwandlung näher.</li><li>Kann der gegnerische König ihn nicht einholen (Quadratregel), läuft er einfach durch.</li><li><b>Türme gehören hinter Freibauern</b>, egal ob eigene oder gegnerische.</li></ul>"},
    {type:"move", fen:"8/5kpp/8/P7/8/8/6PP/6K1 w - - 0 1",
     text:"Der schwarze König ist weit weg. <b>Was spielst du?</b>",
     accept:["a5a6"], hint:"Freibauern müssen laufen.",
     done:"Richtig. Der König steht außerhalb des Quadrats und holt den Bauern nicht mehr ein."},
    {type:"move", fen:"6k1/ppp5/8/PPP5/8/8/8/6K1 w - - 0 1",
     text:"<b>Durchbruch:</b> Drei gegen drei, und trotzdem kommt ein Bauer durch. <b>Finde den ersten Zug.</b> Du darfst dabei Bauern opfern.",
     lines:[["b5b6","c7b6","a5a6","b7a6","c5c6"],["b5b6","a7b6","c5c6","b7c6","a5a6"]], hint:"Der mittlere Bauer geht vor. Egal wie Schwarz schlägt, ein Nachbar kommt durch.",
     done:"Der Durchbruch. Zwei Bauern geopfert, der dritte läuft zur Dame. Das klappt, weil deine Bauern schon auf der 5. Reihe stehen."},
    {type:"quiz", fen:"8/5ppp/4k3/8/8/8/5PPP/6K1 w - - 0 1",
     text:"Reines Bauernendspiel, die Damen sind getauscht. <b>Was ist jetzt die wichtigste Figur?</b>",
     opts:[
       {t:"Der König. Er läuft sofort in die Mitte und greift Bauern an.", ok:true},
       {t:"Der h-Bauer. Er läuft als Erster los.", why:"Ohne den König dahinter wird ein einzelner Bauer einfach abgeholt."},
       {t:"Der König bleibt auf g1, dort ist er sicher.", why:"Im Endspiel droht kein Matt mehr. Ein König am Rand fehlt im Kampf um die Bauern."}
     ],
     done:"Genau. Im Endspiel ist der König eine Angriffsfigur. Schwarz steht hier schon besser, weil sein König aktiver ist."}
  ]
}
]);

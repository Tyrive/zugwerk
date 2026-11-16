/* Zugwerk – Repertoire mit Schwarz: gegen 1. e4 (1…e5) und gegen 1. d4 (Damengambit abgelehnt).
   L(id, name, züge, {halbzug: erklärung}) hängt Erklärungen an den Zugpfad; gemeinsame Anfänge werden nur einmal erklärt. */
(function(){
  function build(def){
    const comments = {};
    const L = (id, name, moves, notes, extra) => {
      const mv = moves.split(" ");
      Object.keys(notes || {}).forEach(n => { const k = mv.slice(0, +n).join(" "); if (!comments[k]) comments[k] = notes[n]; });
      return Object.assign({id, name, set:"system", moves}, extra || {});
    };
    const op = def(L);
    op.comments = comments;
    return op;
  }

  /* ================= Schwarz gegen 1. e4 ================= */
  const E5 = build(L => ({
    id:"e5", name:"Schwarz gegen 1. e4: Offenes Spiel", short:"Gegen 1. e4", side:"b", eco:"C20–C84",
    home:{moves:"e4 e5 Nf3 Nc6", arrows:["c6e5", "f8c5"]},
    match:(sans, meW) => !meW && sans[0] === "e4" && sans[1] === "e5",
    summary:"Auf 1. e4 antwortest du mit 1…e5 und baust dich fast immer gleich auf: …Sc6, …Lc5 oder …Le7, …Sf6, …d6, Rochade. Hier lernst du, was du gegen Italienisch, Spanisch, Schottisch, frühe Damenausflüge und Gambits spielst.",
    idea:[
      "<b>Zentrum halten:</b> Dein Bauer e5 ist der Anker. Greift Weiß ihn an, deckst du ihn mit …Sc6 und später mit …d6.",
      "<b>Entwickeln mit Tempo:</b> …Sf6 greift e4 an. Weiß muss reagieren, und du hast eine Figur mehr im Spiel.",
      "<b>Dein schwacher Punkt ist f7.</b> Am Anfang deckt ihn nur der König. Zielen Dame und Läufer darauf, hat die Abwehr Vorrang.",
      "<b>Öffnet Weiß das Zentrum mit d4,</b> schlägst du auf d4 und suchst den Gegenstoß …d5.",
      "<b>Gambits lehnst du ab oder gibst den Bauern zurück.</b> Entwicklung ist dir wichtiger als ein Bauer."
    ],
    thinking:[
      "<b>Zielt etwas auf f7?</b> Dame und Läufer zusammen bedeuten Mattgefahr.",
      "<b>Ist e5 gedeckt?</b> Zähle Angreifer und Verteidiger.",
      "<b>Kann ich mit Tempo entwickeln?</b> Ein Zug, der entwickelt und etwas angreift, ist fast immer richtig.",
      "<b>Wurde das Zentrum geöffnet?</b> Dann schnell rochieren und den Gegenstoß …d5 prüfen."
    ],
    mistakes:[
      "Auf Dh5 mit …g6 antworten, bevor e5 gedeckt ist: Dann schlägt die Dame auf e5 mit Schach und gewinnt den Turm h8.",
      "…Sf6 spielen, während Dame und Läufer auf f7 zielen: Dxf7 ist Matt.",
      "Jeden Gambitbauern nehmen und dabei die Entwicklung vergessen.",
      "Nach d4 nicht schlagen, sondern passiv mit …d6 decken: Weiß bekommt dann zu viel Raum."
    ],
    groups:[
      {title:"Gegen Italienisch (3. Lc4)", note:"Die häufigste Eröffnung auf deinem Niveau. Du kennst sie schon von der weißen Seite.", lines:[
        L("e5-it-main", "Ruhiges Italienisch (4. c3 und 5. d3)", "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O Re1 a6 Bb3 Ba7 h3 h6 Nbd2 Re8", {
          1:"Weiß besetzt das Zentrum und öffnet Dame und Läufer.",
          2:"Du hältst dagegen. Der Bauer e5 nimmt Weiß die Felder d4 und f4 und öffnet deine Dame und den Läufer f8.",
          3:"Der Springer greift deinen Bauern e5 an.",
          4:"Deckt e5 und entwickelt eine Figur. Besser als …d6, weil dein Läufer f8 frei bleibt.",
          5:"Italienisch. Der Läufer zielt auf f7, das nur dein König deckt.",
          6:"Du stellst deinen Läufer genauso aktiv hin, er zielt auf f2. Nebenbei: Sg5 scheitert jetzt daran, dass deine Dame g5 angreift.",
          7:"Weiß bereitet d4 vor.",
          8:"Entwickelt und greift e4 an. Weiß muss e4 decken oder sofort d4 spielen.",
          9:"Die ruhige Fortsetzung: Der Bauer deckt e4.",
          10:"Deckt e5 fest und öffnet den Läufer c8.",
          12:"König in Sicherheit. Der Turm f8 deckt jetzt zusätzlich f7.",
          14:"Rückzugsfeld a7 für den Läufer, bevor b4 oder d4 ihn angreift.",
          16:"Vorbeugend zurück. Auf a7 ist der Läufer sicher und zielt weiter auf f2.",
          18:"Verhindert Lg5 (Fesselung des Springers f6) und Sg5.",
          20:"Stützt e5 und bereitet …Le6 und den Gegenstoß …d5 vor."
        }, {plan:"Du stehst solide. Als Nächstes …Le6, um den starken Läufer b3 abzutauschen, dann der Gegenstoß …d5."}),
        L("e5-it-d4", "Weiß stößt sofort im Zentrum vor (5. d4)", "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5 exd5 Nxd5 O-O O-O", {
          9:"Weiß greift im Zentrum an: Bauer e5 und Läufer c5 stehen unter Druck.",
          10:"Schlagen, nicht zurückweichen.",
          11:"Weiß hat jetzt zwei Bauern im Zentrum und greift deinen Läufer an.",
          12:"Der wichtigste Zug der Variante: mit Schach ausweichen. So verlierst du keine Zeit.",
          14:"Tauschen. Jede getauschte Figur nimmt dem weißen Zentrum Kraft.",
          16:"Der Gegenstoß. Er sprengt das weiße Zentrum, bevor e5 deinen Springer vertreibt.",
          18:"Dein Springer steht stark auf d5, direkt vor dem einzelnen weißen Bauern d4.",
          20:"Rochade. Beide Seiten sind entwickelt, du hast keine Schwächen."
        }, {plan:"Weiß hat einen einzelnen Bauern auf d4. Halte den Springer auf d5 davor, tausche Figuren, im Endspiel wird der Bauer schwach."}),
        L("e5-it-d3", "Weiß spielt 4. d3", "e4 e5 Nf3 Nc6 Bc4 Bc5 d3 Nf6 O-O d6 c3 O-O", {
          7:"Weiß deckt e4 zuerst und baut sich ruhig auf.",
          8:"Dein normaler Aufbau: Springer raus, Angriff auf e4.",
          10:"Deckt e5 und öffnet den Läufer c8.",
          12:"Rochade. Danach folgen wie immer …a6, …La7 und …h6."
        }),
        L("e5-it-nc3", "Weiß fesselt mit Lg5 (4. Sc3, 6. Lg5)", "e4 e5 Nf3 Nc6 Bc4 Bc5 Nc3 Nf6 d3 d6 Bg5 h6 Bxf6 Qxf6 Nd5 Qd8 c3 a6", {
          7:"Weiß entwickelt den Springer. Dadurch ist das Feld c3 für den Bauern verstellt, d4 kommt so schnell nicht.",
          8:"Entwickeln und e4 angreifen.",
          10:"Deckt e5 und öffnet den Läufer c8.",
          11:"Fesselt deinen Springer f6 an die Dame. Als Nächstes käme Sd5 mit Druck auf f6.",
          12:"Frag den Läufer sofort: schlagen oder zurückziehen?",
          14:"Mit der Dame zurückschlagen, damit deine Bauern vor dem König heil bleiben.",
          15:"Der Springer greift die Dame an und droht auf c7 eine Gabel mit Schach.",
          16:"Zurück nach d8: Die Dame deckt c7. Nichts ist passiert, und du hast das Läuferpaar.",
          18:"Rückzugsfeld für den Läufer, bevor b4 kommt."
        }),
        L("e5-it-oo", "Weiß rochiert sofort (4. O-O)", "e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6 d3 d6 c3 O-O", {
          8:"Gleicher Aufbau wie immer. Den Bauern e4 schlägst du nicht, Weiß bekäme ihn über die e-Linie zurück.",
          10:"Deckt e5 und öffnet den Läufer c8.",
          12:"Rochade. Danach wie immer …a6, …La7 und …h6."
        }),
        L("e5-it-evans", "Evans-Gambit (4. b4): sicher ablehnen", "e4 e5 Nf3 Nc6 Bc4 Bc5 b4 Bb6 a4 a6 Nc3 Nf6", {
          7:"Evans-Gambit: Weiß bietet einen Bauern an, um mit c3 und d4 Zeit zu gewinnen.",
          8:"Sicher ablehnen. Der Läufer bleibt auf seiner Diagonale, und du brauchst keine Theorie.",
          9:"Droht a5 und würde deinen Läufer fangen.",
          10:"Macht das Rückzugsfeld a7 frei.",
          12:"Weiter mit dem gewohnten Aufbau: Springer raus, dann …d6 und Rochade."
        })
      ]},
      {title:"Fehler von Weiß im Italienischen", note:"Das spielen Gegner auf deinem Niveau wirklich. So bestrafst du es.", lines:[
        L("e5-it-ng5", "4. Sg5? verliert eine Figur", "e4 e5 Nf3 Nc6 Bc4 Bc5 Ng5 Qxg5 d4 Qxg2 Rf1 Bxd4", {
          7:"Ein Fehler! Weiß will f7 angreifen, aber der Springer hängt: Deine Dame schaut über die offene Diagonale auf g5.",
          8:"Einfach schlagen. Du hast eine Figur mehr.",
          9:"Ein Trick: Der Bauer greift deinen Läufer an und öffnet den Läufer c1 gegen deine Dame.",
          10:"Die Dame weicht mit Gewinn aus. Sie schlägt g2 und greift den Turm h1 an.",
          12:"Jetzt rettest du auch noch den Läufer und nimmst einen weiteren Bauern mit."
        }, {plan:"Du hast eine Figur und zwei Bauern mehr. Entwickle dich ruhig weiter und tausche Figuren."}),
        L("e5-it-bxf7", "4. Lxf7+? Das Läuferopfer", "e4 e5 Nf3 Nc6 Bc4 Bc5 Bxf7+ Kxf7 Nxe5+ Nxe5 Qh5+ Ng6 Qxc5 d6", {
          7:"Ein Fehler, der oft gespielt wird: Weiß gibt den Läufer für einen Bauern und hofft auf Angriff.",
          8:"Schlagen. Dein König steht danach etwas offen, aber du hast eine Figur mehr.",
          9:"Weiß opfert noch eine Figur, um mit der Dame Schach zu geben.",
          10:"Auch das nimmst du.",
          11:"Die Dame greift König und Springer zugleich an und schielt auf den Läufer c5.",
          12:"Der Springer deckt das Schach und rettet sich selbst. Den Läufer c5 gibst du zurück.",
          14:"Greift die Dame an und öffnet den Läufer c8. Du hast eine Figur für zwei Bauern mehr."
        }, {plan:"Bring den König mit …Sf6, …Tf8 und …Kg8 in Sicherheit. Danach zählt deine Mehrfigur."})
      ]},
      {title:"Gegen Spanisch (3. Lb5)", note:"Der Läufer greift den Springer an, der e5 deckt.", lines:[
        L("e5-sp-main", "Spanisch Hauptvariante", "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3", {
          5:"Spanisch. Der Läufer greift den Springer an, der e5 deckt. Noch droht nichts: Nach Lxc6 und Sxe5 holst du den Bauern mit …Dd4 zurück.",
          6:"Fragt den Läufer: tauschen oder zurückziehen?",
          8:"Entwickelt und greift e4 an.",
          9:"Weiß lässt e4 scheinbar hängen. Schlägst du, holt er sich den Bauern über die e-Linie zurück.",
          10:"Solide. Der Läufer schließt die e-Linie, und du kannst rochieren.",
          11:"Deckt e4. Jetzt droht Weiß wirklich, auf c6 zu tauschen und e5 zu schlagen.",
          12:"Jetzt nötig: Der Bauer vertreibt den Läufer, damit dein Springer c6 als Deckung für e5 bleibt.",
          14:"Deckt e5 endgültig und öffnet den Läufer c8.",
          16:"Rochade. Dein Aufbau steht."
        }, {plan:"Typischer Plan: …Sa5 vertreibt den Läufer b3, danach …c5 mit Raum am Damenflügel."}),
        L("e5-sp-d3", "Spanisch mit 5. d3", "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 d3 d6 c3 Be7 O-O O-O", {
          9:"Weiß deckt e4 und spielt ruhig.",
          10:"Deckt e5. Jetzt wäre der Tausch auf c6 keine Drohung mehr.",
          12:"Der Läufer macht die Rochade möglich.",
          14:"Rochade. Danach …b5 und …Sa5 oder …Te8."
        }),
        L("e5-sp-x", "Abtauschvariante (4. Lxc6)", "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 O-O Bd6 d4 exd4 Qxd4 f6", {
          7:"Abtauschvariante. Weiß gibt das Läuferpaar, um deine Bauern zu verdoppeln.",
          8:"Mit dem d-Bauern schlagen: Das öffnet Dame und Läufer c8.",
          9:"Nach der Rochade ist e5 wirklich bedroht.",
          10:"Deckt e5 einfach und entwickelt.",
          12:"Schlagen. Deine Läufer mögen offene Stellungen.",
          13:"Die Dame greift g7 an.",
          14:"Versperrt der Dame den Weg nach g7 und nimmt dem Springer die Felder e5 und g5."
        }, {plan:"Du hast das Läuferpaar. Entwickle mit …Se7 und …Le6 und rochiere."}),
        L("e5-sp-x-ne5", "Abtausch: Weiß schlägt sofort auf e5", "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6 Nxe5 Qd4 Nf3 Qxe4+ Qe2 Qxe2+ Kxe2", {
          9:"Weiß nimmt den Bauern. Er bekommt ihn aber nicht umsonst.",
          10:"Doppelangriff auf den Springer e5 und den Bauern e4.",
          12:"Bauer zurück, und das mit Schach.",
          14:"Damentausch. Weiß kann nicht mehr rochieren."
        }, {plan:"Gleiches Material, aber du hast das Läuferpaar. Entwickle mit …Lf5 oder …Lg4 und rochiere lang."})
      ]},
      {title:"Weiß öffnet das Zentrum mit d4", note:"Schottisch, Schottisches Gambit, Mittelgambit, Dänisches Gambit.", lines:[
        L("e5-sc-main", "Schottisch (3. d4)", "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nc3 Bb4 Nxc6 bxc6 Bd3 d5 exd5 cxd5 O-O O-O", {
          5:"Schottisch. Weiß öffnet sofort das Zentrum.",
          6:"Schlagen. Wer hier nur deckt, lässt Weiß zu viel Raum.",
          8:"Entwickelt mit Angriff auf e4.",
          10:"Fesselt den Springer c3, der e4 deckt. Wieder ist e4 bedroht.",
          12:"Zum Zentrum hin schlagen. Der Bauer c6 stützt gleich deinen Vorstoß …d5.",
          14:"Dein Gegenstoß im Zentrum.",
          16:"Du hast einen Bauern im Zentrum und offene Linien für die Figuren.",
          18:"Rochade. Gleiches Spiel mit aktiven Figuren."
        }),
        L("e5-sc-nxc6", "Schottisch mit 5. Sxc6 und 6. e5", "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nxc6 bxc6 e5 Qe7 Qe2 Nd5 c4 Nb6", {
          11:"Der Bauer greift deinen Springer an.",
          12:"Die Dame fesselt den Bauern e5 an den weißen König. Dein Springer muss noch nicht weg.",
          14:"Jetzt zieht der Springer, und zwar ins Zentrum.",
          16:"Der Springer weicht aus und greift den Bauern c4 an."
        }),
        L("e5-sc-gambit", "Schottisches Gambit (4. Lc4)", "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 Nf6 cxd4 Bb4+ Bd2 Bxd2+ Nbxd2 d5", {
          7:"Schottisches Gambit: Weiß schlägt nicht zurück, sondern entwickelt.",
          8:"Deckt den Bauern d4 und führt in Stellungen, die du aus dem Italienischen kennst.",
          10:"Nicht gierig auf c3 schlagen. Entwickeln ist sicherer.",
          12:"Wie im Italienischen: mit Schach ausweichen.",
          14:"Tauschen nimmt dem weißen Zentrum Kraft.",
          16:"Der Gegenstoß sprengt das Zentrum."
        }),
        L("e5-sc-gambit-e5", "Schottisches Gambit mit 6. e5", "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Bc5 c3 Nf6 e5 d5 Bb5 Ne4 cxd4 Bb6", {
          11:"Der Bauer greift deinen Springer an.",
          12:"Gegenangriff auf den Läufer c4, statt den Springer wegzuziehen.",
          14:"Erst jetzt zieht der Springer, auf ein starkes Feld im Zentrum.",
          16:"Der Läufer weicht aus und drückt weiter auf d4."
        }),
        L("e5-mittel", "Mittelgambit (2. d4 exd4 3. Dxd4)", "e4 e5 d4 exd4 Qxd4 Nc6 Qe3 Nf6 Nc3 Bb4 Bd2 O-O O-O-O Re8", {
          3:"Weiß öffnet sofort das Zentrum.",
          4:"Schlagen.",
          6:"Entwickelt mit Tempo: Die Dame muss schon wieder ziehen.",
          8:"Springer raus, Angriff auf e4.",
          10:"Fesselt den Springer c3 und erhöht den Druck auf e4.",
          12:"Rochade, der Turm kommt gleich auf die e-Linie.",
          14:"Der Turm stellt sich der Dame gegenüber. Der Bauer e4 wird zum Ziel."
        }),
        L("e5-daenisch", "Dänisches Gambit (3. c3): mit …d5 ablehnen", "e4 e5 d4 exd4 c3 d5 exd5 Qxd5 cxd4 Nc6 Nf3 Bg4 Be2 Bb4+ Nc3 Bxf3 Bxf3 Qc4", {
          5:"Dänisches Gambit. Nimmst du alle Bauern, bekommt Weiß zwei gefährliche Läufer gegen deinen König.",
          6:"Am einfachsten: Gambit ablehnen und selbst das Zentrum öffnen.",
          8:"Die Dame steht im Zentrum sicher, weil der Springer b1 nicht nach c3 kann, solange dort der Bauer steht.",
          10:"Greift den Bauern d4 an.",
          12:"Fesselt den Springer, der d4 deckt.",
          14:"Entwickeln mit Schach.",
          16:"Tauscht den Verteidiger von d4 ab.",
          18:"Die Dame verhindert die weiße Rochade und hält den Druck."
        })
      ]},
      {title:"Frühe Dame: Schäfermatt-Versuche", note:"Kommt bei 400 Elo ständig. Ruhig bleiben, decken, mit Tempo entwickeln.", lines:[
        L("e5-qh5", "2. Dh5: sauber abwehren", "e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Ne2 Bg7", {
          3:"Die Dame greift e5 an. Mit Lc4 käme die Mattdrohung auf f7 dazu.",
          4:"Deckt e5 und entwickelt. Nicht sofort …g6: Dann schlägt die Dame auf e5 mit Schach und gewinnt den Turm h8.",
          5:"Jetzt droht Matt auf f7.",
          6:"Wehrt das Matt ab und vertreibt die Dame. Jetzt geht das, weil e5 gedeckt ist.",
          7:"Droht wieder Matt auf f7.",
          8:"Blockiert die f-Linie und entwickelt. Die Drohung ist vorbei, und Weiß hat bisher fast nur die Dame gezogen.",
          10:"Der Läufer kommt auf die lange Diagonale, dann rochierst du."
        }, {plan:"Rochiere, dann …d6 oder …d5. Du hast Entwicklungsvorsprung, und die weiße Dame steht ihren eigenen Figuren im Weg."}),
        L("e5-qh5-falle", "2. Dh5 mit 5. Db3? verliert eine Figur", "e4 e5 Qh5 Nc6 Bc4 g6 Qf3 Nf6 Qb3 Nd4 Bxf7+ Ke7 Qc4 b5", {
          9:"Ein Fehler. Weiß zielt noch einmal auf f7 und übersieht deinen Springer.",
          10:"Greift die Dame an und droht eine Gabel auf c2.",
          11:"Weiß schlägt mit Schach, aber der Läufer kommt nicht mehr heraus.",
          12:"Der König greift den Läufer an. Er hängt jetzt an der Dame.",
          13:"Die Dame deckt den Läufer und c2.",
          14:"Vertreibt die Dame. Sie kann den Läufer f7 nicht mehr decken, Weiß verliert eine Figur."
        }),
        L("e5-qf3", "2. Df3", "e4 e5 Qf3 Nc6 Bc4 Nf6 Ne2 Bc5", {
          3:"Die Dame zielt auf f7, nimmt aber dem eigenen Springer das Feld f3.",
          4:"Entwickeln. Noch droht nichts.",
          5:"Jetzt zielen Dame und Läufer auf f7.",
          6:"Der Springer blockiert die f-Linie. Damit ist f7 sicher.",
          8:"Weiter entwickeln. Als Nächstes …d6 und Rochade."
        }),
        L("e5-lc4", "Läuferspiel (2. Lc4)", "e4 e5 Bc4 Nf6 d3 Nc6 Nf3 Bc5 O-O d6", {
          3:"Läuferspiel. Weiß zielt früh auf f7 und möchte oft Dh5 folgen lassen.",
          4:"Entwickelt, greift e4 an und nimmt der Dame das Feld h5.",
          6:"Zweiter Springer raus.",
          8:"Jetzt ist es eine normale italienische Stellung.",
          10:"Deckt e5 und öffnet den Läufer c8."
        })
      ]},
      {title:"Andere Systeme", note:"Wiener Partie, Königsgambit, Vierspringerspiel.", lines:[
        L("e5-wiener", "Wiener Partie (2. Sc3)", "e4 e5 Nc3 Nf6 Bc4 Nc6 d3 Bc5 Nf3 d6", {
          3:"Wiener Partie. Weiß hält sich den Vorstoß f4 offen.",
          4:"Springer raus, Angriff auf e4.",
          6:"Entwickeln und e5 decken.",
          8:"Der Läufer zielt auf f2.",
          10:"Deckt e5 und öffnet den Läufer c8."
        }),
        L("e5-wiener-f4", "Wiener Gambit (3. f4)", "e4 e5 Nc3 Nf6 f4 d5 fxe5 Nxe4 Nf3 Be7", {
          5:"Wiener Gambit. Hier nicht auf f4 schlagen, sonst vertreibt e5 deinen Springer nach hinten.",
          6:"Die beste Antwort: Gegenstoß im Zentrum.",
          8:"Dein Springer steht stark im Zentrum.",
          10:"Entwickeln und die Rochade vorbereiten."
        }),
        L("e5-kg", "Königsgambit (2. f4): ablehnen mit …Lc5", "e4 e5 f4 Bc5 Nf3 d6 Nc3 Nf6 Bc4 Nc6 d3 a6", {
          3:"Königsgambit. Weiß bietet einen Bauern für Angriff an.",
          4:"Ablehnen und entwickeln. Der Läufer zielt auf g1, deshalb kann Weiß vorerst nicht kurz rochieren.",
          6:"Deckt e5.",
          8:"Springer raus, Angriff auf e4.",
          10:"Zweiter Springer raus.",
          12:"Rückzugsfeld a7 für den Läufer, bevor Sa4 ihn abtauscht."
        }),
        L("e5-kg-falle", "Königsgambit: 3. fxe5? verliert den Turm", "e4 e5 f4 Bc5 fxe5 Qh4+ g3 Qxe4+ Qe2 Qxh1", {
          5:"Ein schwerer Fehler. Der Bauer f2 fehlt, die Diagonale zum weißen König ist offen.",
          6:"Schach! Geht der König nach e2, ist es mit der Dame auf e4 Matt.",
          8:"Gabel: Schach und Angriff auf den Turm h1.",
          10:"Du hast einen ganzen Turm gewonnen."
        }),
        L("e5-vier", "Vierspringerspiel (4. Lb5)", "e4 e5 Nf3 Nc6 Nc3 Nf6 Bb5 Bb4 O-O O-O d3 d6", {
          5:"Weiß entwickelt den zweiten Springer.",
          6:"Du auch. Jetzt ist e4 angegriffen.",
          8:"Spiegeln: Du fesselst seinen Springer so, wie er deinen bedrängt.",
          10:"Rochade.",
          12:"Deckt e5 und öffnet den Läufer c8."
        }),
        L("e5-vier-d4", "Vierspringerspiel mit 4. d4", "e4 e5 Nf3 Nc6 Nc3 Nf6 d4 exd4 Nxd4 Bb4 Nxc6 bxc6 Bd3 d5", {
          8:"Schlagen, wie im Schottischen.",
          10:"Fesselt den Springer c3, e4 ist wieder bedroht.",
          12:"Zum Zentrum hin schlagen.",
          14:"Der Gegenstoß. Dieselbe Stellung wie im Schottischen."
        }),
        L("e5-vier-lc4", "Vierspringerspiel mit 4. Lc4", "e4 e5 Nf3 Nc6 Nc3 Nf6 Bc4 Bc5 d3 d6", {
          8:"Italienischer Aufbau: Der Läufer zielt auf f2.",
          10:"Deckt e5. Auf Lg5 antwortest du mit …h6."
        })
      ]}
    ]
  }));

  /* ================= Schwarz gegen 1. d4 ================= */
  const D5 = build(L => ({
    id:"d5", name:"Schwarz gegen 1. d4: Damengambit abgelehnt", short:"Gegen 1. d4", side:"b", eco:"D02–D63",
    home:{moves:"d4 d5 c4 e6", arrows:["e6d5"]},
    match:(sans, meW) => !meW && sans[0] === "d4" && sans[1] === "d5",
    summary:"Gegen 1. d4 baust du eine feste Mauer: …d5, …e6, …Sf6, …Le7, Rochade. Der Aufbau funktioniert gegen das Damengambit, das Londoner System und fast alles andere, was mit d4 beginnt.",
    idea:[
      "<b>d5 halten:</b> Der Bauer d5 ist dein Anker im Zentrum. Mit …e6 und später …c6 stützt du ihn.",
      "<b>Immer gleicher Aufbau:</b> …d5, …e6, …Sf6, …Le7, Rochade, …Sbd7. Erst danach entscheidest du dich für einen Plan.",
      "<b>Dein Problem ist der Läufer c8.</b> Er steht hinter dem Bauern e6. Du befreist ihn mit …dxc4 und …e5, oder über …b6 und …Lb7.",
      "<b>Gegen das Londoner System</b> (Lf4) spielst du aktiver: …c5, …Sc6 und …Ld6, um den Läufer f4 abzutauschen.",
      "<b>Tauschen hilft dir:</b> Deine Stellung ist etwas eng. Jeder Figurentausch macht sie bequemer."
    ],
    thinking:[
      "<b>Ist d5 genug gedeckt?</b> Zähle Angreifer und Verteidiger, bevor du etwas anderes ziehst.",
      "<b>Was macht mein Läufer c8?</b> Suche einen Weg, ihn ins Spiel zu bringen.",
      "<b>Kann ich mit …c5 oder …e5 im Zentrum zurückschlagen?</b> Das sind deine beiden Befreiungszüge.",
      "<b>Zielen Dame und Läufer auf h7?</b> Dann bleibt der Springer f6 stehen, oder ein Springer geht nach f8."
    ],
    mistakes:[
      "Im Damengambit auf c4 schlagen und den Bauern mit …b5 festhalten wollen: Das kostet meist Material.",
      "Den Läufer c8 für immer hinter den Bauern einsperren und keinen Befreiungszug suchen.",
      "…Sf6 von f6 wegziehen, während Dame und Läufer auf h7 zielen.",
      "Gegen das Londoner System zu passiv spielen: …c5 gehört früh aufs Brett."
    ],
    plan:(bd, side, h) => {
      if (side !== "b") return null;
      const P = h.pieceAt, typical = P(bd, "d5", "p", "b") || P(bd, "e6", "p", "b");
      if (!typical) return null;
      return {italian:true, items:[
        {t:"…d5", why:"Besetzt das Zentrum und verhindert e4.", done:!P(bd, "d7", "p", "b")},
        {t:"…e6", why:"Stützt d5 und öffnet den Läufer f8.", done:!P(bd, "e7", "p", "b")},
        {t:"…Sf6", why:"Entwickelt und deckt d5 und h7.", done:!P(bd, "g8", "n", "b")},
        {t:"…Le7 (gegen Lf4 lieber …Ld6)", why:"Hebt eine Fesselung auf und macht die Rochade möglich.", done:!P(bd, "f8", "b", "b")},
        {t:"Rochade", why:"König in Sicherheit, der Turm kommt ins Spiel.", done:!P(bd, "e8", "k", "b")},
        {t:"…Sbd7 (oder …Sc6 nach …c5)", why:"Der zweite Springer deckt f6 und stützt …c5 oder …e5.", done:!P(bd, "b8", "n", "b")},
        {t:"…c6 oder …c5", why:"…c6 stützt d5, …c5 greift das weiße Zentrum an.", done:!P(bd, "c7", "p", "b")},
        {t:"Läufer c8 befreien", why:"Über …dxc4 und …e5, oder mit …b6 und …Lb7.", done:!P(bd, "c8", "b", "b")},
        {t:"Türme auf e8 und c8", why:"Dorthin, wo sich Linien öffnen werden.", done:!P(bd, "a8", "r", "b") && !P(bd, "f8", "r", "b")}
      ]};
    },
    groups:[
      {title:"Damengambit (2. c4)", note:"Die Hauptantwort auf 1…d5.", lines:[
        L("d5-qgd-main", "Hauptvariante mit Lg5", "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 e3 Be7 Nf3 O-O Rc1 c6 Bd3 dxc4 Bxc4 Nd5 Bxe7 Qxe7 O-O Nxc3 Rxc3 e5", {
          1:"Weiß besetzt das Zentrum.",
          2:"Du besetzt es auch und verhinderst e4.",
          3:"Damengambit. Weiß greift d5 an. Es ist kein echtes Opfer: Nimmst du, holt sich Weiß den Bauern fast immer zurück.",
          4:"Stützt d5 mit einem Bauern. Schlägt Weiß, schlägst du mit dem e-Bauern zurück und behältst einen Bauern im Zentrum.",
          5:"Noch ein Angreifer auf d5.",
          6:"Noch ein Verteidiger für d5.",
          7:"Fesselt den Springer f6, der d5 deckt.",
          8:"Entwickelt und deckt f6 ein zweites Mal. Dahinter steckt eine Falle: Weiß kann auf d5 keinen Bauern gewinnen.",
          10:"Hebt die Fesselung auf.",
          12:"Rochade. Dein Grundaufbau steht.",
          14:"Stützt d5 noch einmal und nimmt dem Springer c3 das Feld b5.",
          16:"Jetzt schlagen: Der Läufer hat gerade erst gezogen und muss gleich noch einmal ziehen.",
          18:"Bietet Tausch an. In engen Stellungen helfen Tauschgeschäfte.",
          20:"Mit der Dame zurückschlagen, sie steht auf e7 gut.",
          22:"Noch ein Tausch.",
          24:"Der Befreiungszug. Jetzt kommt endlich der Läufer c8 ins Spiel."
        }, {plan:"Die Stellung ist ausgeglichen. Entwickle den Läufer c8 und stelle einen Turm auf die e-Linie oder d-Linie."}),
        L("d5-qgd-falle", "Elefantenfalle: Weiß schlägt auf d5", "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 Nxd5 Nxd5 Bxd8 Bb4+ Qd2 Bxd2+ Kxd2 Kxd8", {
          9:"Weiß tauscht im Zentrum.",
          10:"Mit dem e-Bauern zurück. So wird auch der Läufer c8 frei.",
          11:"Ein Fehler! Weiß glaubt, dein Springer f6 sei gefesselt und könne nicht schlagen.",
          12:"Du schlägst trotzdem. Die Dame geht kurz verloren …",
          14:"… aber dieses Schach holt alles zurück. Weiß kann nur die Dame dazwischenstellen.",
          16:"Dame zurückgewonnen.",
          18:"Du hast eine Figur mehr."
        }, {plan:"Eine Figur mehr im Endspiel. Entwickle dich, tausche weiter ab."}),
        L("d5-qgd-tausch", "Abtauschvariante (5. cxd5)", "d4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7 cxd5 exd5 e3 Be7 Bd3 O-O Qc2 Re8 Nf3 c6", {
          12:"Hebt die Fesselung auf.",
          14:"Rochade.",
          15:"Dame und Läufer zielen auf h7. Noch deckt der Springer f6.",
          16:"Macht das Feld f8 für den Springer d7 frei. Von f8 aus deckt er h7.",
          18:"Stützt d5. Deine Stellung ist fest."
        }, {plan:"Springer von d7 nach f8, dann …Le6 oder …Sg6. Dein Läufer c8 ist in dieser Variante frei."}),
        L("d5-qgd-tausch4", "Früher Tausch (4. cxd5)", "d4 d5 c4 e6 Nc3 Nf6 cxd5 exd5 Bg5 Be7 e3 O-O Bd3 Nbd7 Qc2 Re8 Nf3 c6", {
          8:"Mit dem e-Bauern zurück: Bauer im Zentrum behalten, Läufer c8 befreien.",
          10:"Hebt die Fesselung sofort auf.",
          12:"Rochade.",
          14:"Der Springer deckt f6 und kann später nach f8.",
          16:"Macht f8 für den Springer frei.",
          18:"Stützt d5."
        }),
        L("d5-qgd-sf3", "Weiß spielt Sf3 und Lg5", "d4 d5 c4 e6 Nf3 Nf6 Nc3 Be7 Bg5 O-O e3 Nbd7 Rc1 c6", {
          6:"Springer raus, deckt d5.",
          8:"Der Läufer kommt nach e7, bevor Lg5 den Springer fesseln kann.",
          10:"Rochade.",
          12:"Dein gewohnter Aufbau.",
          14:"Stützt d5. Du bist in der Hauptvariante gelandet."
        }),
        L("d5-qgd-lf4", "Weiß spielt Lf4 statt Lg5", "d4 d5 c4 e6 Nf3 Nf6 Nc3 Be7 Bf4 O-O e3 c5 dxc5 Bxc5", {
          9:"Der Läufer geht nach f4 statt g5. Dein Springer ist nicht gefesselt.",
          10:"Rochade.",
          12:"Gegen Lf4 schlägst du sofort im Zentrum zurück.",
          14:"Der Läufer schlägt zurück und steht aktiv."
        }),
        L("d5-qgd-e3", "Weiß baut ruhig auf (e3 und Ld3)", "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 e3 O-O Bd3 b6 O-O Bb7", {
          8:"Läufer raus, Rochade vorbereiten.",
          10:"Rochade.",
          12:"Weiß hat seinen Läufer c1 selbst eingesperrt. Du bringst deinen über b7 ins Spiel.",
          14:"Der Läufer steht auf der langen Diagonale und deckt d5."
        }, {plan:"Als Nächstes …Sbd7 und …c5. Deine Figuren stehen alle gut."})
      ]},
      {title:"Londoner System (Lf4)", note:"Sehr beliebt bei Vereinsspielern und online. Weiß baut immer gleich auf.", lines:[
        L("d5-london", "London mit 2. Lf4", "d4 d5 Bf4 c5 e3 Nc6 c3 Nf6 Nd2 e6 Ngf3 Bd6 Bg3 O-O Bd3 b6", {
          3:"Londoner System. Weiß baut immer gleich auf: Lf4, e3, c3, Sf3, Ld3.",
          4:"Greift d4 an und macht Platz für den Springer auf c6.",
          6:"Noch ein Angreifer auf d4.",
          8:"Springer raus.",
          10:"Öffnet den Läufer f8.",
          12:"Bietet den Tausch des starken Läufers f4 an.",
          14:"Rochade.",
          16:"Der Läufer c8 kommt über b7 ins Spiel."
        }, {plan:"Als Nächstes …Lb7 und ein Turm nach c8. Schlägt Weiß auf d6, schlägst du mit der Dame zurück."}),
        L("d5-london-sf3", "London mit 2. Sf3 und 3. Lf4", "d4 d5 Nf3 Nf6 Bf4 c5 e3 Nc6 c3 e6 Nbd2 Bd6 Bg3 O-O", {
          4:"Springer raus.",
          6:"Derselbe Plan wie gegen 2. Lf4: sofort das Zentrum angreifen.",
          8:"Noch ein Angreifer auf d4.",
          10:"Öffnet den Läufer f8.",
          12:"Bietet den Läufertausch an.",
          14:"Rochade."
        }),
        L("d5-london-dxc5", "London: Weiß schlägt auf c5", "d4 d5 Bf4 c5 dxc5 e6 Nf3 Bxc5 e3 Nc6", {
          5:"Weiß nimmt den Bauern.",
          6:"Du holst ihn gleich mit dem Läufer zurück. Will Weiß ihn mit b4 festhalten, zerstörst du die Bauern mit …a5.",
          8:"Bauer zurück, Läufer entwickelt.",
          10:"Springer raus. Du stehst bequem."
        })
      ]},
      {title:"Andere Aufbauten", note:"Colle-System, Sc3 mit Lf4, Blackmar-Diemer-Gambit.", lines:[
        L("d5-colle", "Colle-System (e3, Ld3, c3)", "d4 d5 Nf3 Nf6 e3 e6 Bd3 c5 c3 Nc6 O-O Bd6 Nbd2 O-O", {
          5:"Weiß baut sich ruhig auf und sperrt dabei seinen Läufer c1 ein.",
          6:"Öffnet den Läufer f8.",
          8:"Greift das Zentrum an.",
          10:"Springer raus, Druck auf d4.",
          12:"Der Läufer steht aktiv und kontrolliert e5.",
          14:"Rochade."
        }, {plan:"Weiß will e4 spielen. Darauf schlägst du auf e4 und hast keine Probleme. Selbst kannst du …e5 vorbereiten."}),
        L("d5-sf3-c4", "2. Sf3 und dann c4", "d4 d5 Nf3 Nf6 c4 e6 Nc3 Be7 Bg5 O-O e3 Nbd7", {
          6:"Stützt d5. Du bist im Damengambit.",
          8:"Läufer nach e7, bevor die Fesselung kommt.",
          10:"Rochade.",
          12:"Dein gewohnter Aufbau."
        }),
        L("d5-jobava", "Sc3 und Lf4 (Jobava-London)", "d4 d5 Nc3 Nf6 Bf4 a6 e3 e6 Nf3 c5", {
          3:"Weiß verstellt seinen c-Bauern. Meist folgt Lf4 und der Springer springt nach b5 mit Angriff auf c7.",
          4:"Springer raus.",
          5:"Jetzt droht der Springer nach b5 zu gehen.",
          6:"Nimmt dem Springer das Feld b5. Damit ist die Hauptidee von Weiß erledigt.",
          8:"Öffnet den Läufer f8.",
          10:"Greift das Zentrum an. Weiß kann d4 nicht mit c3 stützen."
        }),
        L("d5-bdg", "Blackmar-Diemer-Gambit (2. e4)", "d4 d5 e4 dxe4 Nc3 Nf6 f3 exf3 Nxf3 e6 Bg5 Be7 Bd3 Nbd7", {
          3:"Blackmar-Diemer-Gambit. Weiß opfert einen Bauern für schnelle Entwicklung.",
          4:"Annehmen. Der Bauer ist gesund.",
          6:"Springer raus, deckt e4.",
          7:"Weiß will den Bauern abtauschen und die f-Linie öffnen.",
          8:"Schlagen. Du behältst einen Bauern mehr.",
          10:"Solide: Der Bauer versperrt die Diagonale nach f7.",
          12:"Hebt die Fesselung auf.",
          14:"Deckt f6. Danach rochierst du."
        }, {plan:"Du hast einen Bauern mehr. Rochiere, spiele …c5 und tausche Figuren. Achte auf Opfer auf h7."})
      ]}
    ]
  }));

  window.OPENINGS.push(E5, D5);
})();

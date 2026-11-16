# Zugwerk

Kostenlose Schachanalyse für chess.com-Partien. Stockfish 19 läuft als WebAssembly direkt im Browser, ohne Server.

- `index.html` – die App
- `engine/` – Stockfish 19 lite (single-threaded), Lizenz GPLv3, Quelle: https://github.com/nmrugg/stockfish.js

## Funktionen

- **Analyse:** chess.com-Partien oder PGN, Klassifizierung jedes Zugs mit Erklärung, geschlagene Figuren und Materialvorsprung am Brett, Lernzusammenfassung (Fehlerarten, Genauigkeit je Partiephase, passende Übung), Sprung von Fehler zu Fehler, gespeicherte Analysen der letzten 12 Partien.
- **Training:** geführtes Tagestraining, 281 Rätsel mit Erklärungen, Wiederholung verpatzter Rätsel, Trefferquote nach Thema, 19 Lektionen, eigene Fehler als Rätsel, Rätsel-Sturm, Felder finden.
- **Eröffnungen:** Italienisch mit Weiß, Schwarz gegen 1. e4 und gegen 1. d4; Lernen, Üben, Wiederholung nach Tagen, Bot, Vergleich mit eigenen Partien.
- **Sync:** Fortschritt über einen privaten GitHub-Gist.

Dateien: `lessons.js`, `lessons2.js`, `puzzles.js`, `openings.js`, `openings2.js`, `plans.js`, `openings-ui.js`, `training.js`, `sync.js`, `spell.js`.

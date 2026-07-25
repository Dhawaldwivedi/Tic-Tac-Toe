# Tic Tac Toe

A modern, animated Tic Tac Toe game built with plain HTML, CSS, and JavaScript — no frameworks, no build tools, just open it in a browser and play.

## 1. Project Overview

This is a two-player (local, same-screen) Tic Tac Toe game. Players X and O take turns clicking cells on a 3x3 board. The game detects wins and draws automatically, keeps a running scoreboard across rounds, tracks winning streaks, and celebrates wins with a confetti animation.

## 2. Features

- **Turn tracking** — the status message always shows whose turn it is (Player X or Player O), styled in that player's color.
- **Win detection** — checks all 8 possible winning combinations (3 rows, 3 columns, 2 diagonals) after every move.
- **Draw detection** — if all 9 cells are filled with no winner, the game announces a draw.
- **Winning cell highlight** — the three winning cells glow and pulse when a player wins.
- **Confetti celebration** — a burst of animated confetti plays across the screen whenever someone wins.
- **Scoreboard** — persistent tally of wins for Player X, Player O, and draws, with a small "bump" animation when a score updates.
- **Win streak banner** — displays a "🔥 on a streak" message once a player wins 2+ rounds in a row.
- **New Round** — clears the board and starts a fresh round, alternating which player goes first each round.
- **Reset All** — clears the board, scores, and streaks back to zero.
- **Responsive design** — layout adapts to small screens (e.g., mobile), including stacked control buttons.

## 3. File Structure

```
├── index.html   # Page structure/markup: board, scoreboard, status, controls
├── style.css    # All visual styling, colors, animations, layout
└── script.js    # Game logic: state, rendering, win/draw detection, events
```

## 4. How to Run Locally

No installation or build step is required.

1. Download or clone the project files (`index.html`, `style.css`, `script.js`) into the same folder.
2. Double-click `index.html` to open it directly in your browser.

   *(Optional)* For the best experience, serve it with a simple local server instead of opening the file directly — for example, using the **Live Server** extension in VS Code, or by running:

   ```
   npx serve .
   ```

   then visiting the URL it prints.
3. Click any cell to place your mark and start playing.

## 5. Code Architecture Breakdown

The three files each handle one responsibility, and work together like this:

- **`index.html` (structure)** — Defines the static skeleton of the page: the title, the status text, the scoreboard cards (`#scoreX`, `#scoreO`, `#scoreDraw`), the streak banner (`#streak`), the 9 board cells (each a `<button class="cell">` with a `data-index` attribute from 0–8), and the two control buttons (`#newRoundBtn`, `#resetAllBtn`). It links to `style.css` for appearance and `script.js` for behavior.

- **`style.css` (presentation)** — Styles everything defined in the HTML: the gradient background, card/glassmorphism look, board grid layout, and colors for X (teal) and O (pink). It also defines the *animations* that JavaScript triggers by adding/removing CSS classes — such as `cell--win` (pulsing glow on winning cells), `bump` (scoreboard number pop), and the `confetti-piece` falling animation. CSS never decides *when* these happen; it only defines *what they look like* once JS applies the class.

- **`script.js` (behavior/logic)** — Runs an IIFE that:
  1. Grabs references to the DOM elements defined in `index.html`.
  2. Keeps game state in plain JS variables/objects: the `board` array (9 cells, each `null`, `'X'`, or `'O'`), `currentPlayer`, `gameActive`, and `scores`/`streak` objects.
  3. Listens for clicks on each cell (`handleCellClick`), which updates the `board` array, re-renders the cells, and checks `WIN_COMBOS` for a match.
  4. On a win: locks the board, updates the score and streak, adds the `cell--win` class to the winning cells, and calls `launchConfetti()` to inject animated confetti elements into the page.
  5. On a draw (board full, no winner): updates the draw score and shows a draw message.
  6. `newRoundBtn` calls `newRound()`, which resets the board but keeps scores/streaks, alternating who starts first. `resetAllBtn` calls `resetAll()`, which also zeroes out scores and streaks.

In short: **HTML** provides the elements, **CSS** defines how those elements look and animate, and **JavaScript** owns the game state and decides when to update the DOM and toggle CSS classes in response to user clicks.

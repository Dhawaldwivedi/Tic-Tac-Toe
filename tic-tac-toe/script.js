(() => {
  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  const boardEl = document.getElementById('board');
  const cellEls = Array.from(boardEl.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const streakEl = document.getElementById('streak');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDrawEl = document.getElementById('scoreDraw');
  const newRoundBtn = document.getElementById('newRoundBtn');
  const resetAllBtn = document.getElementById('resetAllBtn');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let startingPlayer = 'X';

  const scores = { X: 0, O: 0, draws: 0 };
  const streak = { player: null, count: 0 };

  function render() {
    board.forEach((mark, i) => {
      const cell = cellEls[i];
      cell.innerHTML = '';
      cell.classList.remove('cell--x', 'cell--o', 'cell--win');
      cell.disabled = !!mark || !gameActive;

      if (mark) {
        const span = document.createElement('span');
        span.className = 'cell__mark';
        span.textContent = mark;
        cell.classList.add(mark === 'X' ? 'cell--x' : 'cell--o');
        cell.appendChild(span);
      }
    });
  }

  function setStatus(html, colorClass) {
    statusEl.innerHTML = html;
    void statusEl.offsetWidth;
  }

  function bump(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  function updateScoreboard() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDrawEl.textContent = scores.draws;
  }

  function updateStreakBanner() {
    if (streak.count >= 2) {
      streakEl.hidden = false;
      streakEl.textContent = `🔥 Player ${streak.player} is on a ${streak.count}-win streak!`;
    } else {
      streakEl.hidden = true;
      streakEl.textContent = '';
    }
  }

  function findWinningCombo() {
    return WIN_COMBOS.find(([a, b, c]) =>
      board[a] && board[a] === board[b] && board[a] === board[c]
    );
  }

  const CONFETTI_COLORS = ['#00f5d4', '#ff5d8f', '#ffd166', '#c77dff', '#ffffff'];

  function launchConfetti(count = 70) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 6 + Math.random() * 6;
      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
      if (Math.random() > 0.5) piece.style.borderRadius = '50%';
      piece.style.setProperty('--rotate', `${Math.random() * 360}deg`);
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
      piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      piece.style.animationDelay = `${Math.random() * 0.35}s`;
      container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 3800);
  }

  function handleCellClick(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    render();

    const combo = findWinningCombo();

    if (combo) {
      gameActive = false;
      combo.forEach(i => cellEls[i].classList.add('cell--win'));
      cellEls.forEach(c => (c.disabled = true));

      scores[currentPlayer] += 1;
      bump(currentPlayer === 'X' ? scoreXEl : scoreOEl);

      if (streak.player === currentPlayer) {
        streak.count += 1;
      } else {
        streak.player = currentPlayer;
        streak.count = 1;
      }

      const markClass = currentPlayer === 'X' ? 'mark-text--x' : 'mark-text--o';
      setStatus(`<span class="mark-text ${markClass}">Player ${currentPlayer}</span> wins! 🎉`);
      updateScoreboard();
      updateStreakBanner();
      launchConfetti();
      return;
    }

    if (board.every(Boolean)) {
      gameActive = false;
      scores.draws += 1;
      bump(scoreDrawEl);
      streak.player = null;
      streak.count = 0;
      setStatus("It's a draw!");
      updateScoreboard();
      updateStreakBanner();
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const markClass = currentPlayer === 'X' ? 'mark-text--x' : 'mark-text--o';
    setStatus(`<span class="mark-text ${markClass}">Player ${currentPlayer}</span>'s turn`);
  }

  function newRound() {
    board = Array(9).fill(null);
    gameActive = true;
    startingPlayer = startingPlayer === 'X' ? 'O' : 'X';
    currentPlayer = startingPlayer;
    render();
    const markClass = currentPlayer === 'X' ? 'mark-text--x' : 'mark-text--o';
    setStatus(`<span class="mark-text ${markClass}">Player ${currentPlayer}</span>'s turn`);
  }

  function resetAll() {
    scores.X = 0;
    scores.O = 0;
    scores.draws = 0;
    streak.player = null;
    streak.count = 0;
    startingPlayer = 'X';
    updateScoreboard();
    updateStreakBanner();
    newRound();
  }

  cellEls.forEach(cell => cell.addEventListener('click', handleCellClick));
  newRoundBtn.addEventListener('click', newRound);
  resetAllBtn.addEventListener('click', resetAll);

  render();
  updateScoreboard();
  updateStreakBanner();
})();

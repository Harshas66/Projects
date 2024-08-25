const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const newGameButton = document.getElementById('newGameButton');
const restartButton = document.getElementById('restartButton');
const turnIndicator = document.getElementById('turnIndicator');
const gameModeSelect = document.getElementById('gameMode');
const aiDifficultySelect = document.getElementById('aiDifficulty');
const aiControls = document.getElementById('aiControls');

let circleTurn;
let isAI = false;

startGame();

newGameButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
gameModeSelect.addEventListener('change', (e) => {
    isAI = e.target.value === 'ai';
    aiControls.classList.toggle('hidden', !isAI);
    startGame();
});
aiDifficultySelect.addEventListener('change', () => {
    // Adjust AI difficulty if needed
});

function startGame() {
    circleTurn = false;
    turnIndicator.textContent = "Player X's Turn";
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.innerHTML = ''; // Clear the cell content
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    if (isAI && circleTurn) {
        aiMove();
    }
}

function restartGame() {
    startGame();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (isAI && circleTurn) {
            aiMove();
        }
    }
}

function endGame(draw) {
    if (draw) {
        alert('Draw!');
    } else {
        alert(`${circleTurn ? "O's" : "X's"} Wins!`);
    }
    startGame();
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerHTML = currentClass === X_CLASS ? 'X' : 'O'; // Add the symbol to the cell
}

function swapTurns() {
    circleTurn = !circleTurn;
    turnIndicator.textContent = circleTurn ? "Player O's Turn" : "Player X's Turn";
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function aiMove() {
    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    const difficulty = aiDifficultySelect.value;
    let move;

    switch (difficulty) {
        case 'easy':
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
            break;
        case 'medium':
        case 'hard':
            move = getBestMove(availableCells, 0);
            break;
    }

    setTimeout(() => {
        placeMark(move, CIRCLE_CLASS);
        if (checkWin(CIRCLE_CLASS)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }, 500); // Simulate AI thinking time
}

function getBestMove(availableCells, depth) {
    let bestMove = null;
    let bestScore = -Infinity;

    for (const cell of availableCells) {
        const index = [...cellElements].indexOf(cell);
        cell.classList.add(CIRCLE_CLASS);
        const score = minimax(depth, false);
        cell.classList.remove(CIRCLE_CLASS);

        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }

    return bestMove;
}

function minimax(depth, isMaximizing) {
    if (checkWin(CIRCLE_CLASS)) return 10 - depth;
    if (checkWin(X_CLASS)) return depth - 10;
    if (isDraw()) return 0;

    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    if (availableCells.length === 0) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const cell of availableCells) {
        const index = [...cellElements].indexOf(cell);
        cell.classList.add(isMaximizing ? CIRCLE_CLASS : X_CLASS);
        const score = minimax(depth + 1, !isMaximizing);
        cell.classList.remove(isMaximizing ? CIRCLE_CLASS : X_CLASS);

        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }

    return bestScore;
}

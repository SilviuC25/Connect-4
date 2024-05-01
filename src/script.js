let boardContainer = document.getElementById("board-container");
let gameResult = document.getElementById("game-result");
let startGameBtn = document.getElementById("start-game-btn");
let restartGameBtn = document.getElementById("restart-game-btn");
let playerTurn = document.getElementById("player-turn");
let currentPlayer;
let gameOver;
let firstPlayerName;
let secondPlayerName;
let board;

function startGame() {
    gameOver = false;
    currentPlayer = "Red";

    firstPlayerName = document.getElementById("first-player").value;
    secondPlayerName = document.getElementById("second-player").value;

    let alertMessageFirst = document.getElementById("alert-message-first");
    let alertMessageSecond = document.getElementById("alert-message-second");

    if (!firstPlayerName || !secondPlayerName) {
        alertMessageFirst.classList.remove("d-none");
        return;
    } else if (firstPlayerName === secondPlayerName) {
        alertMessageSecond.classList.remove("d-none");
        return;
    } else {
        alertMessageFirst.classList.add("d-none");
        alertMessageSecond.classList.add("d-none");
    }

    startGameBtn.classList.add("d-none");
    restartGameBtn.classList.remove("d-none");
    boardContainer.classList.remove("d-none");

    displayPlayerTurn();
    displayBoard();
    setupButtonListeners();
}

function dropPiece(col) {
    for (let rowIndex = NUM_ROWS - 1; rowIndex >= 0; --rowIndex) {
        let button = document.querySelector(`[data-row="${rowIndex}"][data-col="${col}"]`);
        if (!button.classList.contains("btn-danger") && !button.classList.contains("btn-warning")) {
            button.classList.remove("btn-light");
            if (currentPlayer == "Red") {
                button.classList.add("btn-danger");
            } else {
                button.classList.add("btn-warning");
            }
            button.disabled = true;
            return rowIndex;
        }
    }
    return -1; // If the column is full, return -1
}

function checkWinner(row, col) {
    return (
        checkLine(row, col, 1, 0) || // Check horizontal
        checkLine(row, col, 0, 1) || // Check vertical
        checkLine(row, col, 1, 1) || // Check diagonal /
        checkLine(row, col, -1, 1)   // Check diagonal \
    );
}


const WINNING_COUNT = 4;

function checkLine(row, col, rowIncrement, colIncrement) {
    let color;
    if (currentPlayer === "Red") {
        color = "btn-danger";
    } else {
        color = "btn-warning";
    }
    let count = 0;
    for (let i = -WINNING_COUNT + 1; i < WINNING_COUNT; ++i) {
        let newRow = row + i * rowIncrement;
        let newCol = col + i * colIncrement;
        if (newRow >= 0 && newRow < NUM_ROWS && newCol >= 0 && newCol < NUM_COLUMNS) {
            let button = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
            if (button && button.classList.contains(color)) {
                ++count;
                if (count >= WINNING_COUNT) { // Check if there are at least 4 consecutive cells of the same color
                    return true;
                }
            } else {
                count = 0; // Reset count only if the cell is not of the same color
            }
        }
    }
    return false;
}

const NUM_ROWS = 6;
const NUM_COLUMNS = 7;

function displayBoard() {
    boardContainer.innerHTML = "";

    for (let row = 0; row < NUM_ROWS; ++row) {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        for (let col = 0; col < NUM_COLUMNS; ++col) {
            let cell = document.createElement("div");
            cell.classList.add("col", "text-center", "p-0");

            let button = document.createElement("button");
            let currentColumn = `col-${col}`;
            button.classList.add("btn", "btn-light", "rounded-circle", "p-0", "m-1", currentColumn);
            button.setAttribute("data-row", row);
            button.setAttribute("data-col", col);

            button.style.width = "50px";
            button.style.height = "50px";

            cell.appendChild(button);
            rowDiv.appendChild(cell);
        }
        boardContainer.appendChild(rowDiv);
    }
}

function displayPlayerTurn() {
    let playerName;
    if (currentPlayer === "Red") {
        playerName = firstPlayerName;
    } else {
        playerName = secondPlayerName;
    }
    playerTurn.textContent = `${playerName}'s Turn`;
}

function restartGame() {
    restartGameBtn.classList.add("d-none");
    displayBoard();
    currentPlayer = "Red";
    displayPlayerTurn();
    startGame();
    gameResult.classList.add("d-none");
}

function setupButtonListeners() {
    let buttons = document.querySelectorAll(".btn-light");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            if (!gameOver) {
                let col = parseInt(button.dataset.col);
                let row = dropPiece(col);
                if (row !== -1) {
                    if (checkWinner(row, col)) {
                        let winner;
                        if (currentPlayer === "Red") {
                            winner = firstPlayerName;
                        } else {
                            winner = secondPlayerName;
                        }
                        gameResult.textContent = `${winner} Wins!`;
                        gameResult.classList.remove("d-none");
                        gameOver = true;
                    } else {
                        if (currentPlayer === "Red") {
                            currentPlayer = "Yellow";
                        } else {
                            currentPlayer = "Red";
                        }
                        displayPlayerTurn();
                    }
                }
            }
        });
    });
}
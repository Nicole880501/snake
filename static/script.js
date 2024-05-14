// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreValue");
const highScoreElement = document.getElementById("highScoreValue");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const speedSelect = document.getElementById("speed");

const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let intervalId;
let gameSpeed = parseInt(speedSelect.value);

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake() {
    snake.forEach(segment => drawCell(segment.x, segment.y, "green"));
}

function drawFood() {
    drawCell(food.x, food.y, "red");
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= GRID_SIZE ||
        snake[0].y < 0 ||
        snake[0].y >= GRID_SIZE ||
        snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y)
    ) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(intervalId);
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
    }
    alert("Game Over! Your score: " + score);
    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    drawGame();
    startBtn.disabled = false;
}

function drawGame() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawSnake();
    drawFood();
}

function startGame() {
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = parseInt(speedSelect.value);
    intervalId = setInterval(() => {
        moveSnake();
        drawGame();
        checkCollision();
    }, gameSpeed);
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case "ArrowDown":
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case "ArrowLeft":
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case "ArrowRight":
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

startBtn.addEventListener("click", () => {
    startGame();
    startBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    startBtn.disabled = false;
    gameOver();
});

speedSelect.addEventListener("change", () => {
    clearInterval(intervalId);
    startBtn.disabled = false;
    startGame();
});

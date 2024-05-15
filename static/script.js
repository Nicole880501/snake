const modeSelect = document.getElementById("mode");
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
const header = document.getElementById("header");

let snake1 = [{ x: 6, y: 6 }]; // 初始化第一条蛇的初始位置
let snake2 = [{ x: 10, y: 10 }]; // 初始化第二条蛇的初始位置
let dx1 = 0; // 初始化第一条蛇的水平移动方向
let dy1 = 0; // 初始化第一条蛇的垂直移动方向
let dx2 = 0; // 初始化第二条蛇的水平移动方向
let dy2 = 0; // 初始化第二条蛇的垂直移动方向
let food = { x: 18, y: 8 };
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

function drawSnake(id = 0) {
    // 单人模式
    if (id === 0)
        snake1.forEach(segment => drawCell(segment.x, segment.y, "green"));
    // 双人模式
    else if (id === 1) {
        snake1.forEach(segment => drawCell(segment.x, segment.y, "green"));
        snake2.forEach(segment => drawCell(segment.x, segment.y, "blue"));
    }
}

function drawFood() {
    drawCell(food.x, food.y, "red");
}

function moveSnake(id = 0) {
    if (id === 0) {
        const head = { x: snake1[0].x + dx1, y: snake1[0].y + dy1 };
        snake1.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById("scoreValue").textContent = score;
            generateFood();
        } else {
            snake1.pop();
        }
    } else if (id === 1) {
        const head1 = { x: snake1[0].x + dx1, y: snake1[0].y + dy1 };
        const head2 = { x: snake2[0].x + dx2, y: snake2[0].y + dy2 };
        snake1.unshift(head1);
        snake2.unshift(head2);
        if (head1.x === food.x && head1.y === food.y) {
            generateFood();
            snake2.pop();
        } else if (head2.x === food.x && head2.y === food.y) {
            generateFood();
            snake1.pop();
        } else {
            snake1.pop();
            snake2.pop();
        }
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
    if ((snake1.some(segment => segment.x === food.x && segment.y === food.y)) || (snake2.some(segment => segment.x === food.x && segment.y === food.y))) {
        generateFood();
    }
}

/**
 * 检查碰撞
 */
function checkCollision(id = 0) {
    if (id === 0) {
        if (
            // 第一条蛇碰到墙壁或自身
            snake1[0].x < 0 ||
            snake1[0].x >= GRID_SIZE ||
            snake1[0].y < 0 ||
            snake1[0].y >= GRID_SIZE ||
            snake1.slice(1).some(segment => segment.x === snake1[0].x && segment.y === snake1[0].y)) {
            gameOver(); // 游戏结束
        }
    } else if (id === 1) {
        if (
            // 第一条蛇碰到墙壁或自身
            snake1[0].x < 0 ||
            snake1[0].x >= GRID_SIZE ||
            snake1[0].y < 0 ||
            snake1[0].y >= GRID_SIZE ||
            snake1.slice(1).some(segment => segment.x === snake1[0].x && segment.y === snake1[0].y) ||
            // 第一条蛇碰到第二条蛇
            snake2.slice(1).some(segment => segment.x === snake1[0].x && segment.y === snake1[0].y)
        ) {
            gameOver(1); // 游戏结束
        }
        if (// 第二条蛇碰到墙壁或自身
            snake2[0].x < 0 ||
            snake2[0].x >= GRID_SIZE ||
            snake2[0].y < 0 ||
            snake2[0].y >= GRID_SIZE ||
            snake2.slice(1).some(segment => segment.x === snake2[0].x && segment.y === snake2[0].y) ||
            // 第二条蛇碰到第一条蛇
            snake1.slice(1).some(segment => segment.x === snake2[0].x && segment.y === snake2[0].y)
        ) {
            gameOver(2)
        }
    }
}

function gameOver(id = 0) {
    clearInterval(intervalId);
    if (id === 0) {
        if (score > highScore) {
            highScore = score;
            document.getElementById("highScoreValue").textContent = highScore;
        }
        alert("Game Over! Your score: " + score);
        score = 0;
        document.getElementById("scoreValue").textContent = score;
        snake1 = [{ x: 10, y: 10 }];
        dx1 = 0;
        dy1 = 0;
        drawGame();
        startBtn.disabled = false;
    } else if (id === 1) {
        document.getElementById("highScore").textContent = "上局胜方: 玩家2";
        alert("玩家2获胜！");
        snake1 = [{ x: 6, y: 6 }];
        dx1 = 0;
        dy1 = 0;
        snake2 = [{ x: 8, y: 8 }];
        dx2 = 0;
        dy2 = 0;
        drawGame(1);
        startBtn.disabled = false;
    } else if (id === 2) {
        document.getElementById("highScore").textContent = "上局胜方: 玩家1";
        alert("玩家1获胜！");
        snake1 = [{ x: 6, y: 6 }];
        dx1 = 0;
        dy1 = 0;
        snake2 = [{ x: 8, y: 8 }];
        dx2 = 0;
        dy2 = 0;
        drawGame(1);
        startBtn.disabled = false;
    }
}

function drawGame(id = 0) {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawSnake(id);
    drawFood();
}

// 初始化单人模式游戏
function initSinglePlayerGame() {
    snake1 = [{ x: 6, y: 6 }]; // 初始化蛇的初始位置
    dx1 = 0; // 初始化蛇的水平移动方向
    dy1 = 0; // 初始化蛇的垂直移动方向
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = parseInt(speedSelect.value);
    intervalId = setInterval(() => {
        moveSnake();
        drawGame();
        checkCollision();
    }, gameSpeed);
}

// 初始化双人模式游戏
function initMultiPlayerGame() {
    snake1 = [{ x: 6, y: 6 }]; // 初始化第一条蛇的初始位置
    snake2 = [{ x: 8, y: 8 }]; // 初始化第二条蛇的初始位置
    dx1 = 0; // 初始化第一条蛇的水平移动方向
    dy1 = 0; // 初始化第一条蛇的垂直移动方向
    dx2 = 0; // 初始化第二条蛇的水平移动方向
    dy2 = 0; // 初始化第二条蛇的垂直移动方向
    gameSpeed = parseInt(speedSelect.value);
    intervalId = setInterval(() => {
        moveSnake(1);
        drawGame(1);
        checkCollision(1);
    }, gameSpeed);
}

// 监听键盘事件，控制第一条蛇的移动方向
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (dy1 === 0) {
                dx1 = 0;
                dy1 = -1;
            }
            break;
        case "ArrowDown":
            if (dy1 === 0) {
                dx1 = 0;
                dy1 = 1;
            }
            break;
        case "ArrowLeft":
            if (dx1 === 0) {
                dx1 = -1;
                dy1 = 0;
            }
            break;
        case "ArrowRight":
            if (dx1 === 0) {
                dx1 = 1;
                dy1 = 0;
            }
            break;
    }
});

// 监听第二条蛇的键盘事件，控制第二条蛇的移动方向
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            if (dy2 === 0) {
                dx2 = 0;
                dy2 = -1;
            }
            break;
        case "s":
            if (dy2 === 0) {
                dx2 = 0;
                dy2 = 1;
            }
            break;
        case "a":
            if (dx2 === 0) {
                dx2 = -1;
                dy2 = 0;
            }
            break;
        case "d":
            if (dx2 === 0) {
                dx2 = 1;
                dy2 = 0;
            }
            break;
    }
});

startBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    if (modeSelect.value === "single") {
        initSinglePlayerGame();
    } else if (modeSelect.value === "multi") {
        initMultiPlayerGame();
    }
    startBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    startBtn.disabled = false;
    score = 0;
    document.getElementById("scoreValue").textContent = score;
    snake1 = [{ x: 6, y: 6 }];
    dx1 = 0;
    dy1 = 0;
    snake2 = [{ x: 8, y: 8 }];
    dx2 = 0;
    dy2 = 0;
    if (modeSelect.value === "single") {
        drawGame(0);
    } else if (modeSelect.value === "multi") {
        drawGame(1);
    }
});

speedSelect.addEventListener("change", () => {
    clearInterval(intervalId);
    startBtn.disabled = false;
    score = 0;
    snake1 = [{ x: 6, y: 6 }];
    dx1 = 0;
    dy1 = 0;
    snake2 = [{ x: 8, y: 8 }];
    dx2 = 0;
    dy2 = 0;
    if (modeSelect.value === "single") {
        document.getElementById("scoreValue").textContent = score;
        drawGame(0);
    } else if (modeSelect.value === "multi") {
        drawGame(1);
    }
});

// 监听模式选择器改变事件
modeSelect.addEventListener("change", () => {
    clearInterval(intervalId); // 清除游戏定时器
    startBtn.disabled = false; // 启用开始按钮
    score = 0;
    scoreElement.textContent = score;
    snake1 = [{ x: 6, y: 6 }];
    dx1 = 0;
    dy1 = 0;
    snake2 = [{ x: 8, y: 8 }];
    dx2 = 0;
    dy2 = 0;

    // 根据选择的模式重新开始游戏
    if (modeSelect.value === "single") {
        const scoreDiv = document.createElement("div");
        scoreDiv.id = "score";
        // 创建<span>元素
        const scoreSpan = document.createElement("span");
        scoreSpan.id = "scoreValue";
        scoreSpan.textContent = "0";
        // 将<span>添加到<div>中
        scoreDiv.appendChild(document.createTextNode("得分: "));
        scoreDiv.appendChild(scoreSpan);
        // 将新创建的元素添加到文档中的某个容器中
        header.appendChild(scoreDiv);
        document.getElementById("highScore").textContent = "最高得分: "
        const scoreSpan_ = document.createElement("span");
        scoreSpan_.id = "highScoreValue";
        // 注意这应该恢复最高得分
        scoreSpan_.textContent = highScore;
        document.getElementById("highScore").appendChild(scoreSpan_);
        drawGame();
    } else if (modeSelect.value === "multi") {
        document.getElementById("score").remove();
        document.getElementById("highScore").textContent = "上局胜方: ";
        drawGame(1);
    }
});

// 默认是单人模式绘制游戏
drawGame();
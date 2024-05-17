const modeSelect = document.getElementById("mode");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const scoreValueElement = document.getElementById("scoreValue");
const highScoreElement = document.getElementById("highScoreValue");
const highScoreTextElement = document.getElementById("highScoreText");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const speedSelect = document.getElementById("speed");
const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE;
const header = document.getElementById("header");
const eatMusic = document.getElementById('eatFood');
const overMusic = document.getElementById('gameOver');
const victoryMusic = document.getElementById('gameVictory');

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
let directionQueue1 = []; // 玩家一的方向缓冲区
let directionQueue2 = []; // 玩家二的方向缓冲区

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
        // 提取方向
        if (directionQueue1.length > 0) {
            const newDirection = directionQueue1.shift();
            dx1 = newDirection.dx;
            dy1 = newDirection.dy;
        }
        const head = { x: snake1[0].x + dx1, y: snake1[0].y + dy1 };
        snake1.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            eatMusic.play();
            score += 10;
            scoreValueElement.textContent = score;
            generateFood();
        } else {
            snake1.pop();
        }
    } else if (id === 1) {
        // 提取方向
        if (directionQueue1.length > 0) {
            const newDirection = directionQueue1.shift();
            dx1 = newDirection.dx;
            dy1 = newDirection.dy;
        }
        if (directionQueue2.length > 0) {
            const newDirection = directionQueue2.shift();
            dx2 = newDirection.dx;
            dy2 = newDirection.dy;
        }
        const head1 = { x: snake1[0].x + dx1, y: snake1[0].y + dy1 };
        const head2 = { x: snake2[0].x + dx2, y: snake2[0].y + dy2 };
        snake1.unshift(head1);
        snake2.unshift(head2);
        if (head1.x === food.x && head1.y === food.y) {
            eatMusic.play();
            generateFood();
            snake2.pop();
        } else if (head2.x === food.x && head2.y === food.y) {
            eatMusic.play();
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

function generateSnake() {
    snake1 = [{
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }];
    snake2 = [{
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }];
    if (snake1[0].x === snake2[0].x && snake1[0].y === snake2[0].y) {
        generateSnake();
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
    generateFood();
    if (id === 0) {
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            victoryMusic.play();
            alert("恭喜您打破纪录✨✨✨\n您的得分是：" + score);
        }
        else {
            overMusic.play();
            alert("游戏结束😫您的得分是：" + score);
        }
        generateSnake();
        dx1 = 0;
        dy1 = 0;
        drawGame();
        scoreValueElement.textContent = 0;
        startBtn.disabled = false;
    } else if (id === 1) {
        victoryMusic.play();
        highScoreElement.textContent = "玩家2️⃣"
        setTimeout(() => {
            alert("恭喜玩家2️获胜🎉🎉🎉");
        }, 100);  // 100ms 延迟，确保音乐播放开始
        generateSnake();
        dx1 = 0;
        dy1 = 0;
        dx2 = 0;
        dy2 = 0;
        drawGame(1);
        startBtn.disabled = false;
    } else if (id === 2) {
        victoryMusic.play();
        highScoreElement.textContent = "玩家1️⃣"
        alert("恭喜玩家1获胜🎉🎉🎉");
        generateSnake();
        dx1 = 0;
        dy1 = 0;
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
    dx1 = 0; // 初始化蛇的水平移动方向
    dy1 = 0; // 初始化蛇的垂直移动方向
    score = 0;
    scoreValueElement.textContent = score;
    gameSpeed = parseInt(speedSelect.value);
    intervalId = setInterval(() => {
        moveSnake();
        drawGame();
        checkCollision();
    }, gameSpeed);
}

// 初始化双人模式游戏
function initMultiPlayerGame() {
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

// 监听第一条蛇的键盘事件，控制第一条蛇的移动方向
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (directionQueue1.length === 0 && dy1 === 0) {
                directionQueue1.push({ dx: 0, dy: -1 });
            } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dy === 0) {
                directionQueue1.push({ dx: 0, dy: -1 });
            }
            break;
        case "ArrowDown":
            if (directionQueue1.length === 0 && dy1 === 0) {
                directionQueue1.push({ dx: 0, dy: 1 });
            } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dy === 0) {
                directionQueue1.push({ dx: 0, dy: 1 });
            }
            break;
        case "ArrowLeft":
            if (directionQueue1.length === 0 && dx1 === 0) {
                directionQueue1.push({ dx: -1, dy: 0 });
            } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dx === 0) {
                directionQueue1.push({ dx: -1, dy: 0 });
            }
            break;
        case "ArrowRight":
            if (directionQueue1.length === 0 && dx1 === 0) {
                directionQueue1.push({ dx: 1, dy: 0 });
            } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dx === 0) {
                directionQueue1.push({ dx: 1, dy: 0 });
            }
            break;
    }
});

// 监听第二条蛇的键盘事件，控制第二条蛇的移动方向
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
        case "W":
            if (directionQueue2.length === 0 && dy2 === 0) {
                directionQueue2.push({ dx: 0, dy: -1 });
            } else if (directionQueue2.length > 0 && directionQueue2[directionQueue2.length - 1].dy === 0) {
                directionQueue2.push({ dx: 0, dy: -1 });
            }
            break;
        case "s":
        case "S":
            if (directionQueue2.length === 0 && dy2 === 0) {
                directionQueue2.push({ dx: 0, dy: 1 });
            } else if (directionQueue2.length > 0 && directionQueue2[directionQueue2.length - 1].dy === 0) {
                directionQueue2.push({ dx: 0, dy: 1 });
            }
            break;
        case "a":
        case "A":
            if (directionQueue2.length === 0 && dx2 === 0) {
                directionQueue2.push({ dx: -1, dy: 0 });
            } else if (directionQueue2.length > 0 && directionQueue2[directionQueue2.length - 1].dx === 0) {
                directionQueue2.push({ dx: -1, dy: 0 });
            }
            break;
        case "d":
        case "D":
            if (directionQueue2.length === 0 && dx2 === 0) {
                directionQueue2.push({ dx: 1, dy: 0 });
            } else if (directionQueue2.length > 0 && directionQueue2[directionQueue2.length - 1].dx === 0) {
                directionQueue2.push({ dx: 1, dy: 0 });
            }
            break;
    }
});

startBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    // 清空方向，防止按下按钮直接移动
    directionQueue1.length = 0;
    directionQueue2.length = 0;
    if (modeSelect.value === "single") {
        score = 0;
        initSinglePlayerGame();
    } else if (modeSelect.value === "multi") {
        initMultiPlayerGame();
    }
    startBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    generateFood();
    startBtn.disabled = false;
    score = 0;
    if (modeSelect.value === "single")
        scoreValueElement.textContent = score;
    generateSnake();
    dx1 = 0;
    dy1 = 0;
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
    generateSnake();
    dx1 = 0;
    dy1 = 0;
    dx2 = 0;
    dy2 = 0;
    if (modeSelect.value === "single") {
        scoreValueElement.textContent = score;
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
    scoreValueElement.textContent = score;
    generateSnake();
    dx1 = 0;
    dy1 = 0;
    dx2 = 0;
    dy2 = 0;

    // 根据选择的模式重新开始游戏
    if (modeSelect.value === "single") {
        // 恢复得分显示
        scoreElement.style.display = '';
        // 隐藏玩家二按钮
        document.getElementById('direction-buttons-2').style.display = 'none';
        // 恢复最高得分文本
        document.getElementById("highScoreText").textContent = "最高得分🤠: ";
        // 恢复最高得分数值
        highScoreElement.textContent = highScore;
        drawGame();
    } else if (modeSelect.value === "multi") {
        // 恢复玩家二按钮
        document.getElementById('direction-buttons-2').style.display = '';
        // 隐藏得分显示
        scoreElement.style.display = 'none';
        // 修改最高得分文本
        highScoreTextElement.textContent = "上局胜方😀: ";
        // 修改最高得分数值
        highScoreElement.textContent = '';
        drawGame(1);
    }
});

// 默认是单人模式绘制游戏
generateSnake();
drawGame();
document.getElementById('direction-buttons-2').style.display = 'none';
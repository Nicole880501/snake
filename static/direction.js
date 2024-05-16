// 上按钮
document.getElementById('upBtn').addEventListener('click', () => {
    if (directionQueue1.length === 0 && dy1 === 0) {
        directionQueue1.push({ dx: 0, dy: -1 });
    } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dy === 0) {
        directionQueue1.push({ dx: 0, dy: -1 });
    }
});

// 下按钮
document.getElementById('downBtn').addEventListener('click', () => {
    if (directionQueue1.length === 0 && dy1 === 0) {
        directionQueue1.push({ dx: 0, dy: 1 });
    } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dy === 0) {
        directionQueue1.push({ dx: 0, dy: 1 });
    }
});

// 左按钮
document.getElementById('leftBtn').addEventListener('click', () => {
    if (directionQueue1.length === 0 && dx1 === 0) {
        directionQueue1.push({ dx: -1, dy: 0 });
    } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dx === 0) {
        directionQueue1.push({ dx: -1, dy: 0 });
    }
});

// 右按钮
document.getElementById('rightBtn').addEventListener('click', () => {
    if (directionQueue1.length === 0 && dx1 === 0) {
        directionQueue1.push({ dx: 1, dy: 0 });
    } else if (directionQueue1.length > 0 && directionQueue1[directionQueue1.length - 1].dx === 0) {
        directionQueue1.push({ dx: 1, dy: 0 });
    }
});

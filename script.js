const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const up = document.getElementById('up');
const down = document.getElementById('down');
const left = document.getElementById('left');
const right = document.getElementById('right');
const pauseBtn = document.getElementById('pauseBtn');

let gridsize = 25;
let snake = [{ x: 10, y: 10 }];
let food = {};
let score = 0;
let dx = 0;
let dy = 0;
let gameSpeed = 200;
let gameInterval;
let isPaused = false;

function startGame(){
    createFood();
    document.addEventListener('keydown', changeDirection);
    up.addEventListener('click', () => {
        if (dy !== 1) { dx = 0; dy = -1; }
    });
    down.addEventListener('click', () => {
        if (dy !== -1) { dx = 0; dy = 1; }
    });
    left.addEventListener('click', () => {
        if (dx !== 1) { dx = -1; dy = 0; }
    });
    right.addEventListener('click', () => {
        if (dx !== -1) { dx = 1; dy = 0; }
    });
    pauseBtn.addEventListener('click', paused)

    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    if(isPaused) return drawPauseOverlay();
    // logika pergerakan 
    moveSnake();
    if(checkGameOver()) return;
    //render
    clearCanvas();
    drawFood();
    drawSnake();
}
function clearCanvas(){
    context.fillStyle = '#EEE';
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake(){
    context.fillStyle = '#292'
    snake.forEach(part => {
        context.fillRect(part.x * gridsize, part.y * gridsize, gridsize, gridsize);
    });
}
function drawFood(){
    context.fillStyle = '#800';
    context.fillRect(food.x * gridsize, food.y * gridsize, gridsize, gridsize);
}
function moveSnake(){
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event){
    const key = event.key.toLowerCase();
    // pause
    if (key === 'p' || key === 'escape') return paused();
    if (isPaused) return; // ular ga ganti arah saat di-pause

    // panah atas atau w
    if ((key === 'arrowup' || key === 'w') && dy !== 1){
        dx = 0; dy = -1;
    }
    // panah atas atau s
    else if ((key === 'arrowdown' || key === 's') && dy !== -1){
        dx = 0; dy = 1;
    }
    // panah atas atau a
    else if ((key === 'arrowleft' || key === 'a') && dx !== 1){
        dx = -1; dy = 0;
    }
    // panah atas atau d
    else if ((key === 'arrowright' || key === 'd') && dx !== -1){
        dx = 1; dy = 0;
    }
}

function paused() {
    pauseBtn.innerText = (isPaused = !isPaused) ? "Resume" : "Pause";
}
function drawPauseOverlay() {
    clearCanvas();
    drawFood();
    drawSnake();

    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    Object.assign(context, {fillStyle: "white", font: "30px Arial", textAlign: "center"})
    context.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
}

function createFood(){
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridsize)),
        y: Math.floor(Math.random() * (canvas.height / gridsize)),
    };
    // makanan gak muncul di tubuh ular
    snake.forEach (part => {
        if(part.x === food.x && part.y === food.y) createFood();
    });
}
function checkGameOver(){
    //tabrak dinding
    if (snake[0].x < 0 || snake[0].x >= canvas.width / gridsize ||
        snake[0].y < 0 || snake[0].y >= canvas.height / gridsize) {
        gameOver();
        return true;
    }
    //tabrak diri
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver();
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    alert('Game Over! Skor Anda: ' + score);
    document.location.reload();
}

startGame()
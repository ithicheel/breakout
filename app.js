const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.querySelector(".high-score");
const audio = document.getElementById("audio");
const audio1 = document.getElementById("audio1");
const clr = "#1A5276"; 
canvas.height = 500; // талбайн өндөр 
canvas.width = 800; // талбайн өргөн

let ridhtPressed = false; // товч дарсан эсэх
let leftPressed = false; // товч дарсан эсэх
let gameType = true; // тоглоом эхлэх;
 
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// дахин эхлүүлэх хэсэг
function reset(e){ 
    score = 0;
    heart = 3;
    ball.dx = speed;
    ball.dy = -speed + 1;
    ball.x = canvas.width/2;
    ball.y = canvas.height - 50;
    generateBricks();
    gameType = true;
   // audio.play();
}

// товч дарахад 
function keyDownHandler(e){ 
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        ridhtPressed = true;
    }else if (e.key == 'left' || e.key == 'ArrowLeft'){
        leftPressed = true;
    }
    if(e.key == 'Enter'){
        reset();
    }
}
// товчоо дараад авахад
function keyUpHandler(e){ 
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        ridhtPressed = false;
    }else if (e.key == 'left' || e.key == 'ArrowLeft'){
        leftPressed = false;
    }
}
let score = 0;
let heart = 3;
// оноог дэлгэцэнд гаргах
function drawScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#230c33';
    ctx.fillText("Оноо: " + score, 8, 20);
}
// амь дэлгэцэнд гаргах
function drawHeartScore(){
    ctx.font = '16px Arial';
    ctx.fillStyle = '#230c33';
    ctx.fillText("Амь: " + heart, canvas.width-70, 20);
}
// тавцанг хөдөлгөх
let paddleSpeed = 10;
function movePaddle(){
    if(ridhtPressed){
        paddle.x += paddleSpeed;
        if(paddle.x + paddle.wigth >= canvas.width){
            paddle.x = canvas.width - paddle.wigth;
        }
    }else if(leftPressed){
        paddle.x -= paddleSpeed;
        if(paddle.x < 0){
            paddle.x = 0;
        }
    }
}
// бөмбөгний хэсэг
let speed = 3;
let ball = {
    x: canvas.width/2,
    y: canvas.height - 50,
    dx: speed,
    dy: -speed + 1,
    raduis: 7,
    draw: function(){
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.arc(this.x, this.y , this.raduis, 0,Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
};
// тавцангийн хэсэг
let paddle = {
    height: 10,
    wigth: 76,
    x: (canvas.width/2) - (76/2),
    draw: function(){
        ctx.beginPath();
        ctx.fillStyle = clr;
        ctx.rect(this.x, canvas.height - this.height, this.wigth, this.height);
        ctx.closePath();
        ctx.fill();
    },
};

// тоглоом эхлүүлэх хэсэг
function play(){
    // талбайг цэвэрлэх
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // бөмбөг зурах
    ball.draw();
    // тавцан зурах
    paddle.draw();
    // тоосго зурах
    drawBricks();
    // тавцанг хөдөлгөх
    movePaddle();
    // бөмбөг хөдөлгөх
    ballMove();
    // бөмбөг тавцанд хүрсэн бол буцаан ойлгох
    paddleCheck();
    // бөмбөг тавцанд хүрсэн бол буцаан ойлгох
    wallCheck();
    // тоосгонд бөмбөг хүрсэн бол устгах
    collisionDetection();
    // оноог дэлгэцэнд гаргах
    drawScore();
    // амь дэлгэцэнд гаргах
    drawHeartScore();
    // тоосго багасах тусам хурд нэмэгдэнэ
    levelUp();
    if(ball.y + ball.raduis > canvas.height){
        heart--;
    }
    if(heart <= 0){
        endGame(false);
    }else if(score >= brickRowCount*brickColumnCount){
        endGame(true);
    }
    if(score == 1){
        audio.play();
    }
    requestAnimationFrame(play);
}
// бөмбөг хөдөлгөх
function ballMove(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}
// тавцанд бөмбөг хүрсэн бол буцаан ойлгох
function paddleCheck(){
    if(ball.x >= paddle.x && 
        ball.x <= paddle.x + paddle.wigth && 
        ball.y + ball.raduis >= canvas.height - paddle.height){
            ball.dy *= -1;
        }
}
// хананд бөмбөг хүрсэн бол буцаан ойлгох
function wallCheck(){
    if(ball.x + ball.raduis > canvas.width || ball.x - ball.raduis < 0){
        ball.dx *= -1;
    }
    if(ball.y + ball.raduis > canvas.height || ball.y - ball.raduis < 0){
        ball.dy *= -1;
    }
}
// тоглоомыг дуусгах
function endGame(finish){
    if(finish){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#230c33';
        ctx.fillText("Winner winner chicken dinner", canvas.width/2-200, canvas.height/2);
        gameType = false;
    }else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#230c33';
        ctx.fillText("Дахин эхлэх бол 'ENTER' дарна уу", canvas.width/2-200, canvas.height/2-70);
        ctx.fillText("Lose :(", canvas.width/2-40, canvas.height/2);
        audio.pause();
        audio1.pause();
        gameType = false;
    }
}
let brickRowCount = 6;
let brickColumnCount = 10;
let brickWidth = 64;
let brickHeight = 10;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;
let bricks =[];

// тоосго
function generateBricks(){
    for(let c = 0; c<brickColumnCount; c++){
        bricks[c] = [];
        for(let r = 0; r<brickRowCount; r++){
            bricks[c][r] = {x:0, y:0, status:1};
        }
    }
}
// тоосго зурах
function drawBricks(){
    for(let c = 0; c<brickColumnCount; c++){
        for(let r = 0; r<brickRowCount; r++){
            if(bricks[c][r].status == 1){
                let brickX = c * [brickWidth+brickPadding] + brickOffsetLeft;
                let brickY = r * [brickHeight+brickPadding] + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = clr;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
// тоосгонд бөмбөг хүрсэн бол бөмбөгийг буцаан ойлгон тоосгыг устгах
function collisionDetection(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r< brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status == 1){
                if(ball.x >= b.x &&
                    ball.x <= b.x + brickWidth &&
                    ball.y >= b.y &&
                    ball.y <= b.y + brickHeight){
                        ball.dy *= -1;
                        b.status = 0;
                        score++
                        audio1.play();
                    }
            }
        }
    }
}
// бөмбөгний хурд нэмэх
let gameLevelUp = 10;
function levelUp(){
    if(gameLevelUp == score){
        ball.dx++;
        ball.dy--;
        paddleSpeed++;
        gameLevelUp += 10;
    }
}
// function soundPause(){
//     audio.pause();
// }
// function soundPlay(){
//     audio.play();
// }
generateBricks();
if(gameType){
    play();
}

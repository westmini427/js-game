let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// 이미지 및 게임 변수 초기화
let backgroundImage, spaceImage, bulletImage, enemyImage, gameoverImage;
let gameOver = false; // 게임 종료 여부 (true: 게임 종료, false: 게임 중)
let score = 0; // 플레이어 점수

// 우주선 초기 위치
let spaceImageX = canvas.width / 2 - 32;
let spaceImageY = canvas.height - 60;

let bulletlist = []; // 총알 배열

// Bullet 클래스 정의
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.x = spaceImageX + 19;
        this.y = spaceImageY;
        this.alive = true; // 총알 생존 여부 (true: 생존, false: 소멸)
        bulletlist.push(this);
    };
    this.update = function () {
        this.y -= 7; // 총알의 이동 속도
    };

    this.checkHit = function () {
        for (let i = 0; i < enemylist.length; i++) {
            if (this.y <= enemylist[i].y && this.x >= enemylist[i].x && this.x <= enemylist[i].x + 64) {
                // 총알이 적군과 충돌하면
                score++; // 점수 획득
                this.alive = false; // 총알 소멸
                enemylist.splice(i, 1); // 적군 제거
            }
        }
    };
}

// 랜덤 값을 생성하는 함수
function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNum;
}

let enemylist = []; // 적군 배열

// Enemy 클래스 정의
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function () {
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width - 64);
        enemylist.push(this);
    };
    this.update = function () {
        this.y += 2; // 적군의 이동 속도

        if (this.y >= canvas.height - 64) {
            // 적군이 화면 아래로 내려가면 게임 오버
            gameOver = true;
            console.log("게임 오버");
        }
    };
}

// 이미지 로드 함수
function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "images/background.gif";

    spaceImage = new Image();
    spaceImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameoverImage = new Image();
    gameoverImage.src = "images/gameover.jpg";
}

let keysDown = {};

// 키보드 이벤트 리스너 설정
function setupKeyboardListener() {
    document.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
        console.log("키 다운 이벤트:", keysDown);
    });

    document.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];

        if (event.keyCode == 32) {
            createBullet(); // 스페이스바를 누르면 총알 생성
        }
        console.log("키 업 이벤트:", keysDown);
    });
}

// 총알 생성 함수
function createBullet() {
    let b = new Bullet(); // 총알 생성
    b.init();
    console.log("총알 생성:", bulletlist);
}

// 적군 생성 함수
function createEnemy() {
    const interval = setInterval(function () {
        let e = new Enemy();
        e.init();
    }, 1000);
}

// 게임 상태 업데이트 함수
function update() {
    if (39 in keysDown) {
        spaceImageX += 5; // 오른쪽으로 이동
    }
    if (37 in keysDown) {
        spaceImageX -= 5; // 왼쪽으로 이동
    }

    // 우주선이 화면 경계를 벗어나지 않도록 처리
    if (spaceImageX <= 0) {
        spaceImageX = 0;
    }
    if (spaceImageX >= canvas.width - 60) {
        spaceImageX = canvas.width - 60;
    }

    // 총알 위치 업데이트 및 충돌 체크
    for (let i = 0; i < bulletlist.length; i++) {
        if (bulletlist[i].alive) {
            bulletlist[i].update();
            bulletlist[i].checkHit();
        }
    }

    // 적군 위치 업데이트
    for (let i = 0; i < enemylist.length; i++) {
        enemylist[i].update();
    }
}

// 게임 화면 그리기 함수
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceImage, spaceImageX, spaceImageY);
    ctx.fillText(`Score: ${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    for (let i = 0; i < bulletlist.length; i++) {
        if (bulletlist[i].alive) {
            ctx.drawImage(bulletImage, bulletlist[i].x, bulletlist[i].y);
        }
    }

    for (let i = 0; i < enemylist.length; i++) {
        ctx.drawImage(enemyImage, enemylist[i].x, enemylist[i].y);
    }
}

// 게임 메인 루프 함수
function main() {
    if (!gameOver) {
        update(); // 게임 상태 업데이트
        render(); // 게임 화면 그리기
        requestAnimationFrame(main); // 다음 프레임 요청
        console.log("애니메이션 호출: main 함수");
    } else {
        ctx.drawImage(gameoverImage, 10, 100, 380, 380);
    }
}

loadImage(); // 이미지 로드
setupKeyboardListener(); // 키보드 이벤트 리스너 설정
createEnemy(); // 적군 생성
main(); // 게임 루프 시작




// [ 메모장 ]

// 방향키를 누르면
// 우주선의 xy좌표가 바뀌고 
// (우주선이 오른쪽으로간다 : x좌표 값이 증가한다.) (우주선이 왼쪽으로 간다. : x좌표 값이 감소한다.)
// 다시 render 그려준다.

// 게임 안에는 총알이 여러개, 여러번 쓸 수 있음. 스페이스바를 누르면 위로 올라감 (y좌표 값이 감소한다.)
// 총알 저장소 배열 array 형태에 저장  b = [ ]
// 이 저장소를 render b
// 틀을 만들거임.. class bullet (x, y 좌표, 총알관련 함수)

// 1. 스페이스 바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 줄어듬, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render (그려준다)


// 적군만들기
// 귀엽다, x, y, init, update
// 1. 적군의 위치가 랜덤하다
// 2. 적군은 밑으로 내려온다 (y좌표가 증가한다)
// 3. 1초마다 하나씩 적군이 나온다.
// 4. 적군이 바닥에 닿으면 게임 오버
// 5. 적군과 총알이 만나면 적군이 사라진다.  (총알.y <= 적군.y and 총알.x >= 적군.x and 총알.x <= 적군.x + 64 -> 닿았다.) 점수는 1점씩 상승



let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;

document.body.appendChild(canvas);

let backgroundImage,spaceImage,bulletImage,enemyImage,gameoverImage; 

//우주선좌표
let spaceImageX = canvas.width/2-32;
let spaceImageY = canvas.height-60;

let bulletlist = []

function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceImageX + 19; 
        this.y = spaceImageY

        bulletlist.push(this);
    };
    this.update = function () {
        this.y -= 7;
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.gif";

    spaceImage = new Image();
    spaceImage.src = "images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"

    gameoverImage = new Image();
    gameoverImage.src = "images/gameover.jpg"
}


let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown", function (event){
        keysDown[event.keyCode] = true
        console.log("키다운 객체에 들어간 값은?", keysDown)
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];

        if(event.keyCode == 32) {
            createBullet() //총알생성
        }
        console.log("버튼 클릭 후 ", keysDown)
    });
} 

function createBullet() {
    console.log("총알 생성");
    let b = new Bullet(); //총알 하나 생성
    b.init();
    console.log("새로운 총알 리스트",bulletlist)
}


function update() {
    if(39 in keysDown) {
        spaceImageX += 5; //right
    }
    if(37 in keysDown) {
        spaceImageX -= 5; //left
    }
    // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?!
    if(spaceImageX <= 0) {
        spaceImageX=0
    }
    if(spaceImageX >= canvas.width-60) {
        spaceImageX=canvas.width-60;
    }

    // 총알의 y좌표 업데이트한 함수 호출
    for(let i = 0; i<bulletlist.length;i++){
        bulletlist[i].update()
    }
}


function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(spaceImage, spaceImageX, spaceImageY);

    for(let i = 0; i<bulletlist.length;i++){
        ctx.drawImage(bulletImage,bulletlist[i].x,bulletlist[i].y)
    }
}

function main(){
    update(); //좌표값을 업데이트하고
    render(); //그려주고
    requestAnimationFrame(main)
    console.log("animation calls main function")
}


loadImage()
setupKeyboardListener()
render()
main()


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
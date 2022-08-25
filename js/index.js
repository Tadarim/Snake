let snakeBody = []; /*初始化蛇关节的数组*/
let isPause = false; /*游戏是否暂停：未暂停*/
let snakeLength = 3; /*蛇的初始长度*/
let direct = "right"; /*蛇初始方向：向右*/
let speed = 200; /*初始移动速度*/
let timer, food;

// 初始化(
onload = () => {
    //初始化游戏面板和游戏分数显示区
    let map = document.querySelector("#map");
    //生成蛇
    createSnake();
    //生成食物
    createFood();
    //监听键盘
    keyListener();
};

// 生成蛇(){
function createSnake() {
    //循环蛇初始化长度次{
    for (let i = 0; i < snakeLength; i++) {
        //创造蛇的新关节，每个关节都是一个div
        let snake = document.createElement("div");

        if (i === 0) {
            snake.style.backgroundSize = "contain";
            snake.style.backgroundImage = 'url(./img/snake.png)';
        }
        //蛇的新关节推入数组
        snakeBody.push(snake);
        //蛇的新关节的左距离为上一个蛇关节左侧
        snake.style.left = (snakeLength - i - 1) * 30 + "px";
        //蛇的新关节展示在面板上
        map.appendChild(snake);
    }
}

// 生成食物
function createFood() {
    //判断是否有被吃掉的食物
    if (food) {
        //从地图上删除旧食物
        map.removeChild(food);
    }

    food = document.createElement('span');
    let x = 0, y = 0;
    randomXY();

    //随机坐标函数
    function randomXY() {
        x = parseInt("" + (Math.random() * (810 / 30))) * 30;
        y = parseInt("" + (Math.random() * (510 / 30))) * 30;
    }



    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i].offsetLeft === x) {
            if (snakeBody[i].offsetTop === y) {
                //随机坐标();
                randomXY();
                break;
            }
        }
    }

    food.style.left = x + 'px';
    food.style.top = y + 'px';

    map.appendChild(food);
}

// 键盘监听
function keyListener() {
    document.onkeydown = event => {
        let oEvent = event || window.event;
        // 防止180度掉头
        switch (oEvent.key) {
            case 'ArrowLeft':
                //     按了左键：当方向不为右，方向改为左
                if (direct !== "right") {
                    direct = "left";
                }
                break;
            case 'ArrowUp':
                //     按了上键：当方向不为下，方向改为上
                if (direct !== "down") {
                    direct = "up";
                }
                break;
            case 'ArrowRight':
                //     按了右键：当方向不为左，方向改为右
                if (direct !== "left") {
                    direct = "right";
                }
                break;
            case 'ArrowDown':
                //     按了下键：当方向不为上，方向改为下
                if (direct !== "up") {
                    direct = "down";
                }
                break;
            case ' ':
                //     按了空格键：暂停和开始游戏效果切换
                if (!isPause) {
                    pause();
                } else {
                    start();
                }
                isPause = !isPause;
                break;
        }
    }
}

// 蛇移动(){
function move() {
    //获取蛇头左距离和上距离
    let hLeft = snakeBody[0].offsetLeft;
    let hTop = snakeBody[0].offsetTop;
    //判断当前蛇的移动方向{
    switch (direct) {
        case "left":
            //if(对应方向上出界){
            if (hLeft <= 0) {
                // 游戏结束()
                gameover();
                return;
            }
            //蛇身移动()
            snakeBodyMove();
            //蛇头移动
            snakeBody[0].style.left = hLeft - 30 + "px";
            break;
        case "up":
            if (hTop <= 0) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeBody[0].style.top = hTop - 30 + "px";
            break;
        case "right":
            if (hLeft >= 810 - 30) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeBody[0].style.left = hLeft + 30 + "px";
            break;
        case "down":
            if (hTop >= 510 - 30) {
                gameover();
                return;
            }
            snakeBodyMove();
            snakeBody[0].style.top = hTop + 30 + "px";
            break;
    }

    //     蛇身移动(){
    function snakeBodyMove() {
        //         循环所有蛇身{
        for (let i = snakeBody.length - 1; i > 0; i--) {
            //             后面的关节横向顶替前面的关节
            snakeBody[i].style.left = snakeBody[i - 1].style.left;
            //             后面的关节纵向顶替前面的关节
            snakeBody[i].style.top = snakeBody[i - 1].style.top;
        }
    }


}

/*判断本次移动是否撞到自己*/
function isHit() {
    //遍历所有蛇身{
    for (let i = 1, j = snakeBody.length; i < j; i++) {
        //if(蛇头坐标与某个蛇身关节坐标冲突){
        if (snakeBody[0].offsetLeft === snakeBody[i].offsetLeft) {
            if (snakeBody[0].offsetTop === snakeBody[i].offsetTop) {
                //结束游戏()
                gameover();
                break;
            }
        }
    }
}


// 吃食物
function isEat() {
    //if(蛇头坐标和当前豆的坐标一致){
    if (snakeBody[0].offsetLeft === food.offsetLeft) {
        if (snakeBody[0].offsetTop === food.offsetTop) {
            //创建一个新的蛇关节
            let snake = document.createElement("div");
            //新蛇关节的出生坐标就是被吃掉食物的坐标
            snake.style.left = food.style.left;
            snake.style.top = food.style.top;
            //新蛇关节加入到蛇的数组中
            snakeBody.push(snake);
            //新蛇关节展示在游戏面板中
            map.appendChild(snake);
            //造食物
            createFood();
        }
    }
}

// 游戏结束(){
function gameover() {
    //清空定时器
    clearInterval(timer);
    //刷新页面
    location.reload();
    //提示游戏结束
    alert("game over!");
}


// 游戏暂停(){
function pause() {
    //清空定时器
    clearInterval(timer)
}


// 游戏重置(){
function reset() {
    //刷新页面
    location.reload();
}

// 游戏开始
function start() {
    // 清除旧定时器
    clearInterval(timer);
    //开启新定时器{
    timer = setInterval(() => {
        //蛇移动()
        move();
        //撞自己()：判断本次移动蛇是否撞到自己
        isHit();
        //吃豆子()：判断本次移动蛇是否吃到豆子
        isEat();
    }, speed);
}

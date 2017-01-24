var canvas = document.querySelector("canvas");
var surface = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;

const SIZE=64;
var sceneRows = 0;
var sceneColumns = 0;
const PLAYERSPEED = 4;

//map array
var scene =[];

//map code
var scene1=[
    [1,0,1,0,0,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1],
    [0,0,0,1,1,1,0,0,0,0],
    [1,0,1,0,0,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],
];
//0=grass, 1=water
var grass = new Image();
grass.src = "../tiles/img/grass.png";
var water = new Image();
water.src = "../tiles/img/water.png";

var player = {x:canvas.width/2, y:canvas.height/2, img:new Image()}; //player object(start location + image object)
player.img.src = "../img/objects/player/player.png";

//game
loadScene(scene1);

var game = setInterval(update, 33.34);

function update()
{
    checkInput();
    //moveTiles();
    //checkCollision();
    render();
}

//inputs
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var lDir = 1;
var rDir = 1;

function onKeyDown(event)
{
    switch(event.keyCode)
    {
        case 37: // left
        case 65: // a
            if (leftPressed == false)
                leftPressed = true;
            break;
        case 39: // right
        case 68: // d
            if (rightPressed == false)
                rightPressed = true;
            break;
        case 38: // up
        case 87: // w
            if (upPressed == false)
                upPressed = true;
            break;
        case 40: // down
        case 83: // s
            if (downPressed == false)
                downPressed = true;
            break
    }
}

function onKeyUp(event)
{
    switch(event.keyCode)
    {
        case 37: // left
        case 65: // a
            leftPressed = false; break;
        case 39: // right
        case 68: // d
            rightPressed = false; break;
        case 38: // up
        case 87: // w
            upPressed = false; break;
        case 40: // down
        case 83: // s
            downPressed = false; break;
    }
}

function checkInput()
{
    if (leftPressed == true)
    {
        if (lDir == 1)
            lDir = -1;
    }
    else if (rightPressed == true)
    {
        if (lDir == -1)
            lDir = 1;
    }
    if (upPressed == true)
    {
        if (rDir == -1)
            rDir = 1;
    }
    else if (downPressed == true)
    {
        if (rDir == 1)
            rDir = -1;
    }
    if ((leftPressed == true && player.x > 0) || (rightPressed == true && player.x < canvas.width-64))
    {
        player.x = player.x + lDir*PLAYERSPEED;
    }
    if ((upPressed == true && player.y > 0) || (downPressed == true && player.y < canvas.height-64))
    {
        player.y = player.y + -rDir*PLAYERSPEED;
    }
}

function loadScene(_scene){
    sceneRows = _scene.length;
    sceneColumns = _scene[0].length;
    for(var row = 0; row < sceneRows; row++){

        scene[row]=[];
        for(var col = 0; col < sceneColumns; col++){

            var tile = {}; //temp tile object
            tile.x = col * SIZE;
            tile.y = row * SIZE;

            if(_scene[row][col] == 0){
                tile.img = grass;
                scene[row][col] = tile; //assigning temp tile object to each element of scene array
            }
            else if(_scene[row][col] == 1){
                tile.img = water;
                scene[row][col] = tile;
            }
            //surface.drawImage(scene[row][col].img, scene[row][col].x, scene[row][col].y)
        }
    }
}

function render()
{
    //clear canvas
    surface.clearRect(0,0,canvas.width,canvas.height);

    //render tiles
    for (var row = 0; row < sceneRows; row++)
        for (var col = 0; col < sceneColumns; col++){
            surface.drawImage(scene[row][col].img, scene[row][col].x, scene[row][col].y); //draw image property/object of each element
        }

    //render player
    surface.drawImage(player.img, player.x, player.y);
}

//move tiles
/*function moveTiles()
 {
 for (var row = 0; row < ROWS; row++)
 {
 for (var col = 0; col < COLS; col++)
 {
 scene[row][col].x -= SCROLLSPEED; //tile scrolling
 }
 }*/

/*function checkCollision() {

 for (var i = 0; i < obstacleArray.length; i++) {

 if (!( ship.y+44 > obstacleArray[i].y + 54 || ship.y +54 < obstacleArray[i].y +14      //Top>Bot || Bot<Top
 || ship.x+24 > obstacleArray[i].x + 54 || ship.x + 44 < obstacleArray[i].x+14 )) {     //Left>Right || Right<Left
 clearInterval(game);
 clearInterval(timer);
 window.alert("game over");
 }
 }
 }*/

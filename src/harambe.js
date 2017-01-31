var canvas = document.querySelector("canvas");
var surface = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;

const SIZE=32; //size of each tile
var sceneRows = 0;
var sceneColumns = 0;

//map array
var scene =[];

//obstacle array. stores impassable tile objects
var obstacleArray =[];

//map code
var scene1=[
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 7, 0, 0, 3, 3, 0, 1, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 6, 5, 0, 0, 0, 1],
    [1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 0, 5, 0, 6, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 3, 6, 0, 0, 0, 6, 6, 6, 0, 1],
    [1, 1, 1, 0, 0, 2, 2, 2, 0, 0, 3, 6, 4, 4, 4, 6, 6, 6, 0, 1],
    [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 6, 0, 0, 0, 0, 3, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 4, 0, 0, 6, 6, 6, 6, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 4, 0, 4, 0, 1, 1, 1, 0, 1],
    [1, 0, 3, 3, 3, 3, 0, 0, 4, 0, 0, 4, 4, 4, 0, 0, 2, 1, 1, 1],
    [1, 0, 3, 3, 3, 3, 0, 0, 0, 4, 0, 0, 6, 0, 0, 2, 2, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 6, 0, 0, 6, 0, 6, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 6, 5, 0, 0, 0, 1, 0, 2, 2, 0, 0, 8, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 8, 8, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
//0=grass, 1=water
var GRASS = new Image();
GRASS.src = "../img/tiles/grass.png";
var WATER = new Image();
WATER.src = "../img/tiles/water.png";
var FENCE = new Image();
FENCE.src ="../img/tiles/brick_ice.png";
var LAKE = new Image();
LAKE.src = "../img/tiles/bubble.png";
var CAGE = new Image();
CAGE.src = "../img/tiles/castle_jailbars.png";
var BUSH = new Image();
BUSH.src = "../img/tiles/castle_straw.png";
var WALL = new Image();
WALL.src = "../img/tiles/castle_dungeon_stone.png";
var START = new Image();
START.src = "../img/tiles/beds_bed_fancy.png";
var EXIT = new Image();
EXIT.src = "../img/tiles/beds_bed_top_bottom.png";


//player object
var player = {
    x:canvas.width/2, y:canvas.height/2, w:SIZE, h:SIZE, img:new Image(), playerSpeed: 4,
    left: null, right: null, top: null, bottom: null,   //bounding boxes for collision
    colL:false, colR:false, colT:false, colB:false};    //true when player collides
player.img.src = "../img/tiles/player.png";

//game
loadScene(scene1);

var game = setInterval(update, 33.34);

function update()
{
    checkInput();
    //moveTiles();
    checkCollision();
    render();
}

//inputs
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

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

function checkInput() {
    if (leftPressed == 1 && player.x > 0 && player.colL == false)
        player.x -= player.playerSpeed;
    if (rightPressed == 1 && player.x < canvas.width-SIZE && player.colR == false)
        player.x += player.playerSpeed;
    if (upPressed == 1 && player.y > 0 && player.colT == false)
        player.y -= player.playerSpeed;
    if (downPressed == 1 && player.y < canvas.height-SIZE && player.colB == false)
        player.y += player.playerSpeed;
    updatePlayerBounds();
}

//pass in the map code array into this function to load the scene
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
                tile.img = GRASS;
                scene[row][col] = tile; //assigning temp tile object to each element of scene array
            }
            else if(_scene[row][col] == 1){
                tile.img = WATER;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile); //pushing water tile object into obstacle array
            }
            else if(_scene[row][col] == 2){
                tile.img = FENCE;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 3){
                tile.img = LAKE;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 4){
                tile.img = CAGE;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 5){
                tile.img = BUSH;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 6){
                tile.img = WALL;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 7){
                tile.img = START;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
            else if(_scene[row][col] == 8){
                tile.img = EXIT;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }

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


function updatePlayerBounds()
{
    // Creating the 4 individual bounding boxes for the player
    player.left = {l:player.x, r:player.x+6, t:player.y+8, b:player.y+player.h-8 };
    player.right = {l:player.x+player.w-6, r:player.x+player.w, t:player.y+8, b:player.y+player.h-8 };
    player.top = {l:player.x+8, r:player.x+player.w-8, t:player.y, b:player.y+6};
    player.bottom = {l:player.x+8, r:player.x+player.w-8, t:player.y+player.h-6, b:player.y+player.h };
}

function checkCollision()
{
    //all 4 bounding boxes of player and the obstacles are checked
    player.colL = player.colR = player.colT = player.colB = false; //resetting collision flags to false each frame
    for (var i = 0; i < obstacleArray.length; i++)
    {
        if (!(player.left.l > obstacleArray[i].x+obstacleArray[i].w || //left of left bounding box of player > right of obstacle
            player.left.r < obstacleArray[i].x ||
            player.left.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.left.b < obstacleArray[i].y))
        {
            player.x = obstacleArray[i].x+obstacleArray[i].w; // This first line will bounce the player back to just touching the wall.
            player.colL = true; // Sets the respective collision flag to true.
        }
        if (!(player.right.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.right.r < obstacleArray[i].x ||
            player.right.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.right.b < obstacleArray[i].y))
        {
            player.x = obstacleArray[i].x-player.w;
            player.colR = true;
        }
        if (!(player.top.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.top.r < obstacleArray[i].x ||
            player.top.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.top.b < obstacleArray[i].y))
        {
            player.y = obstacleArray[i].y+obstacleArray[i].h;
            player.colT = true;
        }
        if (!(player.bottom.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.bottom.r < obstacleArray[i].x ||
            player.bottom.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.bottom.b < obstacleArray[i].y))
        {
            player.y = obstacleArray[i].y-player.h;
            player.colB = true;
        }
    }
}

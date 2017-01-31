var canvas = document.querySelector("canvas");
var surface = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;

const SIZE=64; //size of each tile
var sceneRows = 0;
var sceneColumns = 0;

//map array
var scene =[];

//obstacle array. stores impassable tile objects
var obstacleArray =[];

//map code
var scene1=[
    [1,0,1,0,0,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1],
    [0,0,0,1,1,0,0,0,0,0],
    [1,0,1,0,0,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],
];
//0=grass, 1=water
var grass = new Image();
grass.src = "img/grass.png";
var water = new Image();
water.src = "img/water.png";


//player object
var player = {
    x:canvas.width/2, y:canvas.height/2, w:64, h:64, img:new Image(), playerSpeed: 4,
    left: null, right: null, top: null, bottom: null,   //bounding boxes for collision
    colL:false, colR:false, colT:false, colB:false};    //true when player collides
player.img.src = "img/player.png";

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
    if (rightPressed == 1 && player.x < canvas.width-64 && player.colR == false)
        player.x += player.playerSpeed;
    if (upPressed == 1 && player.y > 0 && player.colT == false)
        player.y -= player.playerSpeed;
    if (downPressed == 1 && player.y < canvas.height-64 && player.colB == false)
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
                tile.img = grass;
                scene[row][col] = tile; //assigning temp tile object to each element of scene array
            }
            else if(_scene[row][col] == 1){
                tile.img = water;
                tile.w = 64;
                tile.h = 64;
                scene[row][col] = tile;
                obstacleArray.push(tile); //pushing water tile object into obstacle array
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
$(document).ready(function(){
  var hitBtn = $('button.damage'),
      reset = $('button.reset'),
      hBar = $('.health-bar'),
      bar = hBar.find('.bar'),
      hit = hBar.find('.hit');
  
  hitBtn.on("click", function(){
    var total = hBar.data('total'),
        value = hBar.data('value');
    
    if (value < 0) {
			log("you dead, reset");
      return;
    }
    // max damage is essentially quarter of max life
    var damage = Math.floor(Math.random()*total);
    // damage = 100;
    var newValue = value - damage;
    // calculate the percentage of the total width
    var barWidth = (newValue / total) * 100;
    var hitWidth = (damage / value) * 100 + "%";
    
    // show hit bar and set the width
    hit.css('width', hitWidth);
    hBar.data('value', newValue);
    
    setTimeout(function(){
      hit.css({'width': '0'});
      bar.css('width', barWidth + "%");
    }, 500);
    //bar.css('width', total - value);
    
    log(value, damage, hitWidth);
    
    if( value < 0){
      log("DEAD");
    }
  });
  
  reset.on('click', function(e){
    hBar.data('value', hBar.data('total'));
    
    hit.css({'width': '0'});
    
		bar.css('width', '100%');
		log("resetting health to 1000");
  });
});

function log(_total, _damage, _hitWidth){
  var log = $('.log');
  
  if(_damage !== undefined && _hitWidth !== undefined) {
	  log.append("<div>H:"+_total+" D:"+_damage+" W:"+_hitWidth+" = " + (_total - _damage) + "</div>");
  } else {
    log.append("<div>"+_total+"</div>");
  }
};


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

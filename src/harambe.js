
const SIZE=32; //size of each tile
var sceneRows = 0;
var sceneColumns = 0;

window.addEventListener("load", loadAssets);
var numAssets = 18;
var assetsLoaded = 0;

var states = [{enter: enterMenu, update: updateMenu, exit: exitMenu}, 	// Main menu state.
			{enter: enterGame, update: updateGame, exit: exitGame}, 	// Game state.
			{enter: enterHelp, update: updateHelp, exit: exitHelp}];	// Help state.
	
var buttons = [{img:"../img/menu/btnStart.png", imgO:"../img/menu/btnStartO.png", x:400, y:720, w:128, h:32, over:false, click:onStartClick}, // Start button
    {img:"../img/menu/btnHelp.png", imgO:"../img/menu/btnHelpO.png", x:100, y:720, w:128, h:32, over:false, click:onHelpClick}, // Help button
    {img:"../img/menu/btnExit.png", imgO:"../img/menu/btnExitO.png", x:520, y:750, w:128, h:32, over:false, click:onExitGameClick},
	{img:"../img/menu/bananas.png", imgO:"../img/menu/bananas2.png", x:6, y:779, w:54, h:13, over:false, click:onBananas},
	{img:"../img/menu/mojo.png", imgO:"../img/menu/mojo2.png", x:250, y:779, w:54, h:13, over:false, click:onMojo},
	{img:"../img/menu/btnExit.png", imgO:"../img/menu/btnExitO.png", x:448, y:720, w:128, h:32, over:false, click:onExitHelpClick},]; 

	
var menuBackground = new Image();
menuBackground.src = "../img/menu/menubackground.png";
var helpBackground = new Image();
helpBackground.src = "../img/menu/helpbackground.png";
	

var lastState = -1;
var currState = -1;




//Play the music for the game.
var sound = new Howl({
  src: ['../sound/music/zizibum.mp3'],
  autoplay: true,
  loop: true,
  volume: 0.07,
  mute: false,
});

var boolmutesound = false;

function muteSound()
{
	if (boolmutesound == true)
	{
		sound.mute(false);
		document.getElementById("mutesound").innerHTML = "Mute Sound";
		boolmutesound = false;
	}
	
	else if (boolmutesound == false)
	{
		sound.mute(true);
		document.getElementById("mutesound").innerHTML = "Unmute Sound";
		boolmutesound = true;
	}
	
}
//sound.play();
/*
var sound2 = new Howl({
  src: ['../sound/sounds/zizibum.ogg'],
  volume: 0.1,
});
//sound2.play();*/
//End playing the music for the game.

var activeBtns = [];

var updateIval;

//map array
var scene =[];

//obstacle array. stores impassable tile objects
var obstacleArray =[];

//animation scripts
function loadImage(e) {
        animate();
    }

    var shift = 0;
    var frameWidth = 32;
    var frameHeight = 32;
    var totalFrames = 16;
    var currentFrame = 0;

    function animate() {
               
    }


//player object
var player = {
    x:80, y:80, w:SIZE, h:SIZE, img:new Image(), playerSpeed: 4,
    left: null, right: null, top: null, bottom: null,   //bounding boxes for collision
	lastX:null, lastY:null, currX:null, currY:null,     // Enemy requirements
    colL:false, colR:false, colT:false, colB:false};    //true when player collides
player.img.src = "../img/tiles/player.png";
player.lastX = player.currX = player.x;
player.lastY = player.currY = player.y;

//torch object
var torch_sprite = {
    x:50,
    y:50,
};

var torch_sprite1 = {
    x:100,
    y:100,
};

var torch_sprite2 = {
    x:200,
    y:200,
};

var torch_sprite3 = {
    x:400,
    y:400,
};

var torch_sprite4 = {
    x:800,
    y:800,
};

var torch_sprite5 = {
    x:1600,
    y:1600,
};

var torch_sprite6 = {
    x:100,
    y:50,
};

var torch_sprite7 = {
    x:200,
    y:100,
};

var torch_sprite8 = {
    x:400,
    y:200,
};

var torch_sprite9 = {
    x:800,
    y:400,
};

var torch_sprite10 = {
    x:1600,
    y:800,
};

var torch_sprite11 = {
    x:1300,
    y:1600,
};



//GUI
var currentHealth= 30;

//inputs
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
canvas.addEventListener("mousemove", updateMouse);
canvas.addEventListener("click", onMouseClick);
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var mouse = {x:0, y:0};


function onKeyDown(event)
{
    switch(event.keyCode)
    {
        case 37: // left
        case 65: // a
            if (leftPressed == false)
			{
                leftPressed = true;
				leftPressedSound= true;
			}
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
		case 73:
			if (enemy.iStage == 0)
			{
				enemy.iStage = 1;
				break;
			}
		case 49:
		case 50:
		case 51: 
			if (enemy.iStage > -1 && eDialogIdx[enemy.iStage][event.keyCode-49] != undefined) 
			{
				enemy.iStage = eDialogIdx[enemy.iStage][event.keyCode-49]; 
				break;
			}
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
	{
        player.x -= player.playerSpeed;
		player.lastX = player.currX;
		player.currX = player.x;
	}
    if (rightPressed == 1 && player.x < canvas.width-SIZE && player.colR == false)
	{
        player.x += player.playerSpeed;
		player.lastX = player.currX;
		player.currX = player.x;
	}
    if (upPressed == 1 && player.y > 0 && player.colT == false)
	{
        player.y -= player.playerSpeed;
		player.lastX = player.currX;
		player.currX = player.x;
	}
    if (downPressed == 1 && player.y < canvas.height-SIZE && player.colB == false)
	{
        player.y += player.playerSpeed;
		player.lastX = player.currX;
		player.currX = player.x;
	}
    updatePlayerBounds();
}


function loadAssets(event)
{
    for (var i = 0; i < buttons.length; i++)
    {
        var tempBtn = new Image();
        tempBtn.src = buttons[i].img;
        tempBtn.addEventListener("load", onAssetLoad);
        buttons[i].img = tempBtn;
        var tempBtnO = new Image();
        tempBtnO.src = buttons[i].imgO;
        tempBtnO.addEventListener("load", onAssetLoad);
        buttons[i].imgO = tempBtnO;
    }
	for (var i = 0; i < tileImages.length; i++) //Enemies Code
	{
		tempTile = new Image();
		tempTile.src = tileImages[i];
		tempTile.addEventListener("load", onAssetLoad);
		tileImages[i] = tempTile;
	}
	for (var i = 0; i < enemies.length; i++) //Enemies Code
		enemies[i].img = tileImages[3];
}

function onAssetLoad(event)
{
    if (++assetsLoaded == numAssets)
        initGame();
}

function initGame()
{
    changeState(0);
	//Enemies Code
	for (var i = 0; i < enemies.length; i++) 
		calcDeltas(enemies[i]); // For enemy.
	
	loadScene(scene1);
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
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 9){
                tile.img = BOAT1;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 10){
                tile.img = BOAT2;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 11){
                tile.img = BOAT3;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 12){
                tile.img = BOAT4;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 13){
                tile.img = STORE;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                //obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 14){
                tile.img = RESPAWN;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }

        }
    }
}

function renderGame()
{
    //clear canvas
    surface.clearRect(0,0,canvas.width,canvas.height);

    //render tiles
    for (var row = 0; row < sceneRows; row++)
        for (var col = 0; col < sceneColumns; col++){
            surface.drawImage(scene[row][col].img, scene[row][col].x, scene[row][col].y); //draw image property/object of each element
        }
	//animation
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite.x, torch_sprite.y, frameWidth, frameHeight);  //coordinates of the torch
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite1.x, torch_sprite1.y, frameWidth, frameHeight);
						  
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite2.x, torch_sprite2.y, frameWidth, frameHeight);	

	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite3.x, torch_sprite3.y, frameWidth, frameHeight);  //coordinates of the torch
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite4.x, torch_sprite4.y, frameWidth, frameHeight);
						  
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite5.x, torch_sprite5.y, frameWidth, frameHeight);	

	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite6.x, torch_sprite.y, frameWidth, frameHeight);  //coordinates of the torch
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite7.x, torch_sprite1.y, frameWidth, frameHeight);
						  
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite8.x, torch_sprite2.y, frameWidth, frameHeight);	

	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite9.x, torch_sprite3.y, frameWidth, frameHeight);  //coordinates of the torch
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite10.x, torch_sprite4.y, frameWidth, frameHeight);
						  
	surface.drawImage(torch, 
						  0, shift, frameWidth, frameHeight,
						  torch_sprite11.x, torch_sprite5.y, frameWidth, frameHeight);						  
						  
        shift = currentFrame * (frameHeight);

        if (currentFrame == totalFrames) {
            shift = 0;
            currentFrame = 0;
        }

        currentFrame++;
		
		
		//AgentCode
		/*if (!isScrolling)
		{
		if (enemy.iStage > -1)
		{
		var sz = eDialog[enemy.iStage].length;
		surface.fillStyle = "#2B1B17";
		surface.globalAlpha = 0.66;
		surface.fillRect((enemy.x+enemy.w/2)-(5*eDialog[enemy.iStage][0].length)-5,enemy.y-(16*(sz+1)),(5*eDialog[enemy.iStage][0].length)*2+2,(16*sz)+7);	
		surface.globalAlpha = 1.0;
		surface.font = "16px Courier New";
		surface.fillStyle = "white";
		for (var i = 0; i < sz; i++)
		{
			surface.fillText(eDialog[enemy.iStage][i],(enemy.x+enemy.w/2)-(5*eDialog[enemy.iStage][0].length),enemy.y-(16*(sz-i)));	
		}
		}
		}
	_textLevel.innerHTML = "Dialog Level: "+enemy.iStage;
		*/
		//Enemies Code
		if (!isScrolling)
	{
		for (var i = 0; i < enemies.length; i++)
		{
			surface.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
			for (var j = 0; j < enemies[i].linecasts.length; j++)
				surface.drawImage(tileImages[5], enemies[i].linecasts[j].x, enemies[i].linecasts[j].y);
		}
		for (var i = 0; i < bullets.length; i++)
			surface.drawImage(bullets[i].img, bullets[i].x, bullets[i].y);
		
		
	
		
	}
	
	//Enemies Code End
	
	
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

//scrolling
var isScrolling = false;
var scrollSpeed=5;
var isScrollingUp = false;
var isScrollingRight = false;
var isScrollingDown = false;
var isScrollingLeft =false;

function scrollCheck(){
    if(player.y<90) {
        isScrollingUp = true;
        isScrolling = true;
    }
    if(player.x+SIZE>canvas.width-90) {
        isScrollingRight = true;
        isScrolling = true;
    }
    if(player.y+SIZE>canvas.height-90) {
        isScrollingDown = true;
        isScrolling = true;
    }
    if(player.x<90) {
        isScrollingLeft = true;
        isScrolling = true;
    }
}

function scrollLevel(){

    if (isScrollingUp == true){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].y += scrollSpeed;				
            }
        }
		torch_sprite.y += scrollSpeed;
		torch_sprite1.y += scrollSpeed;
		torch_sprite2.y += scrollSpeed;
		torch_sprite3.y += scrollSpeed;
		torch_sprite4.y += scrollSpeed;
		torch_sprite5.y += scrollSpeed;
		torch_sprite6.y += scrollSpeed;
		torch_sprite7.y += scrollSpeed;
		torch_sprite8.y += scrollSpeed;
		torch_sprite9.y += scrollSpeed;
		torch_sprite10.y += scrollSpeed;
		torch_sprite11.y += scrollSpeed;
        
        isScrollingUp = false;
    }

    if (isScrollingRight == true){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].x -= scrollSpeed;				
			}
        }	
		torch_sprite.x -= scrollSpeed;
		torch_sprite1.x -= scrollSpeed;	
		torch_sprite2.x -= scrollSpeed;	
		torch_sprite3.x -= scrollSpeed;
		torch_sprite4.x -= scrollSpeed;	
		torch_sprite5.x -= scrollSpeed;	
		torch_sprite6.x -= scrollSpeed;
		torch_sprite7.x -= scrollSpeed;	
		torch_sprite8.x -= scrollSpeed;	
		torch_sprite9.x -= scrollSpeed;
		torch_sprite10.x -= scrollSpeed;	
		torch_sprite11.x -= scrollSpeed;	
        isScrollingRight = false;
    }

    if (isScrollingDown == true){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].y -= scrollSpeed;						
            }
        }
				torch_sprite.y -= scrollSpeed;
				torch_sprite1.y -= scrollSpeed;
				torch_sprite2.y -= scrollSpeed;
				torch_sprite3.y -= scrollSpeed;
				torch_sprite4.y -= scrollSpeed;
				torch_sprite5.y -= scrollSpeed;
				torch_sprite6.y -= scrollSpeed;
				torch_sprite7.y -= scrollSpeed;
				torch_sprite8.y -= scrollSpeed;
				torch_sprite9.y -= scrollSpeed;
				torch_sprite10.y -= scrollSpeed;
				torch_sprite11.y -= scrollSpeed;
		        isScrollingDown = false;
    }

    if (isScrollingLeft == true){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].x += scrollSpeed;								
            }
        }		
		torch_sprite.x += scrollSpeed;
		torch_sprite1.x += scrollSpeed;
		torch_sprite2.x += scrollSpeed;
		torch_sprite3.x += scrollSpeed;
		torch_sprite4.x += scrollSpeed;
		torch_sprite5.x += scrollSpeed;
		torch_sprite6.x += scrollSpeed;
		torch_sprite7.x += scrollSpeed;
		torch_sprite8.x += scrollSpeed;
		torch_sprite9.x += scrollSpeed;
		torch_sprite10.x += scrollSpeed;
		torch_sprite11.x += scrollSpeed;
        isScrollingLeft = false;
    }
    isScrolling = false;
}

function changeState(stateToRun)
{
    if (stateToRun >= 0 && stateToRun < states.length)
    {
        if (currState >= 0)
        {
            clearInterval(updateIval);
            states[currState].exit();
        }
        lastState = currState;
        currState = stateToRun;
        states[currState].enter();
        updateIval = setInterval(states[currState].update, 33.34);
    }
    else
        console.log("Invalid stateToRun!");
}

function enterMenu()
{
    console.log("Entering menu state.");
	surface.clearRect(0,0,canvas.width,canvas.height);
    activeBtns = [ buttons[0],buttons[1]];
	//testmousover()
	
	
	
}

function updateMenu()
{
    console.log("In menu state.");
	surface.clearRect(0,0,canvas.width,canvas.height);
	checkButtons();
    surface.drawImage(menuBackground, 0, 0);
    renderButtons();	
}

function exitMenu()
{
    console.log("Exiting menu state.");
}

function enterGame()
{
    console.log("Entering game state.");
    activeBtns = [  buttons[2], buttons[3], buttons[4] ];
	
}

function updateGame()
{
    console.log("In game state.");
    if (isScrolling == true){
        scrollLevel();
    }
    checkButtons();
    checkInput();
    //moveTiles();
    checkCollision();
    renderGame();
    renderButtons();
    renderUI();
	
    scrollCheck();
	//Enemies Code
	for (var i = 0; i < enemies.length; i++)
			enemies[i].update(); // Added the enemy update.
	getBananaTextBox(); //Inventory Buttons
	getMojoTextBox(); //Inventory Buttons
}

function exitGame()
{
    console.log("Exiting game state.");

	player.x=canvas.width/2;
	player.y=canvas.height/2;
	scene = [];
	obstacleArray =[];
    loadScene(scene1);

}

function enterHelp()
{
    console.log("Entering help state.");
    surface.clearRect(0,0,canvas.width,canvas.height);
    activeBtns = [ buttons[5]];
}

function updateHelp()
{
    console.log("In help state.");
	surface.clearRect(0,0,canvas.width,canvas.height);
    checkButtons();
    surface.drawImage(helpBackground, 0, 0);
    renderButtons();
}

function exitHelp()
{
    console.log("Exiting help state.");
}

function checkButtons()
{
    for (var i = 0; i < activeBtns.length; i++)
    {
        activeBtns[i].over = false;
        if(!(mouse.x < activeBtns[i].x ||
            mouse.x > activeBtns[i].x+activeBtns[i].w ||
            mouse.y < activeBtns[i].y ||
            mouse.y > activeBtns[i].y+activeBtns[i].h))
        {
            activeBtns[i].over = true;
        }
    }
}

function onMouseClick()
{
    for (var i = 0; i < activeBtns.length; i++)
    {
        if (activeBtns[i].over == true)
        {
            activeBtns[i].click();
            break;
        }
    }
}

function renderButtons()
{
    document.body.style.cursor = "default";
    for (var i = 0; i < activeBtns.length; i++)
    {
        if (activeBtns[i].over == true)
        {
            surface.drawImage(activeBtns[i].imgO, activeBtns[i].x, activeBtns[i].y);
            document.body.style.cursor = "pointer";
        }
        else
            surface.drawImage(activeBtns[i].img, activeBtns[i].x, activeBtns[i].y);
    }
}

function onStartClick()
{
    changeState(1);
}

function onHelpClick()
{
    changeState(2);
}

function onExitGameClick()
{
        changeState(0);
}

function onExitHelpClick(){
	
	changeState(0);
}

function updateMouse(event)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}




//Jackson's code. This section is reserved for Jackson
// Health Bar
function renderUI(){
    drawHealthbar(surface, 10, 100, 300, 30, currentHealth, 100);
}

function drawHealthbar(canvas, x, y, width, height, _currentHealth, max_health) {
    if (_currentHealth >= max_health) {_currentHealth = max_health;}
    if (_currentHealth <= 0) {_currentHealth = 0;}
    canvas.fillStyle = "#000000";
    canvas.fillRect(x, y+640, width, height);
    var colorNumber = Math.round((1-(_currentHealth/max_health))*0xff)*0x10000 + Math.round((_currentHealth/max_health)*0xff)*0x100;
    var colorString = colorNumber.toString (16);
    if (colorNumber >= 0x100000){
        canvas.fillStyle = '#'+ colorString;
    }
    else if (colorNumber << 0x100000 && colorNumber >= 0x10000){
        canvas.fillStyle = '#0'+ colorString;
    }
    else if (colorNumber << 0x1000){
        canvas.fillStyle = '#00'+ colorString;
    }
    canvas.fillRect(x+1, y+1+640, (_currentHealth/max_health)*(width-2), height-2);
}


//Inventory Buttons
//var button = document.querySelector("button");
//button.addEventListener("click", clickHandler, false);

function clickHandler() {
    inventory[0] += 1;
	banana.message = inventory[0];
	inventory[1] += 1;
	mojo.message = inventory[0];
}
var textarea = document.querySelector("textarea");


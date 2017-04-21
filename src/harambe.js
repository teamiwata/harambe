const SIZE=32; //size of each tile
var sceneRows = 0;
var sceneColumns = 0;

window.addEventListener("load", loadAssets);
var numAssets = 19;
var assetsLoaded = 0;

var states = [{enter: enterMenu, update: updateMenu, exit: exitMenu}, 	// Main menu state.
			{enter: enterGame, update: updateGame, exit: exitGame}, 	// Game state.
			{enter: enterHelp, update: updateHelp, exit: exitHelp}];	// Help state.
	
var buttons = [{img:"../img/menu/btnStart.png", imgO:"../img/menu/btnStartO.png", x:400, y:720, w:128, h:32, over:false, click:onStartClick}, // Start button
    {img:"../img/menu/btnHelp.png", imgO:"../img/menu/btnHelpO.png", x:100, y:720, w:128, h:32, over:false, click:onHelpClick}, // Help button
    {img:"../img/menu/btnExit.png", imgO:"../img/menu/btnExitO.png", x:520, y:750, w:128, h:32, over:false, click:onExitGameClick},
	{img:"../img/menu/bananas.png", imgO:"../img/menu/bananas2.png", x:6, y:779, w:54, h:13, over:false, click:onBananas},
    {img:"../img/menu/shopbananas.png", imgO:"../img/menu/shopbananas2.png", x:106, y:779, w:54, h:13, over:false, click:shopBananas},// Placeholder until shop is done
	{img:"../img/menu/mojo.png", imgO:"../img/menu/mojo2.png", x:250, y:779, w:54, h:13, over:false, click:onMojo},
    {img:"../img/menu/shopmojo.png", imgO:"../img/menu/shopmojo2.png", x:350, y:779, w:54, h:13, over:false, click:shopMojo},
	{img:"../img/menu/btnExit.png", imgO:"../img/menu/btnExitO.png", x:448, y:720, w:128, h:32, over:false, click:onExitHelpClick},
    {img:"../img/menu/MuteM.png", imgO:"../img/menu/MuteM2.png", x:250, y:720, w:128, h:32, over:false, click:muteMusic},
    {img:"../img/menu/MuteS.png", imgO:"../img/menu/MuteS2.png", x:40, y:720, w:128, h:32, over:false, click:muteSound}]; // Button to Mute Music

var menuBackground = new Image();
menuBackground.src = "../img/menu/menubackground.png";
var helpBackground = new Image();
helpBackground.src = "../img/menu/helpbackground.png";
var activeBtns = [];
	

	

var lastState = -1;
var currState = -1;




var updateIval;



//obstacle array. stores impassable tile objects
var obstacleArray =[];




//player object
var player = {
    x:130, y:130, w:SIZE, h:SIZE, img:new Image(), playerSpeed: 4,
    left: null, right: null, top: null, bottom: null,   //bounding boxes for collision
	lastX:null, lastY:null, currX:null, currY:null,     // Enemy requirements
    colL:false, colR:false, colT:false, colB:false};    //true when player collides
player.img.src = "../img/tiles/player.png";
player.lastX = player.currX = player.x;
player.lastY = player.currY = player.y;




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
	renderAnimation();
		
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
			sound2.play();  //sound
        }
        if (!(player.right.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.right.r < obstacleArray[i].x ||
            player.right.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.right.b < obstacleArray[i].y))
        {
            player.x = obstacleArray[i].x-player.w;
            player.colR = true;
			sound2.play(); //sound
        }
        if (!(player.top.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.top.r < obstacleArray[i].x ||
            player.top.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.top.b < obstacleArray[i].y))
        {
            player.y = obstacleArray[i].y+obstacleArray[i].h;
            player.colT = true;
			sound2.play(); //sound
        }
        if (!(player.bottom.l > obstacleArray[i].x+obstacleArray[i].w ||
            player.bottom.r < obstacleArray[i].x ||
            player.bottom.t > obstacleArray[i].y+obstacleArray[i].h ||
            player.bottom.b < obstacleArray[i].y))
        {
            player.y = obstacleArray[i].y-player.h;
            player.colB = true;
			sound2.play(); //sound
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
		//animation
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
		//animation
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
				//animation
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
		//animation
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
    activeBtns = [  buttons[2], buttons[3], buttons[4], buttons[5], buttons[6] ];	
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
	player.x=130;
	player.y=130;
	scene = [];
	obstacleArray =[];
    loadScene(scene1);

}

function enterHelp()
{
    console.log("Entering help state.");
    surface.clearRect(0,0,canvas.width,canvas.height);
    activeBtns = [ buttons[7], buttons[8], buttons[9]];
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
	document.getElementById("textBox").style.display = "block";
	document.getElementById("close").style.display = "block";
	document.getElementById("Scoreboard").style.display = "block";
}

function onHelpClick()
{
    changeState(2);
}

function onExitGameClick()
{
        changeState(0);
		document.getElementById("Scoreboard").style.display = "none";
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


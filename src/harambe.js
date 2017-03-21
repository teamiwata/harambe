
const SIZE=32; //size of each tile
var sceneRows = 0;
var sceneColumns = 0;

window.addEventListener("load", loadAssets);
var numAssets = 6;
var assetsLoaded = 0;

var states = [{enter: enterMenu, update: updateMenu, exit: exitMenu}, 	// Main menu state.
			{enter: enterGame, update: updateGame, exit: exitGame}, 	// Game state.
			{enter: enterHelp, update: updateHelp, exit: exitHelp}];	// Help state.
	
var buttons = [{img:"../img/menu/btnStart.png", imgO:"../img/menu/btnStartO.png", x:320, y:320, w:128, h:32, over:false, click:onStartClick}, // Start button
    {img:"../img/menu/btnHelp.png", imgO:"../img/menu/btnHelpO.png", x:100, y:720, w:128, h:32, over:false, click:onHelpClick}, // Help button
    {img:"../img/menu/btnExit.png", imgO:"../img/menu/btnExitO.png", x:448, y:720, w:128, h:32, over:false, click:onExitClick},
	{img:"../img/menu/bananas.png", imgO:"../img/menu/bananas2.png", x:6, y:779, w:54, h:13, over:false, click:onBananas},
	{img:"../img/menu/mojo.png", imgO:"../img/menu/mojo2.png", x:250, y:779, w:54, h:13, over:false, click:onMojo}]; // Exit button

	
var menuBackground = new Image();
menuBackground.src = "../img/menu/menubackground.png";
var helpBackground = new Image();
helpBackground.src = "../img/menu/helpbackground.png";
	

var lastState = -1;
var currState = -1;

//Madalyn
//Play the music for the game.
var sound = new Howl({
  src: ['../sound/music/zizibum.mp3'],
  autoplay: true,
  loop: true,
  volume: 0.1,
});
//sound.play();
//End playing the music for the game.

var inventory = [2];
inventory[0] = 1;
inventory[1] = 1;
	
	//mike stuff
	//begin textbox
surface.font="18px Georgia";
var banana = {};
banana.message = inventory[0];
banana.x = 5;
banana.y = 790;

var mojo = {};
mojo.message = inventory[1];
mojo.x = 250;
mojo.y = 790;

function onBananas()
{
	if ( (inventory[0] > 0) && (currentHealth < 100))
	{
	currentHealth += 15;
	inventory[0] -= 1;
	banana.message = inventory[0];
	}
}
function onMojo()
{
	if ( (inventory[1] > 0) && (currentHealth < 100))
	{
	currentHealth += 50;
	inventory[1] -= 1;
	mojo.message = inventory[1];
	}
}

function getBananaTextBox()
{
	surface.fillText(banana.message,banana.x,banana.y);
}

function getMojoTextBox()
{
	surface.fillText(mojo.message,mojo.x,mojo.y);
}


//end mike stuff


var activeBtns = [];

var updateIval;

//map array
var scene =[];

//obstacle array. stores impassable tile objects
var obstacleArray =[];

//map code
var scene2=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,3,3,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,7,0,0,3,3,0,1,0,0,0,0,0,6,6,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,4,0,0,6,5,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,6,0,0,0,0,0,0,4,4,4,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,6,6,6,6,0,0,0,4,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,5,0,6,0,0,0,6,0,0,6,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,6,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2,0,0,0,3,6,0,0,0,6,6,6,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,2,2,2,0,0,3,6,4,4,4,6,6,6,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,6,0,0,0,0,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,6,0,6,6,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,0,0,6,6,6,6,0,0,4,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,6,0,0,4,0,4,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,3,3,3,0,0,4,0,0,4,4,4,0,0,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,3,3,3,0,0,0,4,0,0,6,0,0,2,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,6,0,0,6,0,6,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,6,5,0,0,0,1,0,2,2,0,0,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,8,8,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
	//new map, using this for now.
var scene1=[
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,6,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,6,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,6,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,6,0,0,0,2,0,0,0,0,7,0,0,0,3,0,0,0,0,0,3,0,0,9,0,0,3,0,0,0,0,7,0,0,0,1],
[1,0,0,6,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,6,0,0,0,2,0,0,0,7,7,7,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,7,7,7,7,0,0,1],
[1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,7,7,7,7,7,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,7,7,7,7,7,7,0,1],
[1,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,7,7,7,7,0,0,1],
[1,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,7,0,0,0,0,1],
[1,6,6,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0,0,3,0,8,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,1,1,1,1,0,0,0,0,0,6,6,6,6,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,1,0,0,0,0,0,6,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,3,3,3,3,3,0,0,0,0,0,1,0,0,1,0,0,6,0,0,0,0,0,0,3,3,3,3,3,2,3,3,3,3,3,0,0,0,0,7,7,7,7,7,7,7,7,7,7,7,0,0,0,0,3,3,3,3,3,1],
[1,0,0,0,0,3,0,0,0,0,0,1,0,0,1,0,0,6,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,7,7,7,7,7,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,1,1,1,1,0,0,0,0,0,6,6,6,6,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,8,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,6,6,6,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,6,6,6,6,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,7,7,0,0,0,1],
[1,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,7,7,7,7,0,0,1],
[1,0,0,0,6,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,6,0,0,0,2,0,7,7,7,7,7,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,7,7,7,7,0,0,1],
[1,0,0,0,6,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,6,0,0,0,2,0,0,7,7,7,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,7,7,0,0,0,1],
[1,0,0,0,6,0,9,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,6,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,2,2,2,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,0,4,4,4,4,4,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,4,4,4,4,0,0,1],
[1,0,5,5,5,5,5,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,5,5,5,5,5,0,0,0,0,4,4,4,4,4,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,4,4,4,4,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,0,4,4,4,4,4,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,4,4,4,4,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,5,0,0,0,0,0,0,4,4,4,4,4,0,3,0,0,0,0,0,3,0,9,0,0,0,3,0,0,4,4,4,4,0,0,1],
[1,0,0,0,5,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,2,0,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,3,0,0,0,3,3,3,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,8,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,5,0,0,5,0,0,0,5,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,4,4,4,0,0,4,4,4,0,0,4,4,4,0,0,3,0,0,0,0,1],
[1,3,3,3,3,3,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,3,3,3,3,3,2,3,3,3,3,3,0,0,0,0,4,4,4,0,0,4,4,4,0,0,4,4,4,0,0,3,3,3,3,3,1],
[1,0,0,0,0,3,0,0,0,0,0,5,0,0,5,0,0,0,5,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,4,4,4,0,0,4,4,4,0,0,4,4,4,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
[1,0,0,0,0,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,0,0,0,0,2,0,0,0,0,3,3,3,3,3,0,0,0,3,3,3,3,3,3,0,0,0,3,3,3,3,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,5,0,0,0,0,0,0,4,4,4,4,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,5,0,0,0,0,0,0,4,4,4,4,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,11,0,1],
[1,0,5,5,5,5,5,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,5,5,5,5,5,0,0,0,0,4,4,4,4,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,11,11,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,0,5,0,0,0,0,0,0,4,4,4,4,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,11,11,11,0,1],
[1,0,0,0,5,0,0,0,3,0,0,0,0,0,3,0,0,8,0,0,3,0,0,0,0,5,0,0,0,0,0,0,4,4,4,4,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,11,11,11,11,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

/*
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
*/
//0=grass, 1=water
var GRASS = new Image();
GRASS.src = "../img/tiles/grasstile.png";
var WATER = new Image();
WATER.src = "../img/tiles/watertile.png";
var FENCE = new Image();
FENCE.src ="../img/tiles/fencetile.png";
var LAKE = new Image();
LAKE.src = "../img/tiles/walltile.png";
var CAGE = new Image();
CAGE.src = "../img/tiles/castle_jailbars.png";
var BUSH = new Image();
BUSH.src = "../img/tiles/stonetile.png";
var WALL = new Image();
WALL.src = "../img/tiles/castle_dungeon_stone.png";
var START = new Image();
START.src = "../img/tiles/beds_bed_fancy.png";
var EXIT = new Image();
EXIT.src = "../img/tiles/beds_bed_top_bottom.png";

var torch = new Image();
torch.src = "../img/environment/torchA.png";


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
    x:canvas.width/2, y:canvas.height/2, w:SIZE, h:SIZE, img:new Image(), playerSpeed: 4,
    left: null, right: null, top: null, bottom: null,   //bounding boxes for collision
    colL:false, colR:false, colT:false, colB:false};    //true when player collides
player.img.src = "../img/tiles/player.png";

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
}

function onAssetLoad(event)
{
    if (++assetsLoaded == numAssets)
        initGame();
}

function initGame()
{
    changeState(0);
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
                tile.img = EXIT;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 10){
                tile.img = EXIT;
                tile.w = SIZE;
                tile.h = SIZE;
                scene[row][col] = tile;
                obstacleArray.push(tile);
            }
			else if(_scene[row][col] == 11){
                tile.img = EXIT;
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
						  torch.x=305, torch.y=320, frameWidth, frameHeight);  //coordinates of the torch

        shift = currentFrame * (frameHeight);

        if (currentFrame == totalFrames) {
            shift = 0;
            currentFrame = 0;
        }

        currentFrame++;
		
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

//scrolling
var isScrolling = false;
var scrollSpeed=5;
var scrollDir; //0=up, 1=right, 2=down, 3=left

function scrollCheck(){
    if(player.y<90) {
        scrollDir = 0;
        isScrolling = true;
    }
    if(player.x+SIZE>canvas.width-90) {
        scrollDir = 1;
        isScrolling = true;
    }
    if(player.y+SIZE>canvas.height-90) {
        scrollDir = 2;
        isScrolling = true;
    }
    if(player.x<90) {
        scrollDir = 3;
        isScrolling = true;
    }
}

function scrollLevel(){

    if (scrollDir == 0){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].y += scrollSpeed;
            }
        }
    }

    if (scrollDir == 1){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].x -= scrollSpeed;
            }
        }
    }

    if (scrollDir == 2){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].y -= scrollSpeed;
            }
        }
    }

    if (scrollDir == 3){
        for (var row = 0; row < sceneRows; row++)
        {
            for (var col = 0; col < sceneColumns; col++)
            {
                scene[row][col].x += scrollSpeed;
            }
        }
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
    activeBtns = [ buttons[0] ];
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
    activeBtns = [ buttons[1], buttons[2], buttons[3], buttons[4] ];
    loadScene(scene1);
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
	//mike
	//textbox begins
	getBananaTextBox();
	getMojoTextBox();
	//textbox ends
}

function exitGame()
{
    console.log("Exiting game state.");
}

function enterHelp()
{
    console.log("Entering help state.");
    surface.clearRect(0,0,canvas.width,canvas.height);
    activeBtns = [ buttons[2] ];
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

function onExitClick()
{
    if (currState == 1)
        changeState(0);
    else if (currState == 2)
        changeState(1);
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
    drawHealthbar(surface, 10, 10, 500, 50, currentHealth, 100);
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


//mike stuff
var button = document.querySelector("button");
button.addEventListener("click", clickHandler, false);

function clickHandler() {
    inventory[0] += 1;
	banana.message = inventory[0];
	inventory[1] += 1;
	mojo.message = inventory[0];
}
var textarea = document.querySelector("textarea");
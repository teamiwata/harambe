const SIZE = 64; // Dimension of square image.
const ROWS = 10; // Number of rows.
const COLS = 11; // Extra col.

/* Here we are making a link to the canvas element in the html
   and setting its width and height attributes to 640 px. */
var canvas = document.querySelector("canvas");
canvas.width = 640;
canvas.height = 640;

var surface = canvas.getContext("2d"); // Creating a 2D surface to draw to.
var grid = []; // Creating an array that will dynamically become two-dimensional.
var rocks = new Image(); // Creating the common rocks image object for all tiles.
rocks.src = "../img/rocks.png";
var rocksMoveChance = 70;
var rocksBool = false;

var space = new Image(); // Creating the common space image object for all tiles.
space.src = "../img/space.png";

var ship = [];
ship = new Image();
ship.src = "../img/ship.png";
var shipCoordX = 50;
var shipCoordY = 50;
var shipMoveSpeed = 5;

// *** ADDED SAFE CODE ***
var safe = new Image(); // Creating the common rocks image object for all tiles.
safe.src = "../img/space.png";
var safeIdx = Math.floor(Math.random() * 10);
var safeMoveChance = 40;
// *** END OF ADDED CODE ***

//timer:
var counter = 0;
var myInterval = setInterval(function () {
    ++counter;
    document.getElementById("timer").innerHTML = "Seconds: " + counter;
}, 1000);

//clearInterval(myInterval);


//Player Movement Begins:

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyDown(event)
{
	switch(event.keyCode)
	{
		case 37: // left arrow
		case 65: // a
			if (leftPressed == false)
				leftPressed = true;
			break;
		case 39: // right arrow
		case 68: // d
			if (rightPressed == false)
				rightPressed = true;
			break;
		case 38: // up arrow
		case 87: // w
			if (upPressed == false)
				upPressed = true;
			break;
		case 40: // down arrow
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
		case 37: // left arrow
		case 65: // a
			leftPressed = false; break;
		case 39: // right arrow
		case 68: // d
			rightPressed = false; break;
		case 38: // up arrow
		case 87: // w
			upPressed = false; break;
		case 40: // down arrow
		case 83: // s
			downPressed = false; break;
	}
}
function checkInput() {
	if (leftPressed == true) {
		//document.getElementById("test").innerHTML = "Key Pressed: left";
		if (shipCoordX > 0)
			shipCoordX -= shipMoveSpeed;

	}
	else if (rightPressed == true) {
		//document.getElementById("test").innerHTML = "Key Pressed: right";
		if (shipCoordX < 576)
			shipCoordX += shipMoveSpeed;

	}
	if (upPressed == true) {
		//document.getElementById("test").innerHTML = "Key Pressed: up";
		if (shipCoordY > 0)
			shipCoordY -= shipMoveSpeed;

	}
	else if (downPressed == true) {
		//document.getElementById("test").innerHTML = "Key Pressed: down";
		if (shipCoordY < 576)
			shipCoordY += shipMoveSpeed;

	}
}
/*window.onkeydown = keyDownMoveIt;
function keyDownMoveIt(e){
    if(e.keyCode == 37){// left arrow key was pressed
        if(shipCoordX > 0)
            shipCoordX -= shipMoveSpeed;
    }
    if(e.keyCode == 39){// right arrow key was pressed
        if(shipCoordX < 640)
            shipCoordX += shipMoveSpeed;
    }
    if(e.keyCode == 38){// up arrow key was pressed
        if(shipCoordY > 0)
            shipCoordY -= shipMoveSpeed;
    }
    if(e.keyCode == 40){// down arrow key was pressed
        if(shipCoordY < 640)
            shipCoordY += shipMoveSpeed;
    }

}*/

//Player Movement Ends



for (var row = 0; row < ROWS; row++) // For 10 rows.
{
	grid[row] = []; // Creates the second dimension dynamically.
	for (var col = 0; col < COLS; col++) // Run for 10 cols.
	{
		var tile = {}; // Creating object with a temporary name.
		tile.x = col * SIZE; // Creating the x coordinate using the inner for loop counter.
		tile.y = row * SIZE; // Creating the y coordinate using the outer for loop counter.
		tile.img = space; // Assigning the rocks image to the tile.
		grid[row][col] = tile; // Adding the tile object to the grid at the given row and column.
	}
}

setInterval(update, 33.34); // 30 frames per second. One run of the update function is considered a frame.



function update()
{

	checkInput();
	moveTiles(); // Moving the tiles.

	render();	// Rendering out the tile images to the canvas.
	shipRender();
	collisionTiles();
	//checkCollision();

}

function moveTiles()
{
	for (var row = 0; row < ROWS; row++) // For 10 rows.
	{
		for (var col = 0; col < COLS; col++) // Run for 10 cols.
		{
			grid[row][col].x -= 4; // Delta x (change in x by 4 pixels to the left)
		}
	}
	/* For the next code, after the tiles have been drawn, if the far left column is now 
	   completely off the canvas (x <= -61) we delete the leftmost column (with shift) and 
	   create a new tile and add it to the end of the row (with push). The check right below 
	   could use any row but I've provided index 0. */
	if (grid[0][0].x <= -64) 
	{
		for (var row = 0; row < ROWS; row++) // For the 10 rows.
		{
			var randomevent = Math.ceil(Math.random() * 99);
			grid[row].shift(); // Removes the first column.
			var tile = {}; // Creating object with a temporary name.
			tile.x = 640;
			tile.y = row * SIZE;
			// *** ADDED CODE FOR SAFE SPACE ***
			if (row == safeIdx)
				tile.img = safe; // Safe space.
				//add in else if statement for rocks here.
			else if ( tile.img != safe && randomevent < rocksMoveChance)
			{
				var randomevent = Math.ceil(Math.random() * 99);
                tile.img = rocks;

            }
			else
				//add in rock chance
				tile.img = space;
			// *** END OF ADDED CODE ***
			grid[row].push(tile); // Adds tile to end of row.

			//collision decision:
			if (tile.img == rocks) {
				if (!( shipCoordY > tile.y + SIZE ||
					shipCoordY.y + SIZE < tile.y ||
					shipCoordX > tile.x ||
					shipCoordX + SIZE < tile.x )) {
					//document.getElementById("Collision").innerHTML = "Collision: Detected";
					//clearInterval(update);
					//clearInterval(myInterval);
				}
			}
			//end collision
		}
		// *** ADDED MORE CODE FOR SAFE MOVE CHANCE ***
		var randRoll = Math.ceil(Math.random() * 99);
		if (randRoll <= safeMoveChance)
		{
			if (safeIdx == 0)
				safeIdx++;
			else if (safeIdx == 9)
				safeIdx--;
			else
				safeIdx += (1 - (Math.floor(Math.random() * 2) * 2)); // Gets 1 or -1! So useful later!
		}
		//add in rocks chance
		var rocksrandRoll = Math.ceil(Math.random() * 99);
		if (rocksrandRoll <= rocksMoveChance)
		{
				rocksBool = true;


		}
		else rocksBool = false;


	}

}

function render()
{
	surface.clearRect(0,0,canvas.width,canvas.height); // Clears the canvas.
	for (var row = 0; row < ROWS; row++) // For 10 rows.
	{
		for (var col = 0; col < COLS; col++) // Run for 10 cols.
		{
			surface.drawImage(grid[row][col].img, 
							  grid[row][col].x,
							  grid[row][col].y);
		}
	}
}








function shipRender()
{
    surface.drawImage(ship, shipCoordX, shipCoordY);
}

//Collision Code

var shipCoords = [];
shipCoords.x = shipCoordX;
shipCoords.y = shipCoordY;

rocksize = 64;

var colisionGrid = [];
for (var row = 0; row < ROWS; row++) // For 10 rows.
{
	colisionGrid[row] = []; // Creates the second dimension dynamically.
	for (var col = 0; col < COLS; col++) // Run for 10 cols.
	{
		//var ctile = {}; // Creating object with a temporary name.
		//ctile.x = col * SIZE; // Creating the x coordinate using the inner for loop counter.
		//ctile.y = row * SIZE; // Creating the y coordinate using the outer for loop counter.
		// if (row == shipCoords.x && col == shipCoords.y)
		// 	tile = ship;
	}
}
function checkCollision()
{
	if ( !( shipCoordY > blueObj.y+SIZE ||
		shipCoordY+SIZE < blueObj.y ||
		shipCoordX > blueObj.x+SIZE ||
		shipCoordX+SIZE < blueObj.x ) )
	{
		document.getElementById("Collision").innerHTML = "Collision: Detected";
	}
}

function collisionTiles()
{
	for (var row = 0; row < ROWS; row++) // For 10 rows.
	{
		for (var col = 0; col < COLS; col++) // Run for 10 cols.
		{
			colisionGrid[row][col].x -= 4; // Delta x (change in x by 4 pixels to the left)
		}
	}
	if (grid[0][0].x <= -64)
	{
		for (var row = 0; row < ROWS; row++) // For the 10 rows.
		{
			var randomevent = Math.ceil(Math.random() * 99);
			colisionGrid[row].shift(); // Removes the first column.
			var tile = {}; // Creating object with a temporary name.
			tile.x = 640;
			tile.y = row * SIZE;

			colisionGrid[row].push(tile); // Adds tile to end of row.

		}


	}
}


//End Collision Code
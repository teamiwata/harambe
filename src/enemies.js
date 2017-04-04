//Mike
var _textRange = document.getElementById("textRange");
var _textLOS = document.getElementById("textLOS");
var colTiles = []; // And array holding the collision tiles. Only walls and doors currently.
var losTiles = []; // Only store collidable tiles that aren't walls or doors. For line of sight check.
var tileImages = ["../img/objects/npc/Floor.png", "../img/objects/npc/Wall.png", "../img/objects/npc/Door.png", "../img/objects/npc/Enemy.png", 
				  "../img/objects/npc/Bullet.png", "../img/objects/npc/Seg.png"];


var enemies = [];
enemies[0] = {img:null, x:192, y:128, w:32, h:48, speed:4, dx:0, dy:0, currWP:0,  
			 range:400, firing:false, fireCtr:0, fireMax:15, update:enemyUpdate,
			 linecasts:[], wps:[{x:128,y:128},{x:128,y:576},{x:704,y:576},{x:704,y:128}]};
			 
enemies[1] = {img:null, x:192, y:320, w:32, h:48, speed:4, dx:0, dy:0, currWP:0,  
			 range:400, firing:false, fireCtr:0, fireMax:15, update:enemyUpdate,
			 linecasts:[], wps:[{x:192,y:576},{x:192,y:192}]};
			 
enemies[2] = {img:null, x:500, y:320, w:32, h:48, speed:4, dx:0, dy:0, currWP:0,  
			 range:400, firing:false, fireCtr:0, fireMax:15, update:enemyUpdate,
			 linecasts:[], wps:[{x:500,y:128},{x:500,y:576}]};	
			 
var bullets = [];


function enemyUpdate()
{
	_textRange.style.color = "Red";
	_textLOS.style.color = "Red";
	// Move the enemy.
	this.x += this.dx;
	this.y += this.dy;
	this.linecasts = [];
	// This if below checks to see if the enemy is close to the waypoint. If it is, it sets the next waypoint.
	if (calcDistance(this.x, this.wps[this.currWP].x, this.y, this.wps[this.currWP].y) <= this.speed/2)
	{
		this.x = this.wps[this.currWP].x; // Snaps the enemy to the destination waypoint.
		this.y = this.wps[this.currWP].y;
		this.currWP++; // Increments the waypoint index.
		if (this.currWP == this.wps.length) this.currWP = 0; // If the last waypoint done, reset to first.
		calcDeltas(this); // Sets the new enemy dx and dy.	
	}
	// Check distance from player.
	if (calcDistance(this.x, player.x, this.y, player.y) <= this.range)
	{
		//_textRange.style.color = "Green";
		// Huge line of sight check algorithm below.
		var dx = (player.x+player.w/2) - (this.x+this.w/2); // Change in x to the player.
		var dy = (player.y+player.h/2) - (this.y+this.h/2); // Change in y to the player.
		var segs = 8; // segs is how many segments we want the vector broken into.
		var j; 
		for (var i = 0; i < losTiles.length; i++) // Don't need to check walls or doors around the outside.
		{
			this.linecasts = [];
			for (j = 1; j <= segs; j++) 
			{
				this.linecasts.push({x:(this.x+this.w/2)+(dx*(j/segs)), y:(this.y+this.h/2)+(dy*(j/segs))});
				if (!(((this.x+this.w/2)-8)+(dx*(j/segs)) > losTiles[i].x+losTiles[i].w ||
					  ((this.x+this.w/2)+8)+(dx*(j/segs)) < losTiles[i].x ||
					  ((this.y+this.h/2)-8)+(dy*(j/segs)) > losTiles[i].y+losTiles[i].h || 
					  ((this.y+this.h/2)+8)+(dy*(j/segs)) < losTiles[i].y))
				{
					i = losTiles.length; // Set the outer for loop to finish.
					break; // Found collision, don't have line of sight.
				}
			}
		}
		if (j == segs+1) // For loop completed and enemy has LOS to player.
		{
			//_textLOS.style.color = "Green";
			// Spawn bullet check.
			if (this.firing == false) // Can fire!
			{
				this.firing = true;
				this.fireCtr = 0;
				// Spawn bullet.
				var tempBullet = {img:tileImages[4], x:(this.x+this.w/2)-8, y:(this.y+this.h/2)-8, dx:0, dy:0, speed:10};
				var mag = Math.sqrt(dx*dx + dy*dy);
				tempBullet.dx = dx/mag * tempBullet.speed;
				tempBullet.dy = dy/mag * tempBullet.speed;
				bullets.push(tempBullet);
			}
			else // Can't fire yet but increment the frame counter.
			{
				this.fireCtr++;
				if (this.fireCtr == this.fireMax)
				{
					this.fireCtr = 0;
					this.firing = false;
				}
			}
		}
	}		
}

function calcDeltas(e)
{
	// Create the vector to the next waypoint.
	var tempDX = e.wps[e.currWP].x - e.x; // Change in x points.
	var tempDY = e.wps[e.currWP].y - e.y; // Change in y points.
	var mag = Math.sqrt(tempDX*tempDX + tempDY*tempDY); // Magnitude of the vector, aka the distance in pixels.
	e.dx = tempDX/mag * e.speed; // Setting the new enemy delta x.
	e.dy = tempDY/mag * e.speed; // Setting the new enemy delta y.
}
function calcDistance(x1, x2, y1, y2)
{
	// Returns the magnitude or distance between two points. Will always be positive.
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function updateBullets()
{
	for (var i = 0; i < bullets.length; i++)
	{
		bullets[i].x += bullets[i].dx;
		bullets[i].y += bullets[i].dy;
	}
}
//Mike End
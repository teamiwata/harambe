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
/* // Kill Button Just in case
function kill() {
	if (currentHealth > 0)
	currentHealth -= 20;
	
}
*/
function shopBananas()
{
    if ( (inventory[0] >= 0) && (currentHealth <= 100) && (money > 0) )
    {
        inventory[0] += 1;
		money -= 11;
		displayMoney();
        banana.message = inventory[0];
    }
}
function onMojo()
{
    if ( (inventory[1] > 0) && (currentHealth < 100) )
    {
        currentHealth += 50;
        inventory[1] -= 1; 
        mojo.message = inventory[1];
    }
}

function shopMojo()
{
    if ( (inventory[1] > 0) && (currentHealth < 100) && (money > 0))
    {
        inventory[1] += 1;
		money -= 21 // Money subtaction 
		displayMoney();
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
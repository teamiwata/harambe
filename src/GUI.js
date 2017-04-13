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


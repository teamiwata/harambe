var display = document.getElementById('display').getContext('2d');
var button = 100;
drawHealthbar(display, 10, 10, 500, 50, 100 /*<----THIS IS THE VALUE OF THE HEATH!!!*/ , 100);

function drawHealthbar(canvas, x, y, width, height, health, max_health) {
    if (health >= max_health) {health = max_health;}
    if (health <= 0) {health = 0;}
    canvas.fillStyle = "#000000";
    canvas.fillRect(x, y, width, height);
    var colorNumber = Math.round((1-(health/max_health))*0xff)*0x10000 + Math.round((health/max_health)*0xff)*0x100;
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
    canvas.fillRect(x+1, y+1, (health/max_health)*(width-2), height-2);
}

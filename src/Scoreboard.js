//Scoreboard div
document.getElementById("Scoreboard").style.backgroundColor = "blue";
document.getElementById("Scoreboard").style.height = "275px";
document.getElementById("Scoreboard").style.width = "150px";

//Scoreboard Header
document.getElementById("Scorehead").style.height = "25px";
document.getElementById("Scorehead").style.width = "150px";
document.getElementById("Scorehead").innerHTML = "Scoreboard";
document.getElementById("Scorehead").style.backgroundColor = "lightblue";
document.getElementById("Scorehead").style.color = "blue";
document.getElementById("Scorehead").style.fontSize = "20px";

//Number of Deaths
var death = 0;

document.getElementById("Deaths").style.color = "lightblue";

document.getElementById("CountDeath").addEventListener("click", DisplayDeathCount);
function DisplayDeathCount(){
	death++;
	document.getElementById("Deaths").innerHTML = "Death Count: " + death;
}
// Money
var money = 100;

document.getElementById("Money").style.color = "lightblue";
function displayMoney () {
	money++
	document.getElementById("Money").innerHTML = "Money: " + money;
}
// Jackson Was here

//Number of Cages and Animals
var cage = 0;
var animal = 0;

document.getElementById("CageOpen").style.color = "lightblue";
document.getElementById("NumAnimal").style.color = "lightblue";
document.getElementById("CountCage").addEventListener("click", DisplayAnimalCage);
function DisplayAnimalCage(){
	cage++;
	animal = cage * 2;
	
	document.getElementById("CageOpen").innerHTML = "Opened Cages: " + cage;
	document.getElementById("NumAnimal").innerHTML = "Animals Saved: " + animal;
}

function renderGame(){
	surface.clearRect(0,0,canvas.width,canvas.height);
}
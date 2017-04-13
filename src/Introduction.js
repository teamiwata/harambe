var intro=document.getElementById("textBox");
var introText=intro.getContext("2d");
var headText=intro.getContext("2d");

//Text Box (canvas) colour
document.getElementById("textBox").style.backgroundColor = "lightgrey";

//Text in Intro Box (canvas)
headText.font="45px Arial";
headText.strokeText("Revenge of Harambe",110,45)
introText.font="30px Arial";
introText.fillText("Twenty years after the death of Harambe,",10,85); 
introText.fillText("Donald Trump created an island zoo. This",10,115);
introText.fillText("island zoo is called the New Cincinnati Zoo.",10,145); 
introText.fillText("This zoo is divided up into four islands",10,175); 
introText.fillText("composed of different animal exhibits ranging",10,205); 
introText.fillText("from mammals, reptiles, aquatic species and",10,235); 
introText.fillText("insects. On the grand opening of the New",10,265);
introText.fillText("Cincinnati Zoo, the Ghost of Harambe rises",10,295);
introText.fillText("from the dead in the old abandoned Cincinnati",10,325); 
introText.fillText("Zoo. He sees the New Cincinnati Zoo from the",10,355); 
introText.fillText("distance and decides to set the animals free. In",10,385); 
introText.fillText("order to set them free he posseses one of the",10,415);
introText.fillText("gorillas in the gorilla exhibit to have a physical",10,445); 
introText.fillText("form. ONWARD TO FREE THE ANIMALS!!!",10,480);

//Button Design
document.getElementById("close").style.fontSize = "20px";
document.getElementById("close").style.backgroundColor = "grey";
document.getElementById("close").style.borderRadius = "8px";

//onclick function
function hideText(){
	document.getElementById("textBox").style.display = "none";
	document.getElementById("close").style.display = "none";
}
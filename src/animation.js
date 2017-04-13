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

function renderAnimation()
{
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
}
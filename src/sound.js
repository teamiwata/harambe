var music = new Howl({
  src: ['../sound/music/zizibum.mp3'], //Play the music for the game.
  autoplay: true,
  loop: true,
  volume: 0.07,
  mute: false,
});

var sound2 = new Howl({
  src: ['../sound/sounds/smb_bump.wav'],  //Play sound for bouncing off walls
  volume: 0.07,
  mute: false,
});




var boolmutemusic = false;
function muteMusic() //Mute/UnMute Music
{
	if (boolmutemusic == true)
	{
		music.mute(false);
		document.getElementById("mutemusic").innerHTML = "Mute Music";
		boolmutesound = false;
	}
	else if (boolmutemusic == false)
	{
		music.mute(true);
		document.getElementById("mutemusic").innerHTML = "Unmute Music";
		boolmutemusic = true;
	}
}

var boolmutesound = false;
function muteSound() // Mute/UnMute Sound Effects
{
	if (boolmutesound == true)
	{
		boolSoundFalse();
		document.getElementById("mutesound").innerHTML = "Mute Sound";
		boolmutesound = false;
	}
	else if (boolmutesound == false)
	{
		boolSoundTrue();
		document.getElementById("mutesound").innerHTML = "Unmute Sound";
		boolmutesound = true;
	}
}

function boolSoundTrue() //Place all sounds in here to mute.
{
	sound2.mute(true);
}
function boolSoundFalse() //Place all sounds in here to unmute.
{
	sound2.mute(false);
}



//sound.play();
/*
//sound2.play();*/
//End playing the music for the game.
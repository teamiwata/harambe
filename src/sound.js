var music = new Howl({
  src: ['../sound/music/zizibum.mp3'], //Play the music for the game.
  loop: true,
  volume: 0.07,
  mute: false,
});

var sound2 = new Howl({
  src: ['../sound/sounds/smb_bump.wav'],  //Play sound for bouncing off walls
  volume: 0.07,
  mute: false,
});

var music2 = new Howl({
    src: ['../sound/music/6819305_retro-soldiers_by_depard_preview.mp3'], //Play the music for the game.
    autoplay: false,
    loop: true,
    volume: 0.07,
    mute: false,
});


var ISound = new Howl({
    src: ['../sound/sounds/smb_1-up.wav'],
    volume: 1,
    mute: false,
});

function boolMusicTrue() //Place all sounds in here to mute.
{
	music.mute(true);
	music2.mute(true);
}
function boolMusicFalse() //Place all sounds in here to unmute.
{
	music.mute(false);
	music2.mute(false);
}

var boolmutemusic = false;
function muteMusic() //Mute/UnMute Music
{
	
	if (boolmutemusic == true)
	{
		boolMusicFalse();
		boolmutemusic = false;
	}
	else //(boolmutemusic == false)
	{
		boolMusicTrue();
		boolmutemusic = true;
	}	
}

var boolmutesound = false;
function muteSound() // Mute/UnMute Sound Effects
{
	
	if (boolmutesound == true)
	{
		boolSoundFalse();
		boolmutesound = false;
	}
	else //(boolmutesound == false)
	{
		boolSoundTrue();
		boolmutesound = true;
	}
	
}

function boolSoundTrue() //Place all sounds in here to mute.
{
	sound2.mute(true);
	ISound.mute(true);
}
function boolSoundFalse() //Place all sounds in here to unmute.
{
	sound2.mute(false);
	ISound.mute(false);
}



//sound.play();
/*
//sound2.play();*/
//End playing the music for the game.
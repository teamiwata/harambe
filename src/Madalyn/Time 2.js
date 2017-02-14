function Timer(settings)
{
    this.settings = settings;
    this.timer = null;

    this.fps = settings.fps || 30;
    this.interval = Math.floor(1000/30);
    this.timeInit = null;

    return this;
}

Timer.prototype = 
{   
    run: function()
    {
        var $this = this;

        this.settings.run();
        this.timeInit += this.interval;

        this.timer = setTimeout(
            function(){$this.run()}, 
            this.timeInit - (new Date).getTime()
        );
    },

    start: function()
    {
        if(this.timer == null)
        {
            this.timeInit = (new Date).getTime();
            this.run();
        }
    },

    stop: function()
    {
        clearTimeout(this.timer);
        this.timer = null;
    }
}

var timer = new Timer({
    fps: 30,
    run: function(){
        //run game code here
    }
});

timer.start();
timer.stop();

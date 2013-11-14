// Game main

/****************************************************************************************/
/*									game resources										*/
/****************************************************************************************/
var g_resources = [
	// our level tileset
	{name: "objects", type: "image", src: "res/level/tilesets/objects.png"},
	{name: "solid", type: "image", src: "res/level/tilesets/solid.png"},
	{name: "textures", type: "image", src: "res/level/tilesets/textures.png"},
	// our levels
	{name: "1", type: "tmx", src: "res/level/level_1.tmx"},
	{name: "2", type: "tmx", src: "res/level/level_2.tmx"},
	{name: "3", type: "tmx", src: "res/level/level_3.tmx"},
	{name: "4", type: "tmx", src: "res/level/level_4.tmx"},
	{name: "5", type: "tmx", src: "res/level/level_5.tmx"},
	{name: "6", type: "tmx", src: "res/level/level_6.tmx"},
	{name: "7", type: "tmx", src: "res/level/level_7.tmx"},
	{name: "8", type: "tmx", src: "res/level/level_8.tmx"},
	{name: "9", type: "tmx", src: "res/level/level_9.tmx"},
	{name: "10", type: "tmx", src: "res/level/level_10.tmx"},
	{name: "11", type: "tmx", src: "res/level/level_11.tmx"},
	{name: "12", type: "tmx", src: "res/level/level_12.tmx"},
	{name: "13", type: "tmx", src: "res/level/level_13.tmx"},
	{name: "14", type: "tmx", src: "res/level/level_14.tmx"},
	{name: "15", type: "tmx", src: "res/level/level_15.tmx"},
	{name: "16", type: "tmx", src: "res/level/level_16.tmx"},
	// images
	{name: "menu_tux", type: "image", src: "res/images/menu_tux.png"},
	{name: "menu_bg", type: "image", src: "res/images/menu_bg.png"},
	{name: "sound_on", type: "image", src: "res/images/sound_on.png"},
	{name: "sound_off", type: "image", src: "res/images/sound_off.png"},
	// spritesheets
	{name: "tux", type: "image", src: "res/sprites/tux.png"},
	{name: "snowstorm", type: "image", src: "res/sprites/snowstorm.png"},
	// audio resources
	{name: "background", type: "audio", src: "res/audio/", channel: 2, stream: true},
	{name: "die", type: "audio", src: "res/audio/", channel: 1},
	{name: "gravity", type: "audio", src: "res/audio/", channel: 1},
	{name: "snowstorm", type: "audio", src: "res/audio/", channel: 1},
	{name: "start", type: "audio", src: "res/audio/", channel: 1},
	{name: "walk", type: "audio", src: "res/audio/", channel: 1},
	{name: "win", type: "audio", src: "res/audio/", channel: 3}
//	{name: "water_hole", type: "audio", src: "res/audio/",	channel : 1},
];

/****************************************************************************************/
/*										main program									*/
/****************************************************************************************/
var jsApp =
{
	//	Initialize the jsApp
	onload: function()
	{
		// displays debug Box
//		me.debug.renderHitBox = true;

		// init the video
		if (!me.video.init('jsapp', 800, 600))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please get Chrome or Firefox");
			return;
		}

		// initialize the "audio"
		me.audio.init("ogg, mp3");

		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

		// should be used on Background layer
//		me.sys.preRender = true;

		// just redraws stuff when it changes
		me.sys.dirtyRegion = true;

		// disables audio by default, because the programmer finds it anoying
		me.audio.disable();
	},
	// callback when everything is loaded
	loaded: function()
	{
		// set game screene
		me.state.set(me.state.MENU, new MenuScreen());
		me.state.set(me.state.PLAY, new PlayScreen());
		me.state.set(me.state.SCORE, new ScoreScreen());
		me.state.set(me.state.CREDITS, new CreditsScreen());
		me.state.set(me.state.GAME_END, new EndScreen());

		// set a global fading transition for the screen
		me.state.transition("fade", "#FFFFFF", 250);

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("snowstorm", snowstorm);
		me.entityPool.add("spikes", spikes);
		me.entityPool.add("me.LevelEntity", LevelEntity);

		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.input.bindKey(me.input.KEY.S, "down");
		me.input.bindKey(me.input.KEY.SPACE, "jump", true);
		me.input.bindKey(me.input.KEY.X, "jump", true);

		// start the game
		me.state.change(me.state.MENU);

		levelCurrent = null;
	}
};

/****************************************************************************************/
/*										bootstrap										*/
/****************************************************************************************/
window.onReady(function()
{
	jsApp.onload();
});
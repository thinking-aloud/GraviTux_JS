// game screens

/****************************************************************************************/
/*									the menu screen										*/
/****************************************************************************************/
var MenuScreen = me.ScreenObject.extend(
{
	init: function()
	{
		this.parent(true);

		// init background image
		this.bgImage = null;
		this.tuxImage = null;

		// init text
		this.headerFont = null;
		this.bodyFont = null;

		// add sound toggle button at pos (765, 8), z index 4
		me.game.add((new soundButton(765, 8)), 4);
	},
	// reset function
	onResetEvent: function()
	{
		if (this.bgImage === null)
		{
			// background image
			this.bgImage = me.loader.getImage("menu_bg");
			this.menu_tux = me.loader.getImage("menu_tux");

			// font to display the menu items
			this.headerFont = new me.Font('header_font', 90, 'white');
//			this.bodyFont = new me.Font('body_font', 40, 'white');
		}

		// draws background and logo
		var bg_canvas = me.video.createCanvasSurface(800, 600);
		bg_canvas.drawImage(this.bgImage, 0, 0);
		this.headerFont.draw(bg_canvas, "GraviTux", 210, 160);
		me.game.add(new graviTux_logo(0, 0, bg_canvas));

		// Create "new game" button		x, y, width, height
		var newgame_btn = new GUI_Button(310, 220, 240, 45, "new game", 1);
		newgame_btn.onClick = function()
		{
			me.state.change(me.state.PLAY);
		};
		me.game.add(newgame_btn);

		// Create "continue" button
		var continue_btn = new GUI_Button(310, 280, 240, 45, "continue", 2);
		continue_btn.onClick = function()
		{
			if (levelCurrent !== null)
			{
				me.levelDirector.loadLevel(levelCurrent);
			}
		};
		me.game.add(continue_btn);

		// Create "highscore" button
		var highscore_btn = new GUI_Button(310, 340, 240, 45, "highscore", 3);
		highscore_btn.onClick = function()
		{
			me.state.change(me.state.SCORE);
		};
		me.game.add(highscore_btn);

		// Create "credits" button
		var credits_btn = new GUI_Button(310, 400, 240, 45, "credits", 4);
		credits_btn.onClick = function()
		{
			me.state.change(me.state.CREDITS);
		};
		me.game.add(credits_btn);

		// Create "exit" button
		var exit_btn = new GUI_Button(310, 460, 240, 45, "exit", 5);
		exit_btn.onClick = function()
		{
			me.state.change(me.state.GAME_END);
		};
		me.game.add(exit_btn);

		// make sure everything is in the right order
		me.game.sort();

		// play menu background music
//		me.audio.play("");
	},
	// the menu destroy function
	onDestroyEvent: function()
	{
		// free images
		this.bgImage = null;
		this.tuxImage = null;

		// free fonts
		this.headerFont = null;
		this.bodyFont = null;

		// unbind keyboard
		me.input.unbindMouse(me.input.mouse.LEFT);
	}
});

/****************************************************************************************/
/*									the play screen										*/
/****************************************************************************************/
var PlayScreen = me.ScreenObject.extend(
{
	onResetEvent: function()
	{
		// load a level
		me.levelDirector.loadLevel("1");	//default: 1

		// make sure everyhting is in the right order
//		me.game.sort();

		// play the ingame background music
		me.audio.playTrack("start");
		me.audio.playTrack("background");

		me.input.bindKey(me.input.KEY.ESC, "escape", true);
	},
	onDestroyEvent: function()
	{
		// stop the current audio track
		me.audio.stopTrack();

//		me.input.unbindKey(me.input.KEY.ESC);
	}
});

/****************************************************************************************/
/*								the highscore screen									*/
/****************************************************************************************/
var ScoreScreen = me.ScreenObject.extend(
{
	init: function()
	{
		this.parent(true);

		// init background image
		this.bgImage = null;

		// init text
		this.headerFont = null;
		this.bodyFont = null;
	},
	// reset function
	onResetEvent: function()
	{
		if (this.bgImage === null)
		{
			// background image
			this.bgImage = me.loader.getImage("menu_bg");

			// font to display the menu items
			this.headerFont = new me.Font('header_font', 90, 'white');
			this.bodyFont = new me.Font('body_font', 40, 'white');

			// enable the keyboard
			me.input.bindKey(me.input.KEY.ESC, "escape", true);
		}
	},
	// update function
	update: function()
	{
		// loads menu
		if (me.input.isKeyPressed('escape'))
		{
			me.state.change(me.state.MENU);
		}

		return true;
	},
	// the menu drawing function
	draw: function(context)
	{
		// draws background image
		context.drawImage(this.bgImage, 0, 0);

		// draws the text
		this.headerFont.draw(context, "GraviTux", 210, 160);
		this.bodyFont.draw(context, "highscore", 310, 250);
	},
	// the menu destroy function
	onDestroyEvent: function()
	{
		// free images
		this.bgImage = null;

		// free fonts
		this.headerFont = null;
		this.bodyFont = null;

		// unbind keyboard
		me.input.unbindKey(me.input.KEY.ESC);
	}
});

/****************************************************************************************/
/*									the credits screen									*/
/****************************************************************************************/
var CreditsScreen = me.ScreenObject.extend(
{
	init: function()
	{
		this.parent(true);

		// init background image
		this.bgImage = null;

		// init text
		this.headerFont = null;
		this.bodyFont = null;
	},
	// reset function
	onResetEvent: function()
	{
		if (this.bgImage === null)
		{
			// background image
			this.bgImage = me.loader.getImage("menu_bg");

			// font to display the menu items
			this.headerFont = new me.Font('header_font', 90, 'white');
			this.bodyFont = new me.Font('body_font', 40, 'white');

			// enable the keyboard
			me.input.bindKey(me.input.KEY.ESC, "escape", true);
		}
	},
	// update function
	update: function()
	{
		// loads menu
		if (me.input.isKeyPressed('escape'))
		{
			me.state.change(me.state.MENU);
		}

		return true;
	},
	// the menu drawing function
	draw: function(context)
	{
		// draws background image
		context.drawImage(this.bgImage, 0, 0);

		// draws the text
		this.headerFont.draw(context, "GraviTux", 210, 160);
		this.bodyFont.draw(context, "credits", 310, 250);
	},
	// the menu destroy function
	onDestroyEvent: function()
	{
		// free images
		this.bgImage = null;

		// free fonts
		this.headerFont = null;
		this.bodyFont = null;

		// unbind keyboard
		me.input.unbindKey(me.input.KEY.ESC);
	}
});

/****************************************************************************************/
/*										the end screen									*/
/****************************************************************************************/
var EndScreen = me.ScreenObject.extend(
{
	init: function()
	{
		this.parent(true);

		// init background image
		this.bgImage = null;

		// init text
		this.headerFont = null;
		this.bodyFont = null;
	},
	// reset function
	onResetEvent: function()
	{
		if (this.bgImage === null)
		{
			// background image
			this.bgImage = me.loader.getImage("menu_bg");

			// font to display the menu items
			this.headerFont = new me.Font('header_font', 90, 'white');
			this.bodyFont = new me.Font('body_font', 40, 'white');

			// enable the keyboard
			me.input.bindKey(me.input.KEY.ESC, "escape", true);
		}
	},
	// update function
	update: function()
	{
		// loads menu
		if (me.input.isKeyPressed('escape'))
		{
			me.state.change(me.state.MENU);
		}

		return true;
	},
	// the menu drawing function
	draw: function(context)
	{
		// draws background image
		context.drawImage(this.bgImage, 0, 0);

		// draws the text
		this.headerFont.draw(context, "GraviTux", 210, 160);
		this.bodyFont.draw(context, "The End", 310, 250);
	},
	// the menu destroy function
	onDestroyEvent: function()
	{
		// free images
		this.bgImage = null;

		// free fonts
		this.headerFont = null;
		this.bodyFont = null;

		// unbind keyboard
		me.input.unbindKey(me.input.KEY.ESC);
	}
});

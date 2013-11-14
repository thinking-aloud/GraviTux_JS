// game entities

/****************************************************************************************/
/*									player entity										*/
/****************************************************************************************/
var PlayerEntity = me.ObjectEntity.extend(
{
	// constructor
	init: function(x, y)
	{
		// call the constructor (-2 because tux is 42 px tall)
		this.parent(x, y - 2,
		{
			image: "tux",
			spritewidth: 23
		});

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(5, 5);

		// sets gravity speed
		this.gravityX = 0;		// gravity for left and right
		this.gravity = 0.98;	// default value: 0.98 (earth gravity)
//		this.maxVel.x = 8;		// max acceleration default: 6
//		this.maxVel.y = 8;		// max acceleration default: 6

		// sets animation orientation
		gravity = 'bottom';

		// stores init values so it can be reset on death
		this.initX = x;
		this.initY = y - 2;	// -2 because tux is 42 px tall
		this.initGravity = this.gravity;

		// snowstorm ticker
		lastTicked = me.timer.getTime();

		// player animations
		this.addAnimation("tux_walk", [0, 1, 2, 3, 4, 5, 6, 7]);
		this.addAnimation("tux_stand", [8]);
		this.setCurrentAnimation("tux_stand");

		me.audio.play("start");
	},
	// update the player pos
	update: function()
	{
		console.log(gravity);
		// movement when gravity is top or bottom
		if (gravity === 'top' || gravity === 'bottom')
		{
			if (me.input.isKeyPressed('left'))
			{
				this.setCurrentAnimation("tux_walk");

				// flip the sprite axis on left movement
				this.flipX(true);

				// update the player velocity
				this.vel.x -= this.accel.x * me.timer.tick;

				me.audio.play("walk");
			}
			else if (me.input.isKeyPressed('right'))
			{
				this.setCurrentAnimation("tux_walk");
				this.flipX(false);
				this.vel.x += this.accel.x * me.timer.tick;
				me.audio.play("walk");
			}
			else
			{
				this.vel.x = 0;
			}
		}
		// gravity is left or right movement
		else
		{
			if (me.input.isKeyPressed('up'))
			{
				this.setCurrentAnimation("tux_walk");
				this.flipY(true);
				this.vel.y -= this.accel.y * me.timer.tick;
				me.audio.play("walk");
			}
			else if (me.input.isKeyPressed('down'))
			{
				this.setCurrentAnimation("tux_walk");
				this.flipY(false);
				this.vel.y += this.accel.y * me.timer.tick;
				me.audio.play("walk");
			}
			else
			{
				this.vel.y = 0;
			}
		}

		// gravity flip
		if (me.input.isKeyPressed('jump'))
		{
			switch (gravity)
			{
				// changing gravity from top to right
				case 'bottom':
					if (this.vel.y === 0)
					{
						this.gravity *= -1;
						this.setCurrentAnimation("tux_stand");
						// flip sprite on y-axis
						this.flipY(true);
						gravity = 'top';
						me.audio.play("gravity");
					}
					break;
				case 'top':
					if (this.vel.y === 0)
					{
						this.gravity *= -1;
						this.setCurrentAnimation("tux_stand");
						this.flipY(false);
						gravity = 'bottom';
						me.audio.play("gravity");
					}
					break;
				case 'left':
					if (this.vel.x === 0)
					{
						this.gravityX *= -1;
						this.setCurrentAnimation("tux_stand");
						this.flipX(true);
						gravity = 'right';
						me.audio.play("gravity");
					}
					break;
				case 'right':
					if (this.vel.x === 0)
					{
						this.gravityX *= -1;
						this.setCurrentAnimation("tux_stand");
						this.flipX(false);
						gravity = 'left';
						me.audio.play("gravity");
					}
					break;
			}
		}

		// updades gravityX (engine does the normal one)
		if (this.gravityX)
		{
			// apply a constant gravity (if not on a ladder)
			this.vel.x += !this.onladder ? (this.gravityX * me.timer.tick) : 0;

			// check if falling / jumping
			this.falling = (this.vel.x > 0);
			this.jumping = this.falling ? false : this.jumping;
		}
		// check & update player movement
		this.updateMovement();

		// check for collision
		var res = me.game.collide(this);

		if (res)
		{
			// death event
			if (res.obj.name === "spikes")
			{
				//reset position
				this.pos.x = this.initX;
				this.pos.y = this.initY;
				this.angle = 0;
				this.updateColRect(0, 23, 0, 42);

				// reset gravity
				this.gravityX = 0;
				this.gravity = this.initGravity;

				// set speed to 0
				this.vel.x = 0;
				this.vel.y = 0;

				// reset animation
				this.setCurrentAnimation("tux_stand");
				this.flipX(false);
				this.flipY(false);
				gravity = "bottom";

				// fades red
				me.game.viewport.fadeOut("#FF0000");

				me.audio.play("die");
			}

			// snowstorm touched and 300ms passed
			else if (res.obj.name === "snowstorm" && (me.timer.getTime() - lastTicked > 300))
			{
				// makes the snowstorm suck the player into its center
				if (res.x !== 0)
				{
					// x axis
					if (res.x < 0)
					{
						this.pos.x -= 20 + (this.width - 20) / 2;	// collision left
					}
					else
					{
						this.pos.x += this.width - (this.width - 20) / 2;	// collision right
					}
				}
				else
				{
					// y axis
					if (res.y < 0)
					{
						this.pos.y -= 20 + (this.height - 20) / 2;	// collision top
					}
					else
					{
						this.pos.y += this.height - (this.height - 20) / 2;	// collision bottom
					}
				}

				// rotates gravity
				switch (gravity)
				{
					// changing gravity from top to right
					case 'top':
						this.gravityX = this.initGravity;
						this.gravity = 0;
						this.angle = Math.PI / 2;
						this.setCurrentAnimation("tux_stand");
						this.flipX(true);	// foot right
						gravity = 'right';
						// adjust the bounding box
						this.updateColRect(-10.5, 42, 10, 23);
						break;

					case 'bottom':
						this.gravityX = this.initGravity * -1;
						this.gravity = 0;
						this.angle = Math.PI / 2;
						this.setCurrentAnimation("tux_stand");
						this.flipX(false);	// foot left
						gravity = 'left';
						this.updateColRect(-10.5, 42, 10, 23);
						break;
					case 'left':
						this.gravityX = 0;
						this.gravity = this.initGravity * -1;
						this.angle = 0;
						this.setCurrentAnimation("tux_stand");
						this.flipY(true);	// foot up
						gravity = 'top';
						this.updateColRect(0, 23, 0, 42);
						break;
					case 'right':
						this.gravityX = 0;
						this.gravity = this.initGravity;
						this.angle = 0;
						this.setCurrentAnimation("tux_stand");
						this.flipY(false);	// foot down
						gravity = 'bottom';
						this.updateColRect(0, 23, 0, 42);
						break;
				}
				me.audio.play("snowstorm");

				// resets the tick
				lastTicked = me.timer.getTime();
			}
		}

		// loads menu
		if (me.input.isKeyPressed('escape'))
		{
			me.state.change(me.state.MENU);
		}

		// update player animation
		if (this.vel.x !== 0 || this.vel.y !== 0)
		{
			this.parent();
			return true;
		}

		// else inform the engine we did not perform
		return false;
	}
});

/****************************************************************************************/
/*									sound on/off button									*/
/****************************************************************************************/
var soundButton = me.GUI_Object.extend(
{
	init: function(x, y)
	{
		// parent constructor
		this.parent(x, y,
		{
			spritewidth: 24,
			spriteheight: 24,
			image: "sound_on"
		});

		// makes sound button stay when level is changed
		this.isPersistent = true;
	},
	onClick: function()
	{
		if (me.audio.isAudioEnable())
		{
			me.audio.disable();
			this.image = me.loader.getImage("sound_off");
			me.audio.stopTrack();
		}
		else {
			me.audio.enable();
			this.image = me.loader.getImage("sound_on");
			me.audio.playTrack("background");
		}
		// don't propagate the event
		return true;
	},
	draw: function(context)
	{
		// draws the sound button
		context.drawImage(this.image, 765, 8, 24, 24);
	}
});

/****************************************************************************************/
/*										menu button										*/
/****************************************************************************************/
var graviTux_logo = me.GUI_Object.extend(
{
	init: function(x, y, obj)
	{
		// parent constructor
		this.parent(x, y,
		{
			spritewidth: obj.canvas.width,
			spriteheight: obj.canvas.height,
			image: obj.canvas
		});
	}
});

/****************************************************************************************/
/*							snowstorm that rotates gravity								*/
/****************************************************************************************/
var snowstorm = me.ObjectEntity.extend(
{
	init: function(x, y)
	{
		// call the parent constructor
		this.parent(x, y,
		{
			spritewidth: 40,
			spriteheight: 40,
			image: "snowstorm",
			name: "snowstorm",
			collidable: true
		});

		// reduces the hitbox by 20x20 pixel
		this.updateColRect(10, 20, 10, 20);
	}
});

/****************************************************************************************/
/*										spikes											*/
/****************************************************************************************/
var spikes = me.InvisibleEntity.extend(
{
	init: function(x, y, settings)
	{
		this.parent(x, y, settings);

		//reduces hitbox by 8x8 pixel
		this.updateColRect(8, this.width - 16, 8, this.height - 16);
	}
});

/****************************************************************************************/
/*									load next level										*/
/****************************************************************************************/
var LevelEntity = me.LevelEntity.extend(
{
	init: function(x, y, settings)
	{
		// loads the next level if it exists
		levelCurrent = parseInt(me.levelDirector.getCurrentLevelId());
		if (levelCurrent < me.levelDirector.levelCount())
		{
			if (levelCurrent > 1)
			{
				me.audio.playTrack("win");	// should be done more elegant
			}

			settings.to = levelCurrent + 1;
		}
		else
		{
			console.log("game done!");
			me.state.change(me.state.MENU);
		}
		settings.duration = 250;
		settings.fade = "#FFFFFF"
		this.parent(x, y, settings);


		// reduces hit box from 40x40 to 30x30
		this.updateColRect(5, 30, 5, 30);
	}
});

/****************************************************************************************/
/*									Menu Buttons										*/
/****************************************************************************************/
var GUI_Button = me.GUI_Object.extend(
{
	init: function(x, y, w, h, text, id)
	{
		// Set z-order
		this.z = 1000;

		// Create a GUID to identify this object later
		this.GUID = id;

		// Create font object
		font = new me.Font("body_font", 40, "white");
		this.menu_tux = me.loader.getImage("menu_tux");

		// Draw a button image
		this.ctx = me.video.createCanvasSurface(w, h);
		font.draw(this.ctx, text, 40, h * 0.75);

		// Draw a "hovered" button image
		this.hoverctx = me.video.createCanvasSurface(w, h);
		font.draw(this.hoverctx, text, 40, h * 0.75);
		this.hoverctx.drawImage(this.menu_tux, 0, 0);

		window.GUI_hover = 1;

		// Create the GUI_Object
		this.parent(x - 40, y,
		{
			image: this.ctx.canvas,
			spritewidth: this.ctx.canvas.width,
			spriteheight: this.ctx.canvas.height
		});

		// Register the hover event
		me.input.registerMouseEvent('mousemove', this, this.hover.bind(this));
		me.input.bindKey(me.input.KEY.ENTER, "stateChange", true);
		me.input.bindKey(me.input.KEY.UP, "up", true);
		me.input.bindKey(me.input.KEY.DOWN, "down", true);
	},
	hover: function()
	{
		// Set this object's GUID into a global variable
		window.GUI_hover = this.GUID;
	},
	update: function()
	{
		// changes state
		if (window.GUI_hover === this.GUID)
		{
			switch (this.GUID)
			{
				case 1:
					if (me.input.isKeyPressed('stateChange'))
					{
						me.state.change(me.state.PLAY);
					}
					//selects next state
					else if (me.input.isKeyPressed('down'))
					{
						window.GUI_hover = 2;
					}
					break;
				case 2:
					if (me.input.isKeyPressed('stateChange'))
					{
						if (levelCurrent !== null)
						{
							me.levelDirector.loadLevel(levelCurrent);
						}
					}
					// selects previous state
					else if (me.input.isKeyPressed('up'))
					{
						window.GUI_hover = 1;
					}
					//selects next state
					else if (me.input.isKeyPressed('down'))
					{
						window.GUI_hover = 3;
					}
					break;
				case 3:
					if (me.input.isKeyPressed('stateChange'))
					{
						me.state.change(me.state.SCORE);
					}
					// selects previous state
					else if (me.input.isKeyPressed('up'))
					{
						window.GUI_hover = 2;
					}
					//selects next state
					else if (me.input.isKeyPressed('down'))
					{
						window.GUI_hover = 4;
					}
					break;
				case 4:
					if (me.input.isKeyPressed('stateChange'))
					{
						me.state.change(me.state.CREDITS);
					}
					// selects previous state
					else if (me.input.isKeyPressed('up'))
					{
						window.GUI_hover = 3;
					}
					//selects next state
					else if (me.input.isKeyPressed('down'))
					{
						window.GUI_hover = 5;
					}
					break;
				case 5:
					if (me.input.isKeyPressed('stateChange'))
					{
						me.state.change(me.state.GAME_END);
					}
					// selects previous state
					else if (me.input.isKeyPressed('up'))
					{
						window.GUI_hover = 4;
					}
					break;
				default:
					break;
			}
		}
		return true;
	},
	draw: function(context)
	{
		// Switch between "hovered" and "not hovered" image
		if (window.GUI_hover === this.GUID)
		{
			this.image = this.hoverctx.canvas;
		}
		else
		{
			this.image = this.ctx.canvas;
		}

		this.parent(context);
	},
	onDestroyEvent: function()
	{
		me.input.releaseMouseEvent('mousemove', this);
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.DOWN);
	},
});
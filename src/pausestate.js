function pauseState(game, title, gameLevel)
{
	gameState.call(this, game);
	this.title = title;
	this.level = gameLevel;
}

pauseState.prototype = Object.create(gameState.prototype);
pauseState.prototype.allowSelect = false;
pauseState.prototype.selectedId = 0;
pauseState.prototype.isUp = false;

pauseState.prototype.init = function()
{
	if(this.isUp)
	{
		removeGameState(this);
		return;
	}

  this.cursors = game.input.keyboard.createCursorKeys();
	this.selectKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	this.blackout = this.game.add.graphics();
	this.blackout.beginFill(0x000000);
	this.blackout.lineStyle(1, 0x000000, 1);
	this.blackout.drawRect(0,0, this.game.width, this.game.height);
	this.blackout.fixedToCamera = true;
	this.blackout.alpha = .8;

	this.optionsText = [];
	this.optionsText.push(this.game.add.text(this.game.width / 2, 10, "Continue", {fill:"#FFFFFF"}));
	this.optionsText.push(this.game.add.text(this.game.width / 2, 10, "Restart", {fill:"#FFFFFF"}));
	this.optionsText.push(this.game.add.text(this.game.width / 2, 10, "Back to Level Select", {fill:"#FFFFFF"}));

	this.optionsText[0].type = "continue";
	this.optionsText[1].type = "restart";
	this.optionsText[2].type = "levels";



	for(var i = 0; i < this.optionsText.length; i++)
	{
		this.optionsText[i].anchor.set(.5,0);
		this.optionsText[i].fixedToCamera = true;
		this.optionsText[i].cameraOffset.y = i * 50 + 100;
	}

	this.titleText = this.game.add.text(this.game.width / 2, 10, this.title, {fill:"#FFFFFF"});
	this.titleText.fixedToCamera = true;
	this.titleText.anchor.set(.5, 0);

	this.selectCursor = this.game.add.sprite(100, 100, "player");
	this.selectCursor.fixedToCamera = true;
	this.selectCursor.anchor.set(.5, .5);
	this.selectCursor.scale.set(.5, .5);

	pauseState.prototype.isUp = true;
}


pauseState.prototype.update = function()
{
	gameState.prototype.update.call(this);

	if(this.cursors.up.isDown)
	{
		if(this.allowSelect)
		{
			this.selectedId--;
		}
		this.allowSelect = false;
	}
	else if(this.cursors.down.isDown)
	{
		if(this.allowSelect)
		{
			this.selectedId++;
		}
		this.allowSelect = false;
	}
	else if(this.selectKey.isDown)
	{
		if(this.allowSelect)
		{
			switch(this.optionsText[this.selectedId].type)
			{
				default:
				break;
				case "continue":
					this.close();
					removeGameState(this);
				break;

				case "restart":
					if(this.level != null && this.level !== undefined)
					{
						clearGameStates();
						addGameState(new playGameState(this.game, this.level));
					}
				break;

				case "levels":
						clearGameStates();
						addGameState(new levelSelectState(this.game));
				break;
			}
		}
		this.allowSelect = false;
	}
	else
	{
		this.allowSelect = true;
	}

	if(this.selectedId < 0)
	{
		this.selectedId = 0;
	}
	if(this.selectedId >= this.optionsText.length)
	{
		this.selectedId = this.optionsText.length - 1;
	}

	this.selectCursor.cameraOffset.x = this.optionsText[this.selectedId].cameraOffset.x - this.optionsText[this.selectedId].width/2 - this.selectCursor.width;
	this.selectCursor.cameraOffset.y = this.optionsText[this.selectedId].cameraOffset.y;

	//this.selectCursor.cameraOffset.x = 10;
	//this.selectCursor.cameraOffset.y = 10;
}

pauseState.prototype.close = function()
{
	gameState.prototype.close.call(this);
	
	this.selectCursor.kill();

	this.titleText.destroy();

	for(var i = 0; i < this.optionsText.length; i++)
	{
		this.optionsText[i].destroy();
	}

	this.blackout.destroy();

	pauseState.prototype.isUp = false;
}


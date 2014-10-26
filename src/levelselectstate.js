//Screen the player will see when selecting a level

function levelSelectState(game)
{
	gameState.call(this, game);
}

levelSelectState.prototype = Object.create(gameState.prototype);
levelSelectState.prototype.allowMovement = true;	//Allow input to switch levels
levelSelectState.prototype.fullyLoaded = false;	//Must do async loading first
levelSelectState.prototype.allowSelect = false;	//Must do async loading first

levelSelectState.prototype.init = function()
{
	//load extra resources
	this.game.stage.backgroundColor = "#CCAAEE";
	var myself = this;

	$.getJSON("assets/levels/levellist.json", function(json){
		myself.levels = json.levels;

		//apply local unlocked levels from localstorage
		
		for(var i = 0; i < unlockedLevels.length; i++)
		{
			myself.levels[unlockedLevels[i]].locked = false;
		}

		myself.completeInit();
		myself.fullyLoaded = true;
	});
}

levelSelectState.prototype.completeInit = function()
{

	this.selectCursor = this.game.add.sprite(0,0, "player");	//used to indicate what level the player is over
	this.selectCursor.anchor.set(.5,.5);
	this.selectCursor.scale.x = .4;
	this.selectCursor.scale.y = .4;
	
	this.allowMovement = true;

  this.cursors = game.input.keyboard.createCursorKeys();
	this.selectKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	this.currentSelection = 0;

	var curLevel = localStorage.getItem("currentLevel");
	if(curLevel != null)
	{
		this.currentSelection = parseInt(curLevel);
	}

	this.levelTiles = this.game.add.group();

	for(var i = 0; i < this.levels.length; i++)
	{
		var tile = this.game.add.sprite(this.levels[i].x,this.levels[i].y,"unlockedlevel");
		if(this.levels[i].locked == true)
		{
			tile.loadTexture("lockedlevel");
		}
		tile.anchor.set(.5,.5);
		this.levelTiles.add(tile);
	}

	this.selectCursor.bringToTop();

	this.moveTo(this.currentSelection);
}

levelSelectState.prototype.update = function()
{
	if(!this.fullyLoaded)
	{
		return;
	}
	gameState.prototype.update.call(this);
	if(this.cursors.right.isDown)
	{
		this.moveRight();
	}
	if(this.cursors.left.isDown)
	{
		this.moveLeft();
	}
	if(this.cursors.up.isDown)
	{
		this.moveUp();
	}
	if(this.cursors.down.isDown)
	{
		this.moveDown();
	}
	if(this.selectKey.isDown)
	{
		if(this.allowSelect && this.allowMovement)
		{
			//Select level and switch state
			clearGameStates();
			addGameState(new playGameState(this.game, this.levels[this.currentSelection]));
		}
	}
	else
	{
		this.allowSelect = true;
	}
}

levelSelectState.prototype.moveTo = function(id)
{
	if(!this.allowMovement || this.levels[id].locked != false)
	{
		return false;
	}

	this.allowMovement = false;

	var tween = this.game.add.tween(this.selectCursor);
	tween.to({x: this.levels[id].x, y: this.levels[id].y}, 200).start();
	tween.onComplete.add(function()
	{
		this.allowMovement = true;
		this.currentSelection = id;
		localStorage.setItem("currentLevel", this.currentSelection);
	}, this);


	return true;
}

//TODO: REFACTOR LATER
levelSelectState.prototype.moveLeft = function()
{
	if(this.levels[this.currentSelection].pathLeft == -1)
		return false;

	return this.moveTo(this.levels[this.currentSelection].pathLeft);
}
levelSelectState.prototype.moveRight = function()
{
	if(this.levels[this.currentSelection].pathRight == -1)
		return false;

	return this.moveTo(this.levels[this.currentSelection].pathRight);
}
levelSelectState.prototype.moveUp = function()
{
	if(this.levels[this.currentSelection].pathUp == -1)
		return false;

	return this.moveTo(this.levels[this.currentSelection].pathUp);
}
levelSelectState.prototype.moveDown = function()
{
	if(this.levels[this.currentSelection].pathDown == -1)
		return false;

	return this.moveTo(this.levels[this.currentSelection].pathDown);
}

levelSelectState.prototype.close = function()
{
	gameState.prototype.close.call(this);

	this.selectCursor.kill();
	this.levelTiles.removeAll();
}

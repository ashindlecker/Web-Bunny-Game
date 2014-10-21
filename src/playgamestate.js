function playGameState(game)
{
  gameState.call(this, game);
}

playGameState.prototype = Object.create(gameState.prototype);

playGameState.prototype.ST_PLAY = 0;
playGameState.prototype.ST_PAUSE = 1;
playGameState.prototype.ST_WON = 2;
playGameState.prototype.ST_LOSS = 3;

//UI Renderables
playGameState.prototype.stageClearFade = null;
playGameState.prototype.stageClearText = null;
playGameState.prototype.stageClearPressEnterText = null;
playGameState.prototype.stageEnterNameText = null;
playGameState.prototype.stageEnterLevelText = null;
playGameState.prototype.stageUIOffset = {x: 0, y: 0, alpha: 1};

playGameState.prototype.moves = 0;

playGameState.prototype.levelId = 0;
playGameState.prototype.worldId = 0;
playGameState.prototype.levelName = "N/A";
playGameState.prototype.levelType = "normal";
playGameState.prototype.maxMoves = -1;
playGameState.prototype.silverStandard = -1;
playGameState.prototype.goldStandard = -1;

playGameState.prototype.init = function()
{
  //setup game
  this.cursors = game.input.keyboard.createCursorKeys();
	this.doubleJumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
  this.game.world.setBounds(0,0,800,800);
  this.game.stage.backgroundColor = "#000000";

	this.state = this.ST_PLAY;
	this.moves = 0;

  this.setMap("testmap")
	this.player = this.addEntity(new character(this.tilemap));
	this.game.camera.follow(this.player.gameObject);

	this.showLevelEnterUI();
}

playGameState.prototype.update = function()
{
	gameState.prototype.update.call(this);

	//Input for player
	if(this.state == this.ST_PLAY)
	{
		if(this.cursors.left.isDown)
		{
			if(this.doubleJumpKey.isDown)
			{
				if(this.player.move(new point(-2, 0))) this.moves++;
			}
			else
			{
				if(this.player.move(new point(-1, 0))) this.moves++;
			}
		}
		else if(this.cursors.right.isDown)
		{
			if(this.doubleJumpKey.isDown)
			{
				if(this.player.move(new point(2, 0))) this.moves++;
			}
			else
			{
				if(this.player.move(new point(1, 0))) this.moves++;
			}
		}
	}

	//Check if player is in winzone and won

	var currentTile = this.tilemap.getTile(this.player.tilePos.x, this.player.tilePos.y);
	if(currentTile)
	{
		if(currentTile.tile.type == 2) //is this a winzone tile
		{
			this.winGame();
		}
	}
}

playGameState.prototype.winGame = function()
{
	if(this.state == this.ST_WON)
		return false;	//Game has already been won

	this.state = this.ST_WON;

	if(this.stageClearFade == null)
	{
		this.stageClearFade = game.add.graphics(0,0);
		this.stageClearFade.beginFill(0x000000);
		this.stageClearFade.lineStyle(10, 0x000000, 1);
		this.stageClearFade.drawRect(this.game.camera.x, this.game.camera.y, this.game.width, this.game.height);
		this.stageClearFade.alpha = 0;
	}

	if(this.stageClearText == null)
	{
		this.stageClearText = this.game.add.text(this.game.camera.x + this.game.width / 2, this.game.camera.y + 10, "STAGE CLEAR", {align: "center", fill:"#FFFFFF" } );
		this.stageClearText.anchor.setTo(.5, 0);
		this.stageClearText.alpha = 0;
	}

	this.stageUIOffset.alpha = 0;
	this.stageUIOffset.x = 0;
	this.stageUIOffset.y = 100;

	this.game.world.bringToTop(this.stageEnterNameText);
	this.game.world.bringToTop(this.stageEnterLevelText);

	this.game.add.tween(this.stageClearFade).to( {alpha: 1}, 1000).start();
	this.game.add.tween(this.stageClearText).to( {alpha: 1}, 1000).to({alpha: 1}, 1000).start();
	var tween = this.game.add.tween(this.stageUIOffset).to( {alpha: 1}, 1000).to({alpha: 1}, 1000);
	tween._lastChild.onComplete.add(function()
	{
		if(this.stageClearPressEnterText == null)
		{
			this.stageClearPressEnterText = this.game.add.text(this.game.camera.x + this.game.width / 2, this.game.camera.y + 300, "PRESS ENTER TO CONTINUE", {align: "center", fill:"#FFFFFF" } );
			this.stageClearPressEnterText.anchor.setTo(.5, 0);
		}
	}, this);
	tween.start();
}

playGameState.prototype.render = function()
{
	if(this.stageClearText)
	{
		this.stageClearText.x = this.game.camera.x + 400;
		this.stageClearText.y = this.game.camera.y + 10;
	}
	if(this.stageEnterNameText)
	{
		this.stageEnterNameText.x = (this.game.camera.x + this.game.width / 2) + this.stageUIOffset.x;
		this.stageEnterNameText.y = this.game.camera.y + this.stageUIOffset.y;
		this.stageEnterNameText.alpha = this.stageUIOffset.alpha;
		
		if(this.stageEnterLevelText)
		{
			this.stageEnterLevelText.x = this.stageEnterNameText.x;
			this.stageEnterLevelText.y = this.stageEnterNameText.y + 30;
			this.stageEnterLevelText.alpha = this.stageUIOffset.alpha;
		}
	}
}

playGameState.prototype.setMap = function(name)
{
  this.map = this.game.add.tilemap(name);
  this.map.addTilesetImage("tiles_spritesheet", "tiles");

	for(var i = 0; i < this.map.layers.length; i++)
	{
		this.map.createLayer(this.map.layers[i].name);
	}

	this.tilemap = new tilemap(this.map);

  this.game.stage.backgroundColor = this.map.properties.backgroundColor;
	this.maxMoves = parseInt(this.map.properties.maxMoves);
	this.silverStandard = parseInt(this.map.properties.silver);
	this.goldStandard = parseInt(this.map.properties.gold);
}

//Call this to display level enter text
playGameState.prototype.showLevelEnterUI = function()
{
	this.stageUIOffset.y = -100;
	this.stageUIOffset.alpha = 0;

	this.stageEnterNameText = this.game.add.text(this.game.camera.x + this.game.width / 2, this.game.camera.y - 100, this.map.properties.name, {align: "center", fill:"#FFFFFF" } );
	this.stageEnterNameText.anchor.setTo(0.5, 0);

	this.stageEnterLevelText = this.game.add.text(this.game.camera.x + this.game.width / 2, this.game.camera.y - 100, this.map.properties.world + "-" + this.map.properties.level, {align: "center", fill:"#FFFFFF" } );
	this.stageEnterLevelText.anchor.setTo(0.5, 0);

	this.game.add.tween(this.stageUIOffset).to( {y: 10, alpha: 1}, 1000, Phaser.Easing.Circular.InOut, true)
	.to( {y: 10}, 1000, Phaser.Easing.Circular.InOut, true)
	.to( {x: -1000, alpha: 0}, 1000, Phaser.Easing.Circular.InOut, true); 

	console.log(this.game);
}

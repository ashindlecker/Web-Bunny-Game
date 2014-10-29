function point(x, y)
{
	this.x = x;
	this.y = y;
}

function character(tilemap, characterType)
{
	this.tilemap = tilemap;
	this.gfxPathNodes = new Array();
	this.tilePos = new point(0,0);
	this.destTile= new point(0,0);
	this.characterType = (characterType === undefined) ? 0 : characterType;
}

character.prototype = Object.create(entity.prototype);
character.prototype.type = "character";
character.prototype.moveState = 0;
character.prototype.animationState = 0;

character.prototype.onAdd = function(game)
{
	entity.prototype.onAdd.call(this, game);
	switch(this.characterType)
	{
		default:
		case 0:
			this.gameObject = this.game.add.sprite(0, 0, "player");
			this.gameObject.anchor.set(0,.1);
			//this.game.physics.enable(this.gameObject, Phaser.Physics.ARCADE);
		break;
	}
}

character.prototype.moveTo = function(pos)
{
	if(this.moveState != 0)
	{
		//character is already moving, don't allow another movement change
		return false;
	}

	var tileMovingTo = this.tilemap.getTile(pos.x, pos.y);
	if(tileMovingTo)
	{
		if(tileMovingTo.tile.solid == true)
		{
			return false;	//Tile is a solid, cant move to it
		}
	}
	else
	{
		return false;	//Tile is out of bounds
	}

	var tile = this.tilemap.getTile(this.tilePos.x, this.tilePos.y + 1);
	if(tile)
	{
		tile.tile.onLeave(this, new point(pos.x - this.tilePos.x, pos.y - this.tilePos.y));
	}

	this.destTile = pos;

	//Reset path nodes
	this.gfxPathNodes = [];

	var tempPos = new point(this.tilePos.x, this.tilePos.y);

	var tween = this.game.add.tween(this.gameObject);

	var counter = 1;
	while(tempPos.x != this.destTile.x || tempPos.y != this.destTile.y)
	{
		if(tempPos.x < this.destTile.x)
		{
			tempPos.x++;
		}
		else if(tempPos.x > this.destTile.x)
		{
			tempPos.x--;
		}
		if(tempPos.y < this.destTile.y)
		{
			tempPos.y++;
		}
		else if(tempPos.y > this.destTile.y)
		{
			tempPos.y--;
		}
	
		tween.to( {x: tempPos.x * tilemap.prototype.tileWidth, y: tempPos.y * tilemap.prototype.tileHeight }, 200);
		counter++;
		if(counter > 10000)
		break; 
	}

	this.moveState = 1;

	tween.start();
	tween._lastChild.onComplete.add(function()
	{
		this.moveState = 0;
		var tempPos = this.tilePos;
		this.tilePos = this.destTile;

		var tile = this.tilemap.getTile(this.tilePos.x, this.tilePos.y + 1);
		if(tile)
		{
			tile.tile.onLanding(this, new point(this.destTile.x - tempPos.x,this.destTile.y - tempPos.y));
		}
	}, this);
	
	return true;
}

character.prototype.update = function()
{
	entity.prototype.update.call(this);

	//check for falling
	
	var belowTile = this.tilemap.getTile(this.tilePos.x, this.tilePos.y + 1);
	if(belowTile != null && belowTile.tile.solid == false)	//Does the tile exist and it's a fall through tile?
	{
		while(true)
		{
			var temp = this.tilemap.getTile(belowTile.x, belowTile.y + 1);
			if(temp == null || temp.tile.solid == true)
			{
				break;
			}
			
			belowTile = temp;
		}

		this.moveTo(new point(belowTile.x, belowTile.y));
	}
}

character.prototype.move = function(vel)
{
	return this.moveTo(new point(this.tilePos.x + vel.x, this.tilePos.y + vel.y));
}

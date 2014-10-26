function gameState(game)
{
  this.game = game;
  this.objectGroup = new Array();
}

gameState.prototype.update = function()
{
	for(var i = 0; i < this.objectGroup.length; i++)
	{
		this.objectGroup[i].update();
	}
}

gameState.prototype.init = function(){}
gameState.prototype.render = function(){}

gameState.prototype.close = function()
{
	for(var i = 0; i < this.objectGroup.length; i++)
	{
		if(!this.objectGroup[i] || !this.objectGroup[i].gameObject)
		continue;
		
		this.objectGroup[i].gameObject.kill();
	}
}

gameState.prototype.addEntity = function(ent)
{
  ent.onAdd(this.game);
  this.objectGroup.push(ent);
  return ent;
}

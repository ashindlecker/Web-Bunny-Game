function tilemap(tiledmap)
{
	for(var i = 0; i < tiledmap.layers.length; i++)
	{
		if(tiledmap.layers[i].name == "tilemap")
		{
  		this.tiles = tiledmap.layers[i].data;
			break;
		}
	}

  this.mapX = tiledmap.width;
  this.mapY = tiledmap.height;
	for(var y = 0; y < this.tiles.length; y++)
	{
		for(var x = 0; x < this.tiles[y].length; x++)
		{
			this.tiles[y][x].tile = new tile(this.tiles[y][x], x, y);
		}
	}
}

tilemap.prototype.tileWidth = 70;
tilemap.prototype.tileHeight = 70;

tilemap.prototype.getTile = function(x, y)
{
  if(x >= this.mapX)
  {
    return null;
  }
  if(x < 0)
  {
    return null;
  }
  if(y >= this.mapY)
  {
    return null;
  }
  if(y < 0)
  {
    return null;
  }
  
  return this.tiles[y][x];
}

function tile(tileLayerData, x, y)
{
	this.x = x;
	this.y = y;
	switch(tileLayerData.index)
	{
		case -1:
		this.type = 0;	//Air tile, fall through
		this.solid = false;
		break;

		case 2:
		this.type = 2; //Win zone
		this.solid = false;
		break;

		default:
		this.type = 1;	//Solid tile
		this.solid = true;
		break;
	}
}

tile.prototype.solid = true;
tile.prototype.type = 0;
tile.prototype.onContact = function(entity){console.log("I'VE BEEN CONTACTED");};

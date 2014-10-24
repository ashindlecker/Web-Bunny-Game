function entity()
{

}

entity.prototype.gameObject = null;
entity.prototype.onAdd = function(game){ this.game = game; }
entity.prototype.onEvent = function(type, data){}
entity.prototype.type = "entity";

entity.prototype.update = function(){}

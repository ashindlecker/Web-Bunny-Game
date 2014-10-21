function character()
{
}

character.prototype = Object.create(entity.prototype);

character.prototype.tileX = 0;
character.prototype.tileY = 0;
character.prototype.type = "character";
character.prototype.moveState = "none";
character.prototype.animationState = 0;

function entity()
{

}

entity.prototype.gameObject = null;
entity.prototype.id = -1;
entity.prototype.onAdd = function(game){}
entity.prototype.onEvent = function(type, data){}
entity.prototype.type = "entity";

var game = new Phaser.Game(800,600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update, render: render});
var gameStates = new Array();

function preload()
{
  //load assets
  game.load.image("player", "assets/Player/p1_stand.png");
  game.load.image("tile0", "assets/Tiles/box.png");
  game.load.image("tile1", "assets/Tiles/boxExplosiveAlt.png");
  game.load.tilemap("testmap", "assets/levels/testlevel.json", null, Phaser.Tilemap.TILED_JSON);
  game.load.image("tiles", "assets/Tiles/tiles_spritesheet.png", null, Phaser.Tilemap.TILED_JSON);
}

function create()
{
  //start the game
  game.physics.startSystem(Phaser.Physics.ARCADE);

  addGameState(new playGameState(game));
}

function update()
{
  for(var i = 0; i < gameStates.length; i++)
  {
    gameStates[i].update();
  }
}

function render()
{
  game.debug.cameraInfo(game.camera, 32, 32);
  for(var i = 0; i < gameStates.length; i++)
  {
    gameStates[i].render();
  }
}

function addGameState(state)
{
  gameStates.push(state);
  state.init();
}

function gameState(game)
{
  this.game = game;
  this.objectGroup = new Array();
}

gameState.prototype.update = function(){}
gameState.prototype.init = function(){}
gameState.prototype.render = function(){}

gameState.prototype.close = function()
{
  for(var i = 0; i < this.objectGroup.length; i++)
  {
    this.objectGroup[i].kill();
  }
}

gameState.prototype.addEntity = function(ent)
{
  ent.onAdd(this.game);
  this.objectGroup.push(ent);
  return ent;
}

function playGameState(game)
{
  gameState.call(this, game);
}

playGameState.prototype = Object.create(gameState.prototype);

playGameState.prototype.init = function()
{
  //setup game
  this.cursors = game.input.keyboard.createCursorKeys();
  this.game.world.setBounds(0,0,800,800);
  this.game.stage.backgroundColor = "#AAAAFF";

  this.setMap("testmap", "Tile Layer 1")

  this.player = game.add.sprite(40,0, "player");
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.game.physics.arcade.gravity.y = 100;
  this.player.body.collideWorldBounds = true;
  this.player.body.setSize(70,80,0,0);
}

playGameState.prototype.update = function()
{
  this.game.physics.arcade.collide(this.player, this.layer);
  var movespeed = 200;
  if(this.cursors.left.isDown)
  {
    this.player.body.velocity.x = -movespeed;
  }
  else if(this.cursors.right.isDown)
  {
    this.player.body.velocity.x = movespeed;
  }
  else
  {
    this.player.body.velocity.x = 0;
  }
}

playGameState.prototype.render = function()
{
}

playGameState.prototype.setMap = function(name, layer)
{
  this.map = this.game.add.tilemap(name);
  this.map.addTilesetImage("tiles_spritesheet", "tiles");
  this.layer = this.map.createLayer(layer);
  this.map.setCollisionByExclusion([0]);
}

function tile()
{
}

tile.prototype.type = 0;
tile.prototype.xid = 0;
tile.prototype.yid = 0;
tile.prototype.onContact = function(entity){console.log("I'VE BEEN CONTACTED");};

function tilemap(tileArray, sizeX, sizeY)
{
  this.tiles = tileArray;
  this.mapX = sizeX;
  this.mapY = sizeY;
}

tilemap.prototype = Object.create(entity.prototype);

tilemap.prototype.tileWidth = 70;
tilemap.prototype.tileHeight = 70;

tilemap.prototype.onAdd = function(game)
{

  for(var i = 0; i < this.mapX; i++)
  {
    for(var j = 0; j < this.mapY; j++)
    {
      var tile = null;
      //Add tiles here
      switch(this.tiles[i][j].type)
      {
        //empty tile (air tile)
        case -1:
          break;
        default:
        case 0:
          tile = game.add.sprite(i * this.tileWidth, j * this.tileHeight, "tile0");
          break;
        case 1:
          tile = game.add.sprite(i * this.tileWidth, j * this.tileHeight, "tile1");
          break;
      }
    }
  }
}

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
  
  return this.tiles[x][y];
}

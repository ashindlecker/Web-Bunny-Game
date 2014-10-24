
var game = new Phaser.Game(800,600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update, render: render});
var gameStates = new Array();

function preload()
{
  //entity assets
  game.load.image("player", "assets/Player/p1_stand.png");

	//tilesets
  game.load.tilemap("testmap", "assets/levels/testlevel.json", null, Phaser.Tilemap.TILED_JSON);
  game.load.image("tiles", "assets/Tiles/tiles_spritesheet.png");

	//overworld assets
	game.load.image("unlockedlevel", "assets/Tiles/boxCoin.png");
	game.load.image("lockedlevel", "assets/Tiles/boxCoin_disabled.png");
}

function create()
{
  //start the game
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //addGameState(new playGameState(game));
	addGameState(new levelSelectState(game));
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

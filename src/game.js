
var game = new Phaser.Game(800,600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update, render: render});
var gameStates = new Array();

function preload()
{
  //entity assets
  game.load.image("player", "assets/Player/p1_stand.png");

	//tilesets
  game.load.image("tiles", "assets/Tiles/tiles_spritesheet.png");

	//maps
  game.load.tilemap("1-1", "assets/levels/1-1.json", null, Phaser.Tilemap.TILED_JSON);
  game.load.tilemap("1-2", "assets/levels/1-2.json", null, Phaser.Tilemap.TILED_JSON);

	//overworld assets
	game.load.image("unlockedlevel", "assets/Tiles/boxCoin.png");
	game.load.image("lockedlevel", "assets/Tiles/boxCoin_disabled.png");

}

function create()
{
  //start the game
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //addGameState(new playGameState(game, "1-2"));
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

function clearGameStates()
{
	for(var i = 0; i < gameStates.length; i++)
	{
		if(!gameStates[i]) continue;
		gameStates[i].close();
	}
	gameStates = [];
}

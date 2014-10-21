
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

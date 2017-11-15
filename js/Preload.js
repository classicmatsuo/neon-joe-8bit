var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('mario', 'assets/tilemaps/neonjoe3.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/images/super_mario.png');
    this.load.spritesheet('player', 'assets/images/neonsprite.png', 32, 63);
    this.load.image('coin', 'assets/images/heyumphheads.png');

    //gamepad buttons
    this.load.spritesheet('buttonvertical', 'assets/buttons/buttons-big/button-vertical.png',64,64);
    this.load.spritesheet('buttonhorizontal', 'assets/buttons/buttons-big/button-horizontal.png',96,64);
    this.load.spritesheet('buttondiagonal', 'assets/buttons/buttons-big/button-diagonal.png',64,64);
    this.load.spritesheet('buttonfire', 'assets/buttons/buttons-big/button-round-a.png',96,96);
    this.load.spritesheet('buttonjump', 'assets/buttons/buttons-big/button-round-b.png',96,96);

    //audio
    this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
  },
  create: function() {
    this.state.start('Game');
  }
};
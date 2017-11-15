var SideScroller = SideScroller || {};

var left=false;
var right=false;
var jumpButton=false;

SideScroller.Game = function(){};

SideScroller.Game.prototype = {

  preload: function() {
    this.game.time.advancedTiming = true;
  },
  create: function() {
    
    if (!this.game.device.desktop){ this.game.input.onDown.add(gofull, this); } 
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('mario');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('SuperMarioBros', 'tiles');

    //create layers
    this.backgroundlayer = this.map.createLayer('World1');
    this.blockedLayer = this.map.createLayer('World2');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 5000, true, 'World2');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    //create coins
    this.createCoins();

    //create player
    this.player = this.game.add.sprite(63, this.game.world.height - 150, 'player');

    //enable physics on the player
    this.game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE);

    //player gravity
    // this.player.body.gravity.y = 350;

    this.player.body.bounce.y = 0.1;
    this.player.body.gravity.y = 400;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(20, 32, 5, 16);
    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //properties when the player is ducked and standing, so we can use in update()
    // var playerDuckImg = this.game.cache.getImage('playerDuck');
    // this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    // this.player.standDimensions = {width: this.player.width, height: this.player.height};
    // this.player.anchor.setTo(0.5, 1);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //init game controller
    // this.initGameController();

    // create our virtual game controller buttons 
    this.buttonjump = this.game.add.button(500, 250, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
    this.buttonjump.fixedToCamera = true;  //our buttons should stay on the same place  
    this.buttonjump.events.onInputOver.add(function(){jumpButton=true;});
    this.buttonjump.events.onInputOut.add(function(){jumpButton=false;});
    this.buttonjump.events.onInputDown.add(function(){jumpButton=true;});
    this.buttonjump.events.onInputUp.add(function(){jumpButton=false;});

    this.buttonfire = this.game.add.button(600, 250, 'buttonfire', null, this, 0, 1, 0, 1);
    this.buttonfire.fixedToCamera = true;
    this.buttonfire.events.onInputOver.add(function(){fire=true;});
    this.buttonfire.events.onInputOut.add(function(){fire=false;});
    this.buttonfire.events.onInputDown.add(function(){fire=true;});
    this.buttonfire.events.onInputUp.add(function(){fire=false;});        

    this.buttonleft = this.game.add.button(0, 210, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    this.buttonleft.fixedToCamera = true;
    this.buttonleft.events.onInputOver.add(function(){left=true;});
    this.buttonleft.events.onInputOut.add(function(){left=false;});
    this.buttonleft.events.onInputDown.add(function(){left=true;});
    this.buttonleft.events.onInputUp.add(function(){left=false;});

    this.buttonbottomleft = this.game.add.button(32, 275, 'buttondiagonal', null, this, 6, 4, 6, 4);
    this.buttonbottomleft.fixedToCamera = true;
    this.buttonbottomleft.events.onInputOver.add(function(){left=true;duck=true;});
    this.buttonbottomleft.events.onInputOut.add(function(){left=false;duck=false;});
    this.buttonbottomleft.events.onInputDown.add(function(){left=true;duck=true;});
    this.buttonbottomleft.events.onInputUp.add(function(){left=false;duck=false;});

    this.buttonright = this.game.add.button(160, 210, 'buttonhorizontal', null, this, 0, 1, 0, 1);
    this.buttonright.fixedToCamera = true;
    this.buttonright.events.onInputOver.add(function(){right=true;});
    this.buttonright.events.onInputOut.add(function(){right=false;});
    this.buttonright.events.onInputDown.add(function(){right=true;});
    this.buttonright.events.onInputUp.add(function(){right=false;});

    this.buttonbottomright = this.game.add.button(160, 275, 'buttondiagonal', null, this, 7, 5, 7, 5);
    this.buttonbottomright.fixedToCamera = true;
    this.buttonbottomright.events.onInputOver.add(function(){right=true;duck=true;});
    this.buttonbottomright.events.onInputOut.add(function(){right=false;duck=false;});
    this.buttonbottomright.events.onInputDown.add(function(){right=true;duck=true;});
    this.buttonbottomright.events.onInputUp.add(function(){right=false;duck=false;});

    this.buttondown = this.game.add.button(96, 275, 'buttonvertical', null, this, 0, 1, 0, 1);
    this.buttondown.fixedToCamera = true;
    this.buttondown.events.onInputOver.add(function(){duck=true;});
    this.buttondown.events.onInputOut.add(function(){duck=false;});
    this.buttondown.events.onInputDown.add(function(){duck=true;});
    this.buttondown.events.onInputUp.add(function(){duck=false;});

    //sounds
    this.coinSound = this.game.add.audio('coin');

    //  The score
    this.scoreText = this.game.add.text(16, 16, 'werewolf heads: 0', { fontSize: '18px', fill: '#39FF14' });
    this.scoreText.fixedToCamera = true;
    
    this.score = 0

    this.gameOverText = this.game.add.text(16, 16, 'Press Any Key To Start', { fontSize: '20px', fill: '#fff', align: "center" });
    this.gameOverText.anchor.setTo(-1, -3);
    this.gameOverText.fixedToCamera = true;
  },
  //some useful functions
  gofull: function() { this.game.scale.startFullScreen(false);},
  jump_now: function(){  //jump with small delay
    if (this.game.time.now > nextJump ){
        player.body.moveUp(600);
        nextJump = game.time.now + 900;
    }
  },
 //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  //update
  update: function() {
    this.jumpTimer = 0;
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
     // Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    
    //only respond to keys and keep the speed if the player is alive
    if(this.player.alive) {
      //  Reset the players velocity (movement)
      this.player.body.velocity.x = 0;

      if (this.cursors.left.isDown || left)
      {   
          //  Move to the left
          this.player.body.velocity.x = -150;

          this.player.animations.play('left');

      }
      else if (this.cursors.right.isDown || right)
      {
          //  Move to the right
          this.player.body.velocity.x = 150;

          this.player.animations.play('right');

          //remove the gameover text
          this.gameOverText.text = '';
      }
      else
      {
          //  Stand still
          this.player.animations.stop();

          this.player.frame = 4;
      }
      
      //restart the game if reaching the edge
      if(this.player.body.bottom >= this.world.bounds.bottom) 
      {
        //update the gameover text
        this.gameOverText.text = 'GAME O-HEYUMPH-VER';
        this.game.time.events.add(700, this.gameOver, this);
      }
      if(this.player.body.right >= this.world.bounds.right)
      {
        this.gameOverText.text = 'CONGRATU-HEYUMPH!';
        this.game.time.events.add(500, this.gameOver, this);
      }
    }
    if (jumpButton && this.player.body.onFloor() && this.game.time.now > this.jumpTimer || this.jumpButton.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer)
      {
          this.player.body.velocity.y = -250;
          this.jumpTimer = this.game.time.now + 750;
          
      }

  },
  // playerHit: function(player, blockedLayer) {
  //   //if hits on the right side, die
  //   if(player.body.blocked.right) {

  //     console.log(player.body.blocked);

  //     //set to dead (this doesn't affect rendering)
  //     this.player.alive = false;

  //     //stop moving to the right
  //     this.player.body.velocity.x = 0;

  //     //change sprite image
  //     this.player.loadTexture('playerDead');

  //     //go to gameover after a few miliseconds
  //     this.game.time.events.add(1500, this.gameOver, this);
  //   }
  // },

  //collect coins
  collect: function(player, collectable) {
    // this.heyump.destroy(Phaser.Timer.SECOND * 3);
    //play audio
    this.coinSound.play();

    //remove sprite
    collectable.destroy();

     // Add and update the score
    this.score += 1;
    this.scoreText.text = 'werewolf heads: ' + this.score;

    var style = { font: "16px Courier", fill: "#00ff44" };
    this.heyump = this.game.add.text(0, 0, "heyumph", style);
    this.heyump.alignTo(this.player, Phaser.RIGHT_TOP, 16);

    this.game.time.events.add(1200, this.heyump.destroy, this.heyump);
  },
  
  // fadePicture: function() {
  //   game.add.tween(heyump).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
  // },

  // jump
  pressButtonA: function () {

      this.jumpButton

  },

  // initGameController: function() {
    
  //   if(!GameController.hasInitiated) {
  //     var that = this;
      
  //     GameController.init(
  //     {
  //         left: {
  //             type: 'dpad',
  //         },
  //         right: {
  //             type: 'buttons',
  //             buttons: [
  //               false,
  //               {
  //                 label: 'JUMP', 
  //                 touchStart: function() {
  //                   if(!that.player.alive) {
  //                     return;
  //                   }
  //                   that.playerJump();
  //                 }
  //               },
  //               false,
  //               {
  //                 label: 'B',
  //                 touchStart: function() {
  //                   if(!that.player.alive) {
  //                     return;
  //                   }
  //                   that.pressingDown = true; that.playerDuck();
  //                 },
  //                 touchEnd: function(){
  //                   that.pressingDown = false;
  //                 }
  //               }
  //             ]
  //         },
  //     });
  //     GameController.hasInitiated = true;
  //   }
  // },

  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'coins');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  // gameover
  gameOver: function() {
    this.game.state.start('Game');
  },
  
  // playerJump: function() {
  //   if(this.player.body.blocked.down) {
  //     this.player.body.velocity.y -= 700;
  //   }    
  // },
  // playerDuck: function() {
  //     //change image and update the body size for the physics engine
  //     this.player.loadTexture('playerDuck');
  //     this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
      
  //     //we use this to keep track whether it's ducked or not
  //     this.player.isDucked = true;
  // },
  // render: function()
  //   {
        // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");   
        // this.game.debug.bodyInfo(this.player, 0, 80);   
  //   }
};

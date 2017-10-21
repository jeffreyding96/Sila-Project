var game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });
var WIDTH = 2000;
var HEIGHT = 2000;


function homeload() {
    game.load.spritesheet('water', 'assets/water.png', 32, 400, 32)
}

var background

background = game.add.tileSprite(0, 24*16, 128*16, 24*16, 'waters')

background.animations.add('waves0', [0, 1, 2, 3, 2, 1]);
    background.animations.add('waves1', [4, 5, 6, 7, 6, 5]);
    background.animations.add('waves2', [8, 9, 10, 11, 10, 9]);
    background.animations.add('waves3', [12, 13, 14, 15, 14, 13]);
    background.animations.add('waves4', [16, 17, 18, 19, 18, 17]);
    background.animations.add('waves5', [20, 21, 22, 23, 22, 21]);
    background.animations.add('waves6', [24, 25, 26, 27, 26, 25]);
    background.animations.add('waves7', [28, 29, 30, 31, 30, 29]);

var n = 7;
background.animations.play('waves' + n, 8, true);
}
/*When the start button is clicked the game begins...*/


var player;
var land;

var Player = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'fish');
    this.sprite.width = 50;
    this.sprite.height = 50;

    Player.prototype.update = function() {
        this.checkMovement();
    }

    Player.prototype.checkMovement = function() {
        var movement = 4;
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.sprite.x -= movement;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.sprite.y -= movement;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.sprite.y += movement;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.sprite.x += movement;
        }
    }
}

function preload() {
    game.load.image('earth', 'assets/light_sand.png');
    game.load.image('fish', 'assets/fish.png');
}

function create() {
    game.world.setBounds(0, 0, WIDTH, HEIGHT);
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'earth');

    player = new Player(game, 50, 50, 0);
}

function update() {
    player.update();
}


function render() {

}

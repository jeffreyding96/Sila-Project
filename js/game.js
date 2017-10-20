var game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });
var WIDTH = 2000;
var HEIGHT = 2000;

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

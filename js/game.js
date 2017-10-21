var game = new Phaser.Game("99%", "99%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });
var WIDTH = 2000;
var HEIGHT = 500;

var player;
var land;

var upperBound = HEIGHT / 2 - HEIGHT / 3;
var lowerBound = upperBound + HEIGHT;

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
    land = game.add.tileSprite(0, upperBound, WIDTH, HEIGHT, 'earth');

    game.world.setBounds(0, 0, WIDTH, HEIGHT / 2);

    game.stage.disableVisibilityChange = true;
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    player = new Player(game, 50, 50, 0);

    game.camera.follow(player.sprite);
}

function update() {
    player.update();
    updateCollisions();
}

function updateCollisions() {
    var xPos = player.sprite.x;
    var yPos = player.sprite.y;
    if (xPos <= 0) {
        player.sprite.x = 0;
    }
    if (xPos >= WIDTH - player.sprite.width) {
        player.sprite.x = WIDTH - player.sprite.width;
    }
    if (yPos <= upperBound) {
        player.sprite.y = upperBound;
    }
    if (yPos >= lowerBound - player.sprite.height) {
        player.sprite.y = lowerBound - player.sprite.height;
    }
}

function render() {

}

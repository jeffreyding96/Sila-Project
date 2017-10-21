var game = new Phaser.Game("99%", "99%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });

var roomWidth = 1000;

var WIDTH = 7 * roomWidth;
var HEIGHT = 500;

var player;
var land;
var graphics;

var playerGroup;
var obstacleGroup;
var itemGroup;

var upperBound = HEIGHT / 2 - HEIGHT / 3;
var lowerBound = upperBound + HEIGHT;
var upperLine;
var lowerLine;

var roomLines = [];
var papers = [];

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
    game.load.image('water', 'assets/water.png');
    game.load.image('fish', 'assets/fish.png');
    game.load.image('paper', 'assets/paper.png');
}

function create() {
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT * 2, 'water');

    game.world.setBounds(0, 0, WIDTH, HEIGHT);
    game.stage.disableVisibilityChange = true;
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    createLayers();

    player = new Player(game, 0, HEIGHT / 2, 0);
    game.camera.follow(player.sprite);

    playerGroup.add(player.sprite);

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0xffffff, 1);
    obstacleGroup.add(graphics);

    createBorderLines(graphics);
    createRoomLines(graphics);
    createPapers();
}

function createLayers() {
    obstacleGroup = game.add.group();
    itemGroup = game.add.group();
    playerGroup = game.add.group();

    game.world.bringToTop(obstacleGroup);
    game.world.bringToTop(itemGroup);
    game.world.bringToTop(playerGroup);
}

function createBorderLines(graphics) {
    graphics.moveTo(0, upperBound);
    graphics.lineTo(WIDTH, upperBound);
    graphics.moveTo(0, lowerBound);
    graphics.lineTo(WIDTH, lowerBound);
    graphics.endFill();
}

function createRoomLines(graphics) {
    var i = 0;
    while (i < WIDTH) {
        graphics.moveTo(i, upperBound);
        graphics.lineTo(i, lowerBound);

        i += roomWidth;
    }
    graphics.endFill();
}

function createPapers() {
    var i = roomWidth;
    while (i < WIDTH) {
        var paperSprite = game.add.sprite(i - 100, (lowerBound - upperBound) / 2, 'paper');
        paperSprite.width = 50;
        paperSprite.height = 50;
        papers.push(paperSprite);
        itemGroup.add(paperSprite);

        i += roomWidth;
    }
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

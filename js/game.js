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
var obstacles = [];

var Player = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'fish');
    this.sprite.width = 50;
    this.sprite.height = 50;
    this.sprite.rotation = rot;

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

var Obstacle = function(game, x, y, rot, changeTime, speed) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = game.add.sprite(x, y, 'spongebob');
    this.sprite.width = 100;
    this.sprite.height = 150;
    this.sprite.rotation = rot;
    this.changeDirectionTime = game.time.now;
    this.changeDirectionDelay = changeTime;
    this.moveUp = true;

    Obstacle.prototype.update = function() {
        this.move();
    }

    Obstacle.prototype.move = function() {
        if (game.time.now > this.changeDirectionTime + this.changeDirectionDelay) {
            this.moveUp = !this.moveUp;
            this.changeDirectionTime = game.time.now;
        }
        var movement = this.speed;

        if (this.moveUp) {
            this.sprite.y += movement;
        }
        else {
            this.sprite.y -= movement;
        }
    }
}

function preload() {
    game.load.image('earth', 'assets/light_sand.png');
    game.load.image('waterSprite', 'assets/waterSprite.png');
    game.load.image('fish', 'assets/fish.png');
    game.load.image('paper', 'assets/paper.png');
    game.load.image('spongebob', 'assets/spongebob.png');
}

function create() {
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT * 2, 'waterSprite');

    game.world.setBounds(0, 0, WIDTH, HEIGHT);
    game.stage.disableVisibilityChange = true;
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    createLayers();

    player = new Player(game, 0, HEIGHT / 2, 0);
    playerGroup.add(player.sprite);
    game.camera.follow(player.sprite);

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0xffffff, 1);
    obstacleGroup.add(graphics);

    createBorderLines(graphics);
    createRoomLines(graphics);
    createPapers();
    createObstacles();
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

function createObstacles() {
    var count = 150;
    while (count < WIDTH) {
        for (var i = 0; i < 4; i++) {
            var randX = getRandBetween(count, count + roomWidth - 150);
            var randY = getRandBetween(upperBound - 100, lowerBound - 200);
            var obs = new Obstacle(game, randX, randY, 0, getRandBetween(500, 2000), getRandBetween(2, 5));
            obstacles.push(obs);
            obstacleGroup.add(obs.sprite);
        }
        count += roomWidth;
    }
}

function update() {
    player.update();
    updateCollisions();

    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
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

function getRandBetween(x, y) {
    return Math.random() * (y - x) + x;
}

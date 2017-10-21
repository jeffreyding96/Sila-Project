var game = new Phaser.Game("99%", "99%", Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });

var roomWidth = 1000;

var WIDTH = 7 * roomWidth;
var HEIGHT = 500;

// var background;

// background = game.add.tileSprite(0, 24*16, 128*16, 24*16, 'waters');

// background.animations.add('waves0', [0, 1, 2, 3, 2, 1]);
// background.animations.add('waves1', [4, 5, 6, 7, 6, 5]);
// background.animations.add('waves2', [8, 9, 10, 11, 10, 9]);
// background.animations.add('waves3', [12, 13, 14, 15, 14, 13]);
// background.animations.add('waves4', [16, 17, 18, 19, 18, 17]);
// background.animations.add('waves5', [20, 21, 22, 23, 22, 21]);
// background.animations.add('waves6', [24, 25, 26, 27, 26, 25]);
// background.animations.add('waves7', [28, 29, 30, 31, 30, 29]);

// var n = 7;
// background.animations.play('waves' + n, 8, true);
// //[>When the start button is clicked the game begins...<]

var startButton;
var mysteryBox;
var player;
var land;
var graphics;
var playing = false;

var playerGroup;
var obstacleGroup;
var itemGroup;
var uiGroup;

var upperBound = HEIGHT / 2 - HEIGHT / 3;
var lowerBound = upperBound + HEIGHT;
var upperLine;
var lowerLine;

var roomLines = [];
var papers = [];
var obstacles = [];
var obstacleTypes = ['crab', 'oil', 'bag', 'spongebob'];

var Player = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.sprite = game.add.sprite(x, y, 'animatedFish');
    this.sprite.width = 100;
    this.sprite.height = 50;
    this.sprite.rotation = rot;
    this.sprite.animations.add('animation', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.sprite.play('animation');

    Player.prototype.update = function() {
        this.checkMovement();
    }

    Player.prototype.checkMovement = function() {
        var movement = 4;
        if(playing == true){
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
}

var Obstacle = function(game, x, y, rot) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speed = getRandBetween(2, 5);
    this.type = obstacleTypes[getRandIntBetween(0, obstacleTypes.length)];
    this.sprite = game.add.sprite(x, y, this.type);
    this.sprite.width = 100;
    this.sprite.height = 150;
    this.sprite.rotation = rot;
    this.changeDirectionTime = game.time.now;
    this.changeDirectionDelay = getRandBetween(1000, 2000);
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
    game.load.spritesheet('animatedFish', 'assets/animatedFish.png', 252, 209);
    game.load.image('oil', 'assets/oil1.png');
    game.load.image('bag', 'assets/plastic-bags.png');
    game.load.image('crab', 'assets/Crab.png');
    game.load.spritesheet('start', 'assets/start2.png', 120, 40); 
    game.load.spritesheet('mystery', 'assets/chest.png', 48, 38);
    game.load.image('paper', 'assets/paper.png');
    game.load.image('spongebob', 'assets/spongebob.png');
    game.load.spritesheet('water', 'assets/water.png', 32, 400, 32)
}

function create() {
    land = game.add.tileSprite(0, 0, WIDTH, HEIGHT * 2, 'waterSprite');
    game.world.setBounds(0, 0, WIDTH, HEIGHT);

    createLayers();

    game.stage.disableVisibilityChange = true;
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    player = new Player(game, 0, HEIGHT / 2, 0);
    playerGroup.add(player.sprite);
    game.camera.follow(player.sprite);

    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(5, 0xffffff, 1);
    obstacleGroup.add(graphics);

    createButtons();
    createBorderLines(graphics);
    createRoomLines(graphics);
    createPapers();
    createObstacles();
}

function createButtons() {
    startButton = game.add.button(750, 400, 'start', actionOnClick, this, 1,0,2);
    startButton.x = game.camera.width / 2;
    startButton.y = game.camera.height / 2 - startButton.height / 2;

    startButton.anchor.set(0.5,0.5);
    mysteryBox = game.add.button(game.camera.width - 50, 50, 'mystery', boxOpen, this, 1, 0, 1);
    mysteryBox.anchor.set(0.5,0.5);

    uiGroup.add(startButton);
    uiGroup.add(mysteryBox);
}

function createLayers() {
    obstacleGroup = game.add.group();
    itemGroup = game.add.group();
    playerGroup = game.add.group();
    uiGroup = game.add.group();

    game.world.bringToTop(obstacleGroup);
    game.world.bringToTop(itemGroup);
    game.world.bringToTop(playerGroup);
    game.world.bringToTop(uiGroup);
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
    var count = 100;
    while (count < WIDTH) {
        for (var i = 0; i < 4; i++) {
            var randX;
            while (true) {
                randX = getRandBetween(count, count + roomWidth - 300);
                var tooClose = false;
                for (var i = 0; i < obstacles.length; i++) {
                    if (Math.abs(obstacles[i].x - randX) < 125) {
                        tooClose = true;
                    }
                }
                if (!tooClose) {
                    break;
                }
            }
            var midPoint = (lowerBound - upperBound) / 2;
            var randY = getRandBetween(upperBound - 100, lowerBound - 200);
            var obs = new Obstacle(game, randX, randY, 0);
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

function actionOnClick () {
    startButton.destroy();
    mysteryBox.destroy();
    playing = true;
}

function boxOpen(){
    playing = true;
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

    handlePapers();
    handleObstacles();
}
function handlePapers() {
    for (var i = 0; i < papers.length; i++) {
        if (isRectangleCollision(player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, papers[i].x, papers[i].y, papers[i].width, papers[i].height)) {
            console.log("hi");
        }
    }
}
function handleObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        if (isRectangleCollision(player.sprite.x, player.sprite.y, player.sprite.width, player.sprite.height, obstacles[i].sprite.x, obstacles[i].sprite.y, obstacles[i].sprite.width, obstacles[i].sprite.height)) {
            console.log("hi");
        }
    }
}

function render() {
}

function getRandBetween(x, y) {
    return Math.random() * (y - x) + x;
}
function getRandIntBetween(x, y) {
    return Math.floor(getRandBetween(x, y));
}
function isRectangleCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 < x2 + w1 && x1 + w1 > x2 &&
        y1 < y2 + h2 && h1 + y1 > y2) {
        return true;
    }
    return false;
    // return (Math.abs(x1 - x2) * 2 < (w1 + w2)) && (Math.abs(y1 - y2) * 2 < (h1 + h2));
}
